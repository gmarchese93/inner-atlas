import { AUDIBLE_STATES } from '../audioStateMachine';
import { makeFinalGain, REVERB_SEND } from '../gain';
import { lfo, loopSrc } from '../effects/stereoMotion';
import { mkBrown, mkBurst, mkDarkNoise, mkPink } from './noise';

export function buildRain(engine) {
  const ctx = engine.ctx;
  const finalGain = makeFinalGain(engine, 'rain');

  // Heavy high-shelf cut to kill fatigue above 8kHz.
  const shelf = ctx.createBiquadFilter();
  shelf.type = 'highshelf';
  shelf.frequency.value = 6500;
  shelf.gain.value = -14;
  const masterLp = ctx.createBiquadFilter();
  masterLp.type = 'lowpass';
  masterLp.frequency.value = 8000;

  // Rain overrides the default finalUserGain -> master route.
  finalGain.disconnect();
  finalGain.connect(shelf);
  shelf.connect(masterLp);
  masterLp.connect(engine.masterGain);
  if (engine.reverbIn) {
    const send = ctx.createGain();
    send.gain.value = REVERB_SEND.rain;
    finalGain.connect(send);
    send.connect(engine.reverbIn);
  }

  const pan = ctx.createStereoPanner();
  pan.pan.value = 0;
  pan.connect(finalGain);
  engine._trackLFO(lfo(ctx, 0.035, 0.16, pan.pan));

  const subBed = ctx.createGain();
  subBed.gain.value = 0;
  subBed.connect(pan);
  const subMid = ctx.createGain();
  subMid.gain.value = 0;
  subMid.connect(pan);
  const subRumble = ctx.createGain();
  subRumble.gain.value = 0;
  subRumble.connect(pan);
  const subDroplet = ctx.createGain();
  subDroplet.gain.value = 0;
  subDroplet.connect(pan);

  engine._trackLFO(lfo(ctx, 0.028, 0.04, subBed.gain));
  engine._trackLFO(lfo(ctx, 0.033, 0.03, subMid.gain));

  // Bed: dark noise, bandpass 600-4kHz.
  const bedSrc = loopSrc(ctx, mkDarkNoise(ctx, 22));
  const bedBp = ctx.createBiquadFilter();
  bedBp.type = 'bandpass';
  bedBp.frequency.value = 1400;
  bedBp.Q.value = 0.28;
  const bedLp = ctx.createBiquadFilter();
  bedLp.type = 'lowpass';
  bedLp.frequency.value = 4000;
  bedSrc.connect(bedBp);
  bedBp.connect(bedLp);
  bedLp.connect(subBed);
  bedSrc.start();
  engine._trackSrc(bedSrc);

  // Mid: pink, bandpass 500-2kHz.
  const midSrc = loopSrc(ctx, mkPink(ctx, 17));
  const midBp = ctx.createBiquadFilter();
  midBp.type = 'bandpass';
  midBp.frequency.value = 800;
  midBp.Q.value = 0.45;
  midSrc.connect(midBp);
  midBp.connect(subMid);
  midSrc.start();
  engine._trackSrc(midSrc);

  // Rumble: brown, lowpass 280Hz (storm only).
  const rumbleSrc = loopSrc(ctx, mkBrown(ctx, 14));
  const rumbleLp = ctx.createBiquadFilter();
  rumbleLp.type = 'lowpass';
  rumbleLp.frequency.value = 280;
  rumbleSrc.connect(rumbleLp);
  rumbleLp.connect(subRumble);
  rumbleSrc.start();
  engine._trackSrc(rumbleSrc);

  engine._rainSubs = { bed: subBed, mid: subMid, rumble: subRumble, droplet: subDroplet };
  engine._dropletBuf = mkBurst(ctx, 60);
}

export function setRainSublayers(engine, value) {
  if (!engine._rainSubs || !engine.ctx) return;
  const now = engine.ctx.currentTime;
  const subs = engine._rainSubs;
  const tc = 0.35;

  // Density not loudness: sparse below 0.3, fuller above 0.7.
  const bedGain = value < 0.12 ? value * 0.5 : Math.min(0.72, 0.06 + (value - 0.12) * 1.0);
  const midGain = value < 0.28 ? 0 : Math.min(0.65, (value - 0.28) * 1.3);
  const rumbleGain = value < 0.55 ? 0 : Math.min(0.50, (value - 0.55) * 1.2);
  // Droplets peak at ~0.35 intensity, fade as bed takes over.
  const dropletDensity = value < 0.04 ? 0 : value < 0.35 ? value * 2.2 : Math.max(0, 0.77 - value * 0.70);

  subs.bed.gain.setTargetAtTime(bedGain, now, tc);
  subs.mid.gain.setTargetAtTime(midGain, now, tc);
  subs.rumble.gain.setTargetAtTime(rumbleGain, now, tc);
  subs.droplet.gain.setTargetAtTime(1.0, now, tc);

  scheduleDroplets(engine, dropletDensity * Math.sqrt(value)); // sqrt: keep droplets audible but gentle
}

export function scheduleDroplets(engine, intensity) {
  clearTimeout(engine._dropTimer);
  if (intensity < 0.02 || !engine._rainSubs || !AUDIBLE_STATES.has(engine.state)) return;
  const ctx = engine.ctx;
  const subDrop = engine._rainSubs.droplet;
  const rateHz = 0.3 + intensity * 5.5;
  const baseGain = Math.min(0.40, intensity * 0.75);

  const fire = () => {
    if (!engine.ctx || engine.ctx.state !== 'running' || !AUDIBLE_STATES.has(engine.state)) return;
    if ((engine._userValues.rain || 0) < 0.02) return;

    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = engine._dropletBuf;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 600 + Math.random() * 900;
    bp.Q.value = 1.8 + Math.random() * 2.5;

    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(baseGain * (0.45 + Math.random() * 0.55), now + 0.014);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.09 + Math.random() * 0.12);

    src.connect(bp);
    bp.connect(envelope);
    envelope.connect(subDrop);
    src.start(now);
    src.stop(now + 0.28);

    const interval = (1000 / rateHz) * (0.25 + Math.random() * 1.6);
    engine._dropTimer = setTimeout(fire, interval);
  };

  engine._dropTimer = setTimeout(fire, Math.random() * 900);
}
