import { describe, expect, it, vi } from "vitest";
import { STATE } from "../../artifacts/inner-atlas/src/audio/audioStateMachine.js";
import { triggerResonance } from "../../artifacts/inner-atlas/src/audio/layers/resonance.js";

function makeGainNode() {
  return {
    gain: {
      value: 0,
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      setTargetAtTime: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
}

function makeMockCtx() {
  const nodes = { gains: [], oscillators: [] };
  return {
    currentTime: 0,
    createGain: vi.fn(() => {
      const node = makeGainNode();
      nodes.gains.push(node);
      return node;
    }),
    createOscillator: vi.fn(() => {
      const node = {
        type: "",
        frequency: { value: 0 },
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        onended: null,
      };
      nodes.oscillators.push(node);
      return node;
    }),
    _nodes: nodes,
  };
}

describe("triggerResonance", () => {
  it("returns false without an audio context", () => {
    expect(triggerResonance({ ctx: null, state: STATE.PLAYING })).toBe(false);
  });

  it.each([STATE.IDLE, STATE.PAUSED, STATE.DISPOSING])(
    "returns false in non-audible state %s",
    state => {
      expect(triggerResonance({ ctx: makeMockCtx(), state })).toBe(false);
    },
  );

  it.each([STATE.STARTING, STATE.PLAYING, STATE.RESUMING])(
    "schedules a three-partial one-shot in audible state %s",
    state => {
      const ctx = makeMockCtx();
      const masterGain = { connect: vi.fn() };
      const reverbIn = { connect: vi.fn() };

      expect(triggerResonance({ ctx, state, masterGain, reverbIn })).toBe(true);
      expect(ctx.createOscillator).toHaveBeenCalledTimes(3);
      expect(ctx._nodes.oscillators.map(osc => osc.frequency.value)).toEqual([220, 605, 1080]);
      ctx._nodes.oscillators.forEach(osc => {
        expect(osc.start).toHaveBeenCalledWith(0);
        expect(osc.stop).toHaveBeenCalledWith(9);
      });
      expect(ctx._nodes.gains[0].connect).toHaveBeenCalledWith(masterGain);
      expect(ctx._nodes.gains[1].connect).toHaveBeenCalledWith(reverbIn);
    },
  );

  it("does not create a reverb send when reverbIn is absent", () => {
    const ctx = makeMockCtx();

    expect(triggerResonance({ ctx, state: STATE.PLAYING, masterGain: {} })).toBe(true);
    expect(ctx.createGain).toHaveBeenCalledTimes(4);
  });
});
