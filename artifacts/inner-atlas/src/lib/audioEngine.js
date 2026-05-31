// Inner Atlas Audio Engine v0.0.7
// Layer redesign: Drone (ritual), Pad (lush/wide), Rain (density not loudness),
// Analog (subtle imperfection), Pulse (body throb), Air (space/height).
// Dark reverb bus for depth. All layers still route → finalUserGain → masterGain.

// ── State ─────────────────────────────────────────────────────────────────

const STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  PLAYING: 'playing',
  PAUSING: 'pausing',
  PAUSED: 'paused',
  RESUMING: 'resuming',
  DISPOSING: 'disposing',
};

const AUDIBLE_STATES = new Set([STATE.STARTING, STATE.PLAYING, STATE.RESUMING]);

// ── Constants ─────────────────────────────────────────────────────────────

const MASTER_TARGET = 0.38;
const FADE_IN       = 2.4;
const FADE_OUT      = 1.8;

// Final output caps — at slider=1.0 this is the absolute max going to master
const LAYER_CAPS = {
  drone:  0.44,
  pad:    0.50,
  rain:   0.52,
  analog: 0.18,
  pulse:  0.22,
  air:    0.16,
};

// Smoothing τ (setTargetAtTime)
const RAMP_TC = {
  drone:  0.50, pad:    0.45, rain:   0.40,
  analog: 0.28, pulse:  0.14, air:    0.45,
};

// Reverb send amounts per layer (wet fraction into reverb bus)
const REVERB_SEND = {
  drone: 0.04, pad: 0.18, rain: 0.08,
  analog: 0.02, pulse: 0.02, air: 0.20,
};

function curve(v) {
  return Math.pow(Math.max(0, Math.min(1, v)), 1.65);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Noise buffers ─────────────────────────────────────────────────────────

function mkPink(ctx, secs = 5) {
  const n = ctx.sampleRate * secs;
  const b = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < n; i++) {
      const w = Math.random()*2-1;
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
      b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
      b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
      d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362)/7.5;
      b6 = w*0.115926;
    }
  }
  return b;
}

function mkBrown(ctx, secs = 6) {
  const n = ctx.sampleRate * secs;
  const b = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    let last = 0;
    for (let i = 0; i < n; i++) {
      last = (last + 0.016*(Math.random()*2-1)) / 1.016;
      d[i] = last * 3.0;
    }
  }
  return b;
}

// Extra-dark noise: very heavily pink (Brownian-ish)
function mkDarkNoise(ctx, secs = 8) {
  const n = ctx.sampleRate * secs;
  const b = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    let last = 0, b0=0,b1=0,b2=0;
    for (let i = 0; i < n; i++) {
      const w = Math.random()*2-1;
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
      b2=0.96900*b2+w*0.1538520;
      const pink = (b0+b1+b2+w*0.5)/4;
      last = (last + 0.02*pink) / 1.02;
      d[i] = last * 5.0;
    }
  }
  return b;
}

function mkBurst(ctx, ms = 55) {
  const n = Math.floor(ctx.sampleRate * ms / 1000);
  const b = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = b.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0;
  for (let i = 0; i < n; i++) {
    const w = Math.random()*2-1;
    b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
    b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
    d[i] = (b0+b1+b2+b3+w*0.5362)/7.5;
  }
  return b;
}

// ── Helpers ───────────────────────────────────────────────────────────────

function lfo(ctx, freq, depth, targetParam, type = 'sine') {
  const osc = ctx.createOscillator();
  const g   = ctx.createGain();
  osc.type = type; osc.frequency.value = freq; g.gain.value = depth;
  osc.connect(g); g.connect(targetParam); osc.start();
  return osc;
}

function loopSrc(ctx, buf) {
  const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; return s;
}

// ── Engine ────────────────────────────────────────────────────────────────

class AudioEngine {
  constructor() {
    this.state       = STATE.IDLE;
    this.ctx         = null;
    this.masterGain  = null;
    this.reverbIn    = null;  // reverb send bus input
    this.finalGains  = {};
    this._userValues = {};
    this._rainSubs   = null;
    this._dropletBuf = null;
    this._dropTimer  = null;
    this._crackTimer = null;
    this._lfoNodes   = [];
    this._srcNodes   = [];
    this._transition = null;
  }

