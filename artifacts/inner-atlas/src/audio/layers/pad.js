import { makeFinalGain } from '../gain';
import { lfo } from '../effects/stereoMotion';

const PAD_VOICINGS = {
  warm_open: [
    { freq: 110, type: 'sine', detune: -4, vol: 0.30, side: 'L' },
    { freq: 110, type: 'sine', detune: 6, vol: 0.24, side: 'R' },
    { freq: 165, type: 'triangle', detune: 3, vol: 0.18, side: 'L' },
    { freq: 165, type: 'triangle', detune: -5, vol: 0.15, side: 'R' },
    { freq: 220, type: 'sine', detune: -7, vol: 0.12, side: 'L' },
    { freq: 277, type: 'triangle', detune: 4, vol: 0.08, side: 'R' },
  ],
  warm_low: [
    { freq: 98, type: 'sine', detune: -5, vol: 0.30, side: 'L' },
    { freq: 98, type: 'sine', detune: 5, vol: 0.24, side: 'R' },
    { freq: 147, type: 'triangle', detune: 3, vol: 0.18, side: 'L' },
    { freq: 147, type: 'triangle', detune: -4, vol: 0.15, side: 'R' },
    { freq: 196, type: 'sine', detune: -6, vol: 0.12, side: 'L' },
    { freq: 247, type: 'triangle', detune: 4, vol: 0.08, side: 'R' },
  ],
  grounded_low: [
    { freq: 82, type: 'sine', detune: -4, vol: 0.31, side: 'L' },
    { freq: 82, type: 'sine', detune: 5, vol: 0.25, side: 'R' },
    { freq: 123, type: 'triangle', detune: 2, vol: 0.19, side: 'L' },
    { freq: 123, type: 'triangle', detune: -4, vol: 0.15, side: 'R' },
    { freq: 165, type: 'sine', detune: -6, vol: 0.12, side: 'L' },
    { freq: 220, type: 'triangle', detune: 3, vol: 0.07, side: 'R' },
  ],
  clear_open: [
    { freq: 110, type: 'sine', detune: -3, vol: 0.27, side: 'L' },
    { freq: 110, type: 'sine', detune: 4, vol: 0.22, side: 'R' },
    { freq: 165, type: 'triangle', detune: 2, vol: 0.17, side: 'L' },
    { freq: 165, type: 'triangle', detune: -3, vol: 0.14, side: 'R' },
    { freq: 247, type: 'sine', detune: -4, vol: 0.11, side: 'L' },
    { freq: 330, type: 'triangle', detune: 3, vol: 0.07, side: 'R' },
  ],
};

export function getPadVoicing(name = 'warm_open') {
  return PAD_VOICINGS[name] || PAD_VOICINGS.warm_open;
}

export function applyPadVoicing(engine, name) {
  const voicing = getPadVoicing(name);
  engine._padVoices?.forEach(({ osc, gain }, index) => {
    const voice = voicing[index];
    if (!voice) return;
    osc.type = voice.type;
    osc.frequency.value = voice.freq;
    osc.detune.value = voice.detune;
    gain.gain.value = voice.vol;
  });
}

export function buildPad(engine, voicingName = 'warm_open') {
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

  const voiceDefs = getPadVoicing(voicingName);
  engine._padVoices = [];
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
    engine._trackSrc(osc);
    engine._padVoices.push({ osc, gain });
  });

  // Reconnect lp -> both panners cleanly. The loop above may create duplicates; that's OK in Web Audio.
  lp.connect(panL);
  lp.connect(panR);
}
