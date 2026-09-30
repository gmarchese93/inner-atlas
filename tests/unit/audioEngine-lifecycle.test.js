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

  it("routes scene audio parameters through the existing graph", () => {
    const engine = new AudioEngine();
    engine.ctx = makeMockCtx();
    engine._buildGraph();

    engine.applyMix(
      { rain: 0 },
      { rainCurve: "sheltered", padVoicing: "grounded_low", eventPattern: "none" },
    );

    expect(engine._sceneAudio).toEqual({
      rainCurve: "sheltered",
      padVoicing: "grounded_low",
      eventPattern: "none",
    });
    expect(engine._padVoices[0].osc.frequency.value).toBe(82);
    expect(engine._rainSubs.bed.gain.setTargetAtTime).toHaveBeenCalledWith(0, 0, 0.35);
  });

  it("starts through the public play seam with scene audio parameters", async () => {
    const engine = new AudioEngine();
    engine.ctx = makeMockCtx();
    engine.masterGain = makeNode({ gain: makeAudioParam(0) });
    engine.finalGains.drone = makeNode({ gain: makeAudioParam(0) });
    engine._fadeMasterTo = vi.fn(() => Promise.resolve());
    engine._setRainSublayers = vi.fn();

    await expect(engine.play(
      { drone: 0.25, rain: 0.40 },
      { rainCurve: "distant", padVoicing: "clear_open", eventPattern: "none" },
    )).resolves.toBe(true);

    expect(engine.isPlaying).toBe(true);
    expect(engine._sceneAudio).toEqual({
      rainCurve: "distant",
      padVoicing: "clear_open",
      eventPattern: "none",
    });
    expect(engine._userValues).toMatchObject({ drone: 0.25, rain: 0.40 });
    expect(engine._setRainSublayers).toHaveBeenCalled();
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
