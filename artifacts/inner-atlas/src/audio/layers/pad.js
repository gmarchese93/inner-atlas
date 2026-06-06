import { makeFinalGain } from '../gain';
import { lfo } from '../effects/stereoMotion';

export function buildPad(engine) {
  const ctx = engine.ctx;
  const finalGain = makeFinalGain(engine, 'pad');

  const panL = ctx.createStereoPanner();
  panL.pan.value = -0.3;
  panL.connect(finalGain);
  const panR = ctx.createStereoPanner();
  panR.pan.value = 0.3;
  panR.connect(finalGain);
  engine._trackLFO(lfo(ctx, 0.018, 0.18, panL.pan));
  engine._trackLFO(lfo(ctx, 0.022, 0.18, panR.pan));

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1000;
  lp.Q.value = 0.65;
  engine._trackLFO(lfo(ctx, 0.04, 200, lp.frequency));

  const breathGain = ctx.createGain();
  breathGain.gain.value = 0.88;
  engine._trackLFO(lfo(ctx, 0.022, 0.055, breathGain.gain));
  breathGain.connect(lp);

  const voiceDefs = [
    { freq: 110, type: 'sine', detune: -4, vol: 0.30, side: 'L' },
    { freq: 110, type: 'sine', detune: 6, vol: 0.24, side: 'R' },
    { freq: 165, type: 'triangle', detune: 3, vol: 0.18, side: 'L' },
    { freq: 165, type: 'triangle', detune: -5, vol: 0.15, side: 'R' },
    { freq: 220, type: 'sine', detune: -7, vol: 0.12, side: 'L' },
    { freq: 277, type: 'triangle', detune: 4, vol: 0.08, side: 'R' },
  ];
  voiceDefs.forEach(({ freq, type, detune, vol, side }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    gain.gain.value = vol;
    engine._trackLFO(lfo(ctx, 0.05 + Math.random() * 0.04, 2.5 + Math.random() * 3, osc.detune));
    osc.connect(gain);
    gain.connect(lp);

    const destPan = side === 'L' ? panL : panR;
    lp.disconnect(); // disconnect existing; re-route below
    breathGain.connect(lp);
    lp.connect(destPan);
    lp.connect(panL);
    lp.connect(panR);
    osc.start();
  });

  // Reconnect lp -> both panners cleanly. The loop above may create duplicates; that's OK in Web Audio.
  lp.connect(panL);
  lp.connect(panR);
}
