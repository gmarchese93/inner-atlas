import { AUDIBLE_STATES } from '../audioStateMachine';

const PARTIALS = [
  { freq: 220, vol: 0.50 },
  { freq: 605, vol: 0.18 },
  { freq: 1080, vol: 0.07 },
];

const ATTACK_S = 0.014;
const DECAY_TC = 1.1;
const PEAK_GAIN = 0.24;
const REVERB_SEND = 0.58;
const AUTO_STOP = 9;

export function buildResonance(_engine) {
  // Resonance nodes are created on demand for each one-shot strike.
}

export function triggerResonance(engine) {
  if (!engine.ctx || !AUDIBLE_STATES.has(engine.state) || !engine.masterGain) return false;

  const ctx = engine.ctx;
  const now = ctx.currentTime;
  let remaining = PARTIALS.length;

  const out = ctx.createGain();
  out.gain.setValueAtTime(0, now);
  out.gain.linearRampToValueAtTime(PEAK_GAIN, now + ATTACK_S);
  out.gain.setTargetAtTime(0.0001, now + ATTACK_S, DECAY_TC);
  out.connect(engine.masterGain);

  let send = null;
  if (engine.reverbIn) {
    send = ctx.createGain();
    send.gain.value = REVERB_SEND;
    out.connect(send);
    send.connect(engine.reverbIn);
  }

  PARTIALS.forEach(({ freq, vol }) => {
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
    osc.stop(now + AUTO_STOP);
  });

  return true;
}
