import { AUDIBLE_STATES, STATE } from './audioStateMachine';
import { buildDarkReverb } from './effects/darkReverb';
import {
  FADE_IN,
  FADE_OUT,
  LAYER_CAPS,
  MASTER_TARGET,
  RAMP_TC,
  curve,
  wait,
} from './gain';
import { buildAir } from './layers/air';
import { buildAnalog, scheduleCrackle } from './layers/analog';
import { buildDrone } from './layers/drone';
import { buildPad } from './layers/pad';
import { buildPulse } from './layers/pulse';
import { buildRain, scheduleDroplets, setRainSublayers } from './layers/rain';

class AudioEngine {
  constructor() {
    this.state = STATE.IDLE;
    this.ctx = null;
    this.masterGain = null;
    this.reverbIn = null;
    this.finalGains = {};
    this._userValues = {};
    this._rainSubs = null;
    this._dropletBuf = null;
    this._analogCrackleBuf = null;
    this._dropTimer = null;
    this._crackTimer = null;
    this._lfoNodes = [];
    this._srcNodes = [];
    this._transition = null;
  }

  async _ensureContext() {
    if (this.ctx && this.ctx.state !== 'closed') return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) throw new Error('Web Audio API not supported.');
    this.ctx = new Ctx();
  }

  _buildGraph() {
    const ctx = this.ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(ctx.destination);

    buildDarkReverb(this);
    buildDrone(this);
    buildPad(this);
    buildRain(this);
    buildAnalog(this);
    buildPulse(this);
    buildAir(this);
  }

  _trackLFO(osc) {
    this._lfoNodes.push(osc);
    return osc;
  }

  _trackSrc(src) {
    this._srcNodes.push(src);
    return src;
  }

  _setRainSublayers(value) {
    return setRainSublayers(this, value);
  }

  _scheduleDroplets(intensity) {
    return scheduleDroplets(this, intensity);
  }

  _scheduleCrackle() {
    return scheduleCrackle(this);
  }

  async _runTransition(task) {
    if (this._transition) return false;
    this._transition = task();
    try {
      await this._transition;
      return true;
    } finally {
      this._transition = null;
    }
  }

  async _fadeMasterTo(target, duration) {
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(target, now + duration);
    await wait(duration * 1000 + 120);
  }

  async play(mix) {
    if (this.state === STATE.PLAYING) return true;
    return this._runTransition(async () => {
      this.state = STATE.STARTING;
      try {
        await this._ensureContext();
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        if (Object.keys(this.finalGains).length === 0) this._buildGraph();
        if (mix) this._applyMixImmediate(mix);

        await this._fadeMasterTo(MASTER_TARGET, FADE_IN);
        this.state = STATE.PLAYING;

        const rainV = this._userValues.rain || 0;
        if (rainV > 0.02) this._setRainSublayers(curve(rainV));
      } catch (error) {
        this.state = STATE.IDLE;
        throw error;
      }
    });
  }

  async pause() {
    if (this.state !== STATE.PLAYING || !this.ctx) return false;
    return this._runTransition(async () => {
      this.state = STATE.PAUSING;
      clearTimeout(this._dropTimer);
      clearTimeout(this._crackTimer);

      await this._fadeMasterTo(0, FADE_OUT);
      if (this.ctx?.state === 'running') await this.ctx.suspend();
      this.state = STATE.PAUSED;
    });
  }

  async resume() {
    if (this.state !== STATE.PAUSED || !this.ctx) return false;
    return this._runTransition(async () => {
      this.state = STATE.RESUMING;
      if (this.ctx.state === 'suspended') await this.ctx.resume();

      await this._fadeMasterTo(MASTER_TARGET, FADE_IN);
      this.state = STATE.PLAYING;

      const rainV = this._userValues.rain || 0;
      if (rainV > 0.02) this._setRainSublayers(curve(rainV));
      this._scheduleCrackle();
    });
  }

  dispose() {
    this.state = STATE.DISPOSING;
    clearTimeout(this._dropTimer);
    clearTimeout(this._crackTimer);
    this._lfoNodes.forEach(o => {
      try {
        o.stop();
        o.disconnect();
      } catch {}
    });
    this._srcNodes.forEach(s => {
      try {
        s.stop();
        s.disconnect();
      } catch {}
    });
    this._lfoNodes = [];
    this._srcNodes = [];
    if (this.ctx && this.ctx.state !== 'closed') this.ctx.close().catch(() => {});
    this.ctx = null;
    this.masterGain = null;
    this.reverbIn = null;
    this.finalGains = {};
    this._rainSubs = null;
    this._userValues = {};
    this.state = STATE.IDLE;
  }

  setVolume(layer, rawValue) {
    const value = Math.max(0, Math.min(1, rawValue));
    this._userValues[layer] = value;
    const gain = this.finalGains[layer];
    if (!gain || !this.ctx) return;
    const target = curve(value) * (LAYER_CAPS[layer] || 0.35);
    const tc = RAMP_TC[layer] || 0.35;
    gain.gain.setTargetAtTime(target, this.ctx.currentTime, tc);
    if (layer === 'rain') this._setRainSublayers(curve(value));
  }

  applyMix(mix) {
    Object.entries(mix).forEach(([layer, value]) => this.setVolume(layer, value));
  }

  _applyMixImmediate(mix) {
    Object.entries(mix).forEach(([layer, value]) => {
      const val = Math.max(0, Math.min(1, value));
      this._userValues[layer] = val;
      const gain = this.finalGains[layer];
      if (!gain) return;
      gain.gain.value = curve(val) * (LAYER_CAPS[layer] || 0.35);
      if (layer === 'rain') this._setRainSublayers(curve(val));
    });
  }

  get isPlaying() {
    return this.state === STATE.PLAYING;
  }

  get isPaused() {
    return this.state === STATE.PAUSED;
  }

  get isIdle() {
    return this.state === STATE.IDLE;
  }

  get isTransitioning() {
    return Boolean(this._transition);
  }
}

const audioEngine = new AudioEngine();
export default audioEngine;
export { AUDIBLE_STATES, AudioEngine, STATE };
