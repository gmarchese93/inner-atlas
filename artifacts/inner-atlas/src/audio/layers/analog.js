import { makeFinalGain } from '../gain';
import { lfo, loopSrc } from '../effects/stereoMotion';
import { mkBurst, mkPink } from './noise';

export function buildAnalog(engine) {
  const ctx = engine.ctx;
  const finalGain = makeFinalGain(engine, 'analog');

  const pan = ctx.createStereoPanner();
  pan.pan.value = 0;
  pan.connect(finalGain);
  engine._trackLFO(lfo(ctx, 0.04, 0.06, pan.pan));

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 120;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1800;
  hp.connect(lp);
  lp.connect(pan);

  const pinkSrc = loopSrc(ctx, mkPink(ctx, 8));
  const pinkGain = ctx.createGain();
  pinkGain.gain.value = 0.22;
  engine._trackLFO(lfo(ctx, 0.08 + Math.random() * 0.04, 0.025, pinkGain.gain));
  engine._trackLFO(lfo(ctx, 0.13 + Math.random() * 0.05, 0.018, pinkGain.gain));
  pinkSrc.connect(pinkGain);
  pinkGain.connect(hp);
  pinkSrc.start();
  engine._trackSrc(pinkSrc);

  engine._analogCrackleBuf = mkBurst(ctx, 22);
  scheduleCrackle(engine);
}

export function scheduleCrackle(engine) {
  if (!engine.ctx || engine.ctx.state === 'closed') return;
  const delay = 4000 + Math.random() * 10000;
  engine._timers.crack = setTimeout(() => {
    const finalGain = engine.finalGains.analog;
    if (!engine.ctx || !finalGain || finalGain.gain.value < 0.03) {
      scheduleCrackle(engine);
      return;
    }
    const ctx = engine.ctx;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = engine._analogCrackleBuf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2000 + Math.random() * 1500;
    bp.Q.value = 4;
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.012 + Math.random() * 0.014, now + 0.003);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.025 + Math.random() * 0.03);
    src.connect(bp);
    bp.connect(envelope);
    envelope.connect(finalGain);
    src.start(now);
    src.stop(now + 0.08);
    scheduleCrackle(engine);
  }, delay);
}
