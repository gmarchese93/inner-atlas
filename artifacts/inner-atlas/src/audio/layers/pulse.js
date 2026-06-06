import { makeFinalGain } from '../gain';
import { lfo } from '../effects/stereoMotion';

export function buildPulse(engine) {
  const ctx = engine.ctx;
  const finalGain = makeFinalGain(engine, 'pulse');

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 35;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 110;

  const swellGain = ctx.createGain();
  swellGain.gain.value = 0.75;
  engine._trackLFO(lfo(ctx, 0.18, 0.20, swellGain.gain));
  swellGain.connect(finalGain);

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 46;
  oscGain.gain.value = 0.55;
  osc.connect(oscGain);
  oscGain.connect(hp);
  hp.connect(lp);
  lp.connect(swellGain);
  osc.start();
}
