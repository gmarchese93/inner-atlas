import { makeFinalGain } from '../gain';
import { lfo } from '../effects/stereoMotion';

export function buildDrone(engine) {
  const ctx = engine.ctx;
  const finalGain = makeFinalGain(engine, 'drone');

  const pan = ctx.createStereoPanner();
  pan.pan.value = 0;
  pan.connect(finalGain);
  engine._trackLFO(lfo(ctx, 0.03, 0.05, pan.pan));

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 28;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 280;
  lp.Q.value = 0.55;
  hp.connect(lp);
  lp.connect(pan);

  const breathGain = ctx.createGain();
  breathGain.gain.value = 0.90;
  breathGain.connect(hp);
  engine._trackLFO(lfo(ctx, 0.02, 0.05, breathGain.gain));

  const voices = [
    { freq: 55.00, type: 'sine', vol: 0.42 },
    { freq: 55.13, type: 'sine', vol: 0.34 },
    { freq: 110.07, type: 'triangle', vol: 0.16 },
  ];
  voices.forEach(({ freq, type, vol }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(breathGain);
    osc.start();
  });
}
