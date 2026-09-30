import { AUDIBLE_STATES } from '../audioStateMachine';

const EVENT_PATTERNS = {
  bowl_start: {
    partials: [{ freq: 220, vol: 0.50 }, { freq: 605, vol: 0.18 }, { freq: 1080, vol: 0.07 }],
    attack: 0.014, decay: 1.1, peak: 0.24, reverb: 0.58, stop: 9,
  },
  gong_start: {
    partials: [{ freq: 110, vol: 0.42 }, { freq: 151, vol: 0.24 }, { freq: 242, vol: 0.14 }, { freq: 367, vol: 0.08 }],
    attack: 0.04, decay: 1.6, peak: 0.20, reverb: 0.62, stop: 12,
  },
  chime_start: {
    partials: [{ freq: 523, vol: 0.32 }, { freq: 659, vol: 0.20 }, { freq: 784, vol: 0.12 }],
    attack: 0.006, decay: 0.75, peak: 0.13, reverb: 0.66, stop: 6,
  },
  crystal_start: {
    partials: [{ freq: 440, vol: 0.32 }, { freq: 880, vol: 0.16 }, { freq: 1320, vol: 0.08 }],
    attack: 0.004, decay: 0.62, peak: 0.12, reverb: 0.70, stop: 5,
  },
};

export function buildResonance(_engine) {
  // Resonance nodes are created on demand for each one-shot strike.
}

export function triggerResonance(engine, eventPattern = 'bowl_start') {
  if (!engine.ctx || !AUDIBLE_STATES.has(engine.state) || !engine.masterGain) return false;
  if (eventPattern === 'none') return false;

  const pattern = EVENT_PATTERNS[eventPattern] || EVENT_PATTERNS.bowl_start;

  const ctx = engine.ctx;
  const now = ctx.currentTime;
  let remaining = pattern.partials.length;

  const out = ctx.createGain();
  out.gain.setValueAtTime(0, now);
  out.gain.linearRampToValueAtTime(pattern.peak, now + pattern.attack);
  out.gain.setTargetAtTime(0.0001, now + pattern.attack, pattern.decay);
  out.connect(engine.masterGain);

  let send = null;
  if (engine.reverbIn) {
    send = ctx.createGain();
    send.gain.value = pattern.reverb;
    out.connect(send);
    send.connect(engine.reverbIn);
  }

  pattern.partials.forEach(({ freq, vol }) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(out);
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
      remaining -= 1;
      if (remaining === 0) {
        try {
          out.disconnect();
          if (send) send.disconnect();
        } catch {}
      }
    };
    osc.start(now);
    osc.stop(now + pattern.stop);
  });

  return true;
}
