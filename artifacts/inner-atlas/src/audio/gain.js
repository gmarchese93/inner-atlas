export const MASTER_TARGET = 0.38;
export const FADE_IN = 2.4;
export const FADE_OUT = 1.8;

// Final output caps: at slider=1.0 this is the absolute max going to master.
export const LAYER_CAPS = {
  drone: 0.44,
  pad: 0.50,
  rain: 0.52,
  analog: 0.18,
  pulse: 0.22,
  air: 0.16,
};

// Smoothing tau for setTargetAtTime.
export const RAMP_TC = {
  drone: 0.50,
  pad: 0.45,
  rain: 0.40,
  analog: 0.28,
  pulse: 0.14,
  air: 0.45,
};

export const REVERB_SEND = {
  drone: 0.04,
  pad: 0.18,
  rain: 0.08,
  analog: 0.02,
  pulse: 0.02,
  air: 0.20,
};

export function curve(value) {
  return Math.pow(Math.max(0, Math.min(1, value)), 1.65);
}

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function makeFinalGain(engine, layer) {
  const gain = engine.ctx.createGain();
  gain.gain.value = 0;

  // Signal flow: source -> internal modulation/effects -> finalUserGain -> master.
  gain.connect(engine.masterGain);

  if (REVERB_SEND[layer] && REVERB_SEND[layer] > 0 && engine.reverbIn) {
    const send = engine.ctx.createGain();
    send.gain.value = REVERB_SEND[layer];
    gain.connect(send);
    send.connect(engine.reverbIn);
  }

  engine.finalGains[layer] = gain;
  return gain;
}
