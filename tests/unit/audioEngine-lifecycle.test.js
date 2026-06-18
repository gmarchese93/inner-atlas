import { describe, expect, it, vi } from "vitest";
import { AudioEngine } from "../../artifacts/inner-atlas/src/audio/audioEngine.js";

function makeAudioParam(initial = 0) {
  return {
    value: initial,
    cancelScheduledValues: vi.fn(),
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
}

function makeNode(extra = {}) {
  return {
    connect: vi.fn(),
    disconnect: vi.fn(),
    ...extra,
  };
}

function makeMockCtx() {
  return {
    currentTime: 0,
    sampleRate: 8000,
    state: "running",
    destination: makeNode(),
    close: vi.fn(() => Promise.resolve()),
    resume: vi.fn(() => Promise.resolve()),
    suspend: vi.fn(() => Promise.resolve()),
    createGain: vi.fn(() => makeNode({ gain: makeAudioParam(0) })),
    createOscillator: vi.fn(() =>
      makeNode({
        type: "sine",
        frequency: { value: 0 },
        detune: makeAudioParam(0),
        start: vi.fn(),
        stop: vi.fn(),
      }),
    ),
    createStereoPanner: vi.fn(() => makeNode({ pan: makeAudioParam(0) })),
    createBiquadFilter: vi.fn(() =>
      makeNode({
        type: "lowpass",
        frequency: { value: 0 },
        gain: { value: 0 },
        Q: { value: 0 },
      }),
    ),
    createDelay: vi.fn(() => makeNode({ delayTime: { value: 0 } })),
    createBuffer: vi.fn((channels, length) => ({
      getChannelData: vi.fn(() => new Float32Array(length)),
    })),
    createBufferSource: vi.fn(() =>
      makeNode({
        buffer: null,
        loop: false,
        start: vi.fn(),
        stop: vi.fn(),
      }),
    ),
  };
}

describe("AudioEngine lifecycle", () => {
  it("constructs a timer registry instead of scattered timer fields", () => {
    const engine = new AudioEngine();

    expect(engine._timers).toEqual({ drop: null, crack: null });
    expect(engine).not.toHaveProperty("_dropTimer");
    expect(engine).not.toHaveProperty("_crackTimer");
  });

  it("registers legacy tape as an engine-level alias for analog", () => {
    const engine = new AudioEngine();
    engine.ctx = makeMockCtx();

    engine._buildGraph();

    expect(engine.finalGains.tape).toBe(engine.finalGains.analog);
  });

  it("clears timer registry handles and nulls transient buffers during dispose", () => {
    vi.useFakeTimers();
    const engine = new AudioEngine();
    engine.ctx = makeMockCtx();
    engine._timers = {
      drop: setTimeout(() => {}, 1000),
      crack: setTimeout(() => {}, 1000),
    };
    engine._dropletBuf = { kind: "droplet" };
    engine._analogCrackleBuf = { kind: "crackle" };

    engine.dispose();

    expect(engine._timers).toEqual({ drop: null, crack: null });
    expect(engine._dropletBuf).toBeNull();
    expect(engine._analogCrackleBuf).toBeNull();
    vi.useRealTimers();
  });
});
