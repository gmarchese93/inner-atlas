import { describe, expect, it } from "vitest";
import { AUDIBLE_STATES, STATE } from "../../artifacts/inner-atlas/src/audio/audioStateMachine.js";
import {
  LAYER_CAPS,
  MASTER_TARGET,
  curve,
} from "../../artifacts/inner-atlas/src/audio/gain.js";

describe("audio state safety", () => {
  it("only marks active playback transitions as audible", () => {
    expect([...AUDIBLE_STATES]).toEqual([
      STATE.STARTING,
      STATE.PLAYING,
      STATE.RESUMING,
    ]);
    expect(AUDIBLE_STATES.has(STATE.IDLE)).toBe(false);
    expect(AUDIBLE_STATES.has(STATE.PAUSED)).toBe(false);
    expect(AUDIBLE_STATES.has(STATE.DISPOSING)).toBe(false);
  });

  it("maps slider zero to true silence and clamps out-of-range input", () => {
    expect(curve(0)).toBe(0);
    expect(curve(-1)).toBe(0);
    expect(curve(1)).toBe(1);
    expect(curve(2)).toBe(1);
  });

  it("keeps every layer cap and the master target below unity gain", () => {
    expect(MASTER_TARGET).toBeGreaterThan(0);
    expect(MASTER_TARGET).toBeLessThan(1);

    for (const cap of Object.values(LAYER_CAPS)) {
      expect(cap).toBeGreaterThanOrEqual(0);
      expect(cap).toBeLessThan(1);
    }
  });
});
