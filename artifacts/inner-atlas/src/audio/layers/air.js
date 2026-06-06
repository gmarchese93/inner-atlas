import { makeFinalGain } from '../gain';
import { lfo, loopSrc } from '../effects/stereoMotion';
import { mkPink } from './noise';

export function buildAir(engine) {
  const ctx = engine.ctx;
  const finalGain = makeFinalGain(engine, 'air');

  const pan = ctx.createStereoPanner();
  pan.pan.value = 0;
  pan.connect(finalGain);
  engine._trackLFO(lfo(ctx, 0.05, 0.20, pan.pan));

  const breathGain = ctx.createGain();
  breathGain.gain.value = 0.80;
  breathGain.connect(pan);
  engine._trackLFO(lfo(ctx, 0.06, 0.14, breathGain.gain));

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 3000;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 6000;
  const shelf = ctx.createBiquadFilter();
  shelf.type = 'highshelf';
  shelf.frequency.value = 5000;
  shelf.gain.value = -6;
  hp.connect(lp);
  lp.connect(shelf);
  shelf.connect(breathGain);

  const src = loopSrc(ctx, mkPink(ctx, 6));
  const gain = ctx.createGain();
  gain.gain.value = 0.48;
  src.connect(gain);
  gain.connect(hp);
  src.start();
  engine._trackSrc(src);
}
