import { describe, expect, it } from "vitest";
import { LAYER_CAPS, RAMP_TC, REVERB_SEND } from "../../artifacts/inner-atlas/src/audio/gain.js";
import {
  INTENTION_NUDGES,
  LAYERS,
  LAYER_LABELS,
} from "../../artifacts/inner-atlas/src/lib/constants.js";
import { SCENES } from "../../artifacts/inner-atlas/src/lib/scenes.js";

describe("Pulse deprecation", () => {
  it("removes pulse from visible layer constants", () => {
    expect(LAYERS).toEqual(["drone", "pad", "rain", "analog", "air"]);
    expect(LAYER_LABELS).not.toHaveProperty("pulse");
  });

  it("removes pulse from scene mixes", () => {
    SCENES.forEach(scene => {
      expect(scene.mix).not.toHaveProperty("pulse");
    });
  });

  it("removes pulse from intention nudges", () => {
    Object.values(INTENTION_NUDGES).forEach(nudge => {
      expect(nudge).not.toHaveProperty("pulse");
    });
  });

  it("removes pulse from gain config", () => {
    expect(LAYER_CAPS).not.toHaveProperty("pulse");
    expect(RAMP_TC).not.toHaveProperty("pulse");
    expect(REVERB_SEND).not.toHaveProperty("pulse");
  });
});