  // ── Init ────────────────────────────────────────────────────────────────

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

    this._buildReverbBus();
    this._buildDrone();
    this._buildPad();
    this._buildRain();
    this._buildAnalog();
    this._buildPulse();
    this._buildAir();
  }

  // ── Reverb Bus (Schroeder-style, dark) ───────────────────────────────────

  _buildReverbBus() {
    const ctx = this.ctx;

    // Input gain — all layer sends connect here
    this.reverbIn = ctx.createGain();
    this.reverbIn.gain.value = 1.0;

    // Comb filters in parallel
    const combTimes = [0.0297, 0.0371, 0.0437, 0.0513];
    const combFB    = [0.78,   0.76,   0.74,   0.72 ];

    const combMix = ctx.createGain(); combMix.gain.value = 0.22;

    combTimes.forEach((t, i) => {
      const delay  = ctx.createDelay(0.5);
      delay.delayTime.value = t;
      const fbGain = ctx.createGain(); fbGain.gain.value = combFB[i];
      const fbLp   = ctx.createBiquadFilter();
      fbLp.type = 'lowpass'; fbLp.frequency.value = 1600;

      this.reverbIn.connect(delay);
      delay.connect(fbLp); fbLp.connect(fbGain); fbGain.connect(delay);
      delay.connect(combMix);
    });

    // Allpass diffusion
    const ap1 = ctx.createBiquadFilter(); ap1.type = 'allpass'; ap1.frequency.value = 740;
    const ap2 = ctx.createBiquadFilter(); ap2.type = 'allpass'; ap2.frequency.value = 420;
    combMix.connect(ap1); ap1.connect(ap2);

    // Dark lowpass on reverb return
    const returnLp = ctx.createBiquadFilter();
    returnLp.type = 'lowpass'; returnLp.frequency.value = 1000;
    ap2.connect(returnLp);

    // Return gain — keep wet subtle
    const reverbReturn = ctx.createGain();
    reverbReturn.gain.value = 0.55; // relative wet; per-layer send controls amount
    returnLp.connect(reverbReturn);
    reverbReturn.connect(this.masterGain);
  }

  // ── Layer plumbing helpers ────────────────────────────────────────────────

  _makeFinalGain(layer) {
    const g = this.ctx.createGain();
    g.gain.value = 0;
    g.connect(this.masterGain);
    // Reverb send
    if (REVERB_SEND[layer] && REVERB_SEND[layer] > 0 && this.reverbIn) {
      const send = this.ctx.createGain();
      send.gain.value = REVERB_SEND[layer];
      g.connect(send);
      send.connect(this.reverbIn);
    }
    this.finalGains[layer] = g;
    return g;
  }

  _trackLFO(osc) { this._lfoNodes.push(osc); return osc; }
  _trackSrc(src) { this._srcNodes.push(src); return src; }

  // ── Drone: ritual low foundation ─────────────────────────────────────────
  // 3 oscillators with VERY slow beating (~0.12–0.18 Hz = 5–8s period)
  // LP around 260Hz, mostly centered, subtle stereo

  _buildDrone() {
    const ctx = this.ctx;
    const fg  = this._makeFinalGain('drone');

    const pan = ctx.createStereoPanner(); pan.pan.value = 0;
    pan.connect(fg);
    // Very subtle slow pan drift
    this._trackLFO(lfo(ctx, 0.03, 0.05, pan.pan));

    // HP to cut subsonic, LP to keep it below 300Hz
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass';  hp.frequency.value = 28;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';   lp.frequency.value = 280; lp.Q.value = 0.55;
    hp.connect(lp); lp.connect(pan);

    // Internal gain for mild breathing — LFO here, NOT on finalUserGain
    const breathGain = ctx.createGain(); breathGain.gain.value = 0.90;
    breathGain.connect(hp);
    this._trackLFO(lfo(ctx, 0.02, 0.05, breathGain.gain));

    // 3 voices — slow beating between v1 & v2 (~0.13 Hz = 7.7s period)
    const voices = [
      { freq: 55.00,  type: 'sine',     vol: 0.42 },  // root
      { freq: 55.13,  type: 'sine',     vol: 0.34 },  // beats 0.13 Hz with v1
      { freq: 110.07, type: 'triangle', vol: 0.16 },  // gentle octave harmonic
    ];
    voices.forEach(({ freq, type, vol }) => {
      const osc = ctx.createOscillator();
      const og  = ctx.createGain();
      osc.type = type; osc.frequency.value = freq;
      og.gain.value = vol;
      osc.connect(og); og.connect(breathGain); osc.start();
    });
  }

  // ── Pad: lush harmonic atmosphere ────────────────────────────────────────

  _buildPad() {
    const ctx = this.ctx;
    const fg  = this._makeFinalGain('pad');

    // Wide stereo spread via dual panners
    const panL = ctx.createStereoPanner(); panL.pan.value = -0.3; panL.connect(fg);
    const panR = ctx.createStereoPanner(); panR.pan.value =  0.3; panR.connect(fg);
    // Very slow drift
    this._trackLFO(lfo(ctx, 0.018, 0.18, panL.pan));
    this._trackLFO(lfo(ctx, 0.022, 0.18, panR.pan));

    // Filter with slow sweep
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1000; lp.Q.value = 0.65;
    this._trackLFO(lfo(ctx, 0.04, 200, lp.frequency));

    // Internal breathe
    const breathGain = ctx.createGain(); breathGain.gain.value = 0.88;
    this._trackLFO(lfo(ctx, 0.022, 0.055, breathGain.gain));
    breathGain.connect(lp);

    // Voices alternating to L/R panners for width
    const voiceDefs = [
      { freq: 110,  type: 'sine',     detune: -4,  vol: 0.30, side: 'L' },
      { freq: 110,  type: 'sine',     detune:  6,  vol: 0.24, side: 'R' },
      { freq: 165,  type: 'triangle', detune:  3,  vol: 0.18, side: 'L' },
      { freq: 165,  type: 'triangle', detune: -5,  vol: 0.15, side: 'R' },
      { freq: 220,  type: 'sine',     detune: -7,  vol: 0.12, side: 'L' },
      { freq: 277,  type: 'triangle', detune:  4,  vol: 0.08, side: 'R' },
    ];
    voiceDefs.forEach(({ freq, type, detune, vol, side }) => {
      const osc = ctx.createOscillator();
      const og  = ctx.createGain();
      osc.type = type; osc.frequency.value = freq; osc.detune.value = detune;
      og.gain.value = vol;
      // Slow per-voice chorus drift
      this._trackLFO(lfo(ctx, 0.05 + Math.random()*0.04, 2.5 + Math.random()*3, osc.detune));
      osc.connect(og);
      og.connect(lp);
      // Route through breathGain then to appropriate panner
      const destPan = side === 'L' ? panL : panR;
      lp.disconnect(); // disconnect existing; re-route below
      breathGain.connect(lp); lp.connect(destPan); lp.connect(panL); lp.connect(panR);
      osc.start();
    });

    // Reconnect lp → both panners cleanly (above loop may create duplicates; that's OK in Web Audio)
    // Just ensure both are connected
    lp.connect(panL); lp.connect(panR);
  }

  // ── Rain: droplet density, not noise wall ────────────────────────────────

  _buildRain() {
    const ctx = this.ctx;
    const fg  = this._makeFinalGain('rain');

    // Heavy high-shelf cut to kill fatigue above 8kHz
    const shelf = ctx.createBiquadFilter();
    shelf.type = 'highshelf'; shelf.frequency.value = 6500; shelf.gain.value = -14;
    const masterLp = ctx.createBiquadFilter();
    masterLp.type = 'lowpass'; masterLp.frequency.value = 8000;

    fg.disconnect(); // override default connection
    // Restore reverb send connection (was already made in _makeFinalGain)
    fg.connect(shelf); shelf.connect(masterLp); masterLp.connect(this.masterGain);
    if (this.reverbIn) {
      const send = ctx.createGain(); send.gain.value = REVERB_SEND['rain'];
      fg.connect(send); send.connect(this.reverbIn);
    }

    const pan = ctx.createStereoPanner(); pan.pan.value = 0;
    pan.connect(fg);
    this._trackLFO(lfo(ctx, 0.035, 0.16, pan.pan));

    // Sub-layers routed to pan (then → fg → processing → master)
    const subBed     = ctx.createGain(); subBed.gain.value     = 0; subBed.connect(pan);
    const subMid     = ctx.createGain(); subMid.gain.value     = 0; subMid.connect(pan);
    const subRumble  = ctx.createGain(); subRumble.gain.value  = 0; subRumble.connect(pan);
    const subDroplet = ctx.createGain(); subDroplet.gain.value = 0; subDroplet.connect(pan);

    // Small LFO drift on sublayers (depth tiny — these are not the volume control)
    this._trackLFO(lfo(ctx, 0.028, 0.04, subBed.gain));
    this._trackLFO(lfo(ctx, 0.033, 0.03, subMid.gain));

    // Bed: dark noise, bandpass 600–4kHz
    const bedSrc = loopSrc(ctx, mkDarkNoise(ctx, 22));
    const bedBp  = ctx.createBiquadFilter(); bedBp.type = 'bandpass'; bedBp.frequency.value = 1400; bedBp.Q.value = 0.28;
    const bedLp  = ctx.createBiquadFilter(); bedLp.type = 'lowpass';  bedLp.frequency.value = 4000;
    bedSrc.connect(bedBp); bedBp.connect(bedLp); bedLp.connect(subBed);
    bedSrc.start(); this._trackSrc(bedSrc);

    // Mid: pink, bandpass 500–2kHz
    const midSrc = loopSrc(ctx, mkPink(ctx, 17));
    const midBp  = ctx.createBiquadFilter(); midBp.type = 'bandpass'; midBp.frequency.value = 800; midBp.Q.value = 0.45;
    midSrc.connect(midBp); midBp.connect(subMid);
    midSrc.start(); this._trackSrc(midSrc);

    // Rumble: brown, lowpass 280Hz (storm only)
    const rumbleSrc = loopSrc(ctx, mkBrown(ctx, 14));
    const rumbleLp  = ctx.createBiquadFilter(); rumbleLp.type = 'lowpass'; rumbleLp.frequency.value = 280;
    rumbleSrc.connect(rumbleLp); rumbleLp.connect(subRumble);
    rumbleSrc.start(); this._trackSrc(rumbleSrc);

    this._rainSubs   = { bed: subBed, mid: subMid, rumble: subRumble, droplet: subDroplet };
    this._dropletBuf = mkBurst(ctx, 60);
  }

  _setRainSublayers(v) {
    if (!this._rainSubs || !this.ctx) return;
    const now = this.ctx.currentTime;
    const s   = this._rainSubs;
    const tc  = 0.35;

    // Density not loudness: sparse below 0.3, fuller above 0.7
    const bedG    = v < 0.12 ? v * 0.5            : Math.min(0.72, 0.06 + (v - 0.12) * 1.0);
    const midG    = v < 0.28 ? 0                  : Math.min(0.65, (v - 0.28) * 1.3);
    const rumbleG = v < 0.55 ? 0                  : Math.min(0.50, (v - 0.55) * 1.2);
    // Droplets peak at ~0.35 intensity, fade as bed takes over
    const dropD   = v < 0.04 ? 0 : v < 0.35 ? v * 2.2 : Math.max(0, 0.77 - v * 0.70);

    s.bed.gain.setTargetAtTime(bedG,    now, tc);
    s.mid.gain.setTargetAtTime(midG,    now, tc);
    s.rumble.gain.setTargetAtTime(rumbleG, now, tc);
    s.droplet.gain.setTargetAtTime(1.0, now, tc);

    this._scheduleDroplets(dropD * Math.sqrt(v)); // sqrt: keep droplets audible but gentle
  }

  _scheduleDroplets(intensity) {
    clearTimeout(this._dropTimer);
    if (intensity < 0.02 || !this._rainSubs || !AUDIBLE_STATES.has(this.state)) return;
    const ctx      = this.ctx;
    const subDrop  = this._rainSubs.droplet;
    const rateHz   = 0.3 + intensity * 5.5;
    const baseGain = Math.min(0.40, intensity * 0.75);

    const fire = () => {
      if (!this.ctx || this.ctx.state !== 'running' || !AUDIBLE_STATES.has(this.state)) return;
      if ((this._userValues['rain'] || 0) < 0.02) return;

      const now = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = this._dropletBuf;

      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
      bp.frequency.value = 600 + Math.random() * 900; // darker, less bright
      bp.Q.value = 1.8 + Math.random() * 2.5;

      const eg = ctx.createGain();
      eg.gain.setValueAtTime(0, now);
      eg.gain.linearRampToValueAtTime(baseGain * (0.45 + Math.random()*0.55), now + 0.014);
      eg.gain.exponentialRampToValueAtTime(0.0001, now + 0.09 + Math.random()*0.12);

      src.connect(bp); bp.connect(eg); eg.connect(subDrop);
      src.start(now); src.stop(now + 0.28);

      const interval = (1000 / rateHz) * (0.25 + Math.random() * 1.6);
      this._dropTimer = setTimeout(fire, interval);
    };

    this._dropTimer = setTimeout(fire, Math.random() * 900);
  }

  // ── Analog: subtle imperfection only ─────────────────────────────────────
  // Remove low-mid wash; high-passed so it sits above 120Hz, below 2kHz

  _buildAnalog() {
    const ctx = this.ctx;
    const fg  = this._makeFinalGain('analog');
    this.finalGains['tape'] = fg;

    const pan = ctx.createStereoPanner(); pan.pan.value = 0; pan.connect(fg);
    this._trackLFO(lfo(ctx, 0.04, 0.06, pan.pan));

    // Band: 120Hz–1.8kHz — removes the ocean-wave muddiness
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 120;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';  lp.frequency.value = 1800;
    hp.connect(lp); lp.connect(pan);

    // Very gentle pink layer — low amplitude
    const pinkSrc = loopSrc(ctx, mkPink(ctx, 8));
    const pinkG   = ctx.createGain(); pinkG.gain.value = 0.22;
    // Wow/flutter: two slow independent LFOs
    this._trackLFO(lfo(ctx, 0.08 + Math.random()*0.04, 0.025, pinkG.gain));
    this._trackLFO(lfo(ctx, 0.13 + Math.random()*0.05, 0.018, pinkG.gain));
    pinkSrc.connect(pinkG); pinkG.connect(hp);
    pinkSrc.start(); this._trackSrc(pinkSrc);

    this._analogCrackleBuf = mkBurst(ctx, 22);
    this._scheduleCrackle();
  }

  _scheduleCrackle() {
    if (!this.ctx || this.ctx.state === 'closed') return;
    const delay = 6000 + Math.random() * 18000; // sparse: 6–24s
    this._crackTimer = setTimeout(() => {
      const fg = this.finalGains['analog'];
      if (!this.ctx || !fg || fg.gain.value < 0.03) { this._scheduleCrackle(); return; }
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const src = ctx.createBufferSource(); src.buffer = this._analogCrackleBuf;
      const bp  = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 2000 + Math.random()*1500; bp.Q.value = 4;
      const eg = ctx.createGain();
      eg.gain.setValueAtTime(0, now);
      eg.gain.linearRampToValueAtTime(0.007 + Math.random()*0.010, now + 0.003);
      eg.gain.exponentialRampToValueAtTime(0.0001, now + 0.025 + Math.random()*0.03);
      src.connect(bp); bp.connect(eg); eg.connect(fg);
      src.start(now); src.stop(now + 0.08);
      this._scheduleCrackle();
    }, delay);
  }

  // ── Pulse: slow body throb, not sub conflict ─────────────────────────────
  // HP at 35Hz to avoid fighting Drone; LP at 110Hz; heavily capped

  _buildPulse() {
    const ctx = this.ctx;
    const fg  = this._makeFinalGain('pulse');

    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 35;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';  lp.frequency.value = 110;

    // Slow swell — modulate internal gain only
    const swellGain = ctx.createGain(); swellGain.gain.value = 0.75;
    this._trackLFO(lfo(ctx, 0.18, 0.20, swellGain.gain));
    swellGain.connect(fg);

    const osc = ctx.createOscillator();
    const og  = ctx.createGain();
    osc.type = 'triangle'; osc.frequency.value = 46;
    og.gain.value = 0.55;
    osc.connect(og); og.connect(hp); hp.connect(lp); lp.connect(swellGain);
    osc.start();
  }

  // ── Air: space and height, not rain ──────────────────────────────────────
  // HP at 3kHz so it doesn't overlap Rain; very gentle; lowpassed at 6kHz

  _buildAir() {
    const ctx = this.ctx;
    const fg  = this._makeFinalGain('air');

    const pan = ctx.createStereoPanner(); pan.pan.value = 0; pan.connect(fg);
    this._trackLFO(lfo(ctx, 0.05, 0.20, pan.pan)); // wider drift for space

    // Internal breath
    const breathGain = ctx.createGain(); breathGain.gain.value = 0.80;
    breathGain.connect(pan);
    this._trackLFO(lfo(ctx, 0.06, 0.14, breathGain.gain));

    // Band: 3kHz – 6kHz only (sky/air, not mid-range rain)
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3000;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';  lp.frequency.value = 6000;
    // Gentle cut above 5kHz for fatigue
    const shelf = ctx.createBiquadFilter(); shelf.type = 'highshelf'; shelf.frequency.value = 5000; shelf.gain.value = -6;
    hp.connect(lp); lp.connect(shelf); shelf.connect(breathGain);

    // Pink only (brown has too much low energy)
    const src = loopSrc(ctx, mkPink(ctx, 6));
    const g   = ctx.createGain(); g.gain.value = 0.48;
    src.connect(g); g.connect(hp);
    src.start(); this._trackSrc(src);
  }

  // ── Public API ────────────────────────────────────────────────────────────

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

        const rainV = this._userValues['rain'] || 0;
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

      const rainV = this._userValues['rain'] || 0;
      if (rainV > 0.02) this._setRainSublayers(curve(rainV));
      this._scheduleCrackle();
    });
  }

  dispose() {
    this.state = STATE.DISPOSING;
    clearTimeout(this._dropTimer);
    clearTimeout(this._crackTimer);
    this._lfoNodes.forEach(o => { try { o.stop(); o.disconnect(); } catch {} });
    this._srcNodes.forEach(s => { try { s.stop(); s.disconnect(); } catch {} });
    this._lfoNodes = []; this._srcNodes = [];
    if (this.ctx && this.ctx.state !== 'closed') this.ctx.close().catch(() => {});
    this.ctx = null; this.masterGain = null; this.reverbIn = null;
    this.finalGains = {}; this._rainSubs = null; this._userValues = {};
    this.state = STATE.IDLE;
  }

  setVolume(layer, rawValue) {
    const v = Math.max(0, Math.min(1, rawValue));
    this._userValues[layer] = v;
    const g = this.finalGains[layer];
    if (!g || !this.ctx) return;
    const target = curve(v) * (LAYER_CAPS[layer] || 0.35);
    const tc     = RAMP_TC[layer] || 0.35;
    g.gain.setTargetAtTime(target, this.ctx.currentTime, tc);
    if (layer === 'rain') this._setRainSublayers(curve(v));
  }

  applyMix(mix) {
    Object.entries(mix).forEach(([layer, v]) => this.setVolume(layer, v));
  }

  _applyMixImmediate(mix) {
    Object.entries(mix).forEach(([layer, v]) => {
      const val = Math.max(0, Math.min(1, v));
      this._userValues[layer] = val;
      const g = this.finalGains[layer];
      if (!g) return;
      g.gain.value = curve(val) * (LAYER_CAPS[layer] || 0.35);
      if (layer === 'rain') this._setRainSublayers(curve(val));
    });
  }

  get isPlaying() { return this.state === STATE.PLAYING; }
  get isPaused()  { return this.state === STATE.PAUSED; }
  get isIdle()    { return this.state === STATE.IDLE; }
  get isTransitioning() { return Boolean(this._transition); }
}

const audioEngine = new AudioEngine();
export default audioEngine;
