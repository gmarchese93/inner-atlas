import { describe, expect, it } from "vitest";
import { LAYERS, MOODS } from "../../artifacts/inner-atlas/src/lib/constants.js";
import {
  SCENES,
  getDefaultScene,
  getSceneById,
  getScenesForMood,
  resolveScene,
} from "../../artifacts/inner-atlas/src/lib/scenes.js";

const EXPECTED_SCENES = {
  calm: ["still_room", "soft_rain", "warm_drift"],
  overloaded: ["rain_shelter", "low_fog", "static_clearing"],
  anxious: ["grounded_body", "distant_weather", "slow_breathing"],
  sad: ["night_window", "warm_analog", "deep_water"],
  clear: ["open_air", "blue_focus", "minimal_signal"],
};

describe("scene definitions", () => {
  it("provides three ordered scenes and a default for every mood", () => {
    expect(SCENES).toHaveLength(15);

    MOODS.forEach(({ id }) => {
      expect(getScenesForMood(id).map(scene => scene.id)).toEqual(EXPECTED_SCENES[id]);
      expect(getDefaultScene(id).id).toBe(EXPECTED_SCENES[id][0]);
    });
  });

  it("falls back to the mood default for missing or mismatched scene ids", () => {
    expect(resolveScene("soft_rain", "calm").id).toBe("soft_rain");
    expect(resolveScene("missing", "calm").id).toBe("still_room");
    expect(resolveScene("soft_rain", "sad").id).toBe("night_window");
    expect(getSceneById("missing")).toBeNull();
  });

  it("keeps scene data serializable and mixes limited to current layers", () => {
    SCENES.forEach(scene => {
      expect(JSON.parse(JSON.stringify(scene))).toEqual(scene);
      expect(Object.keys(scene.mix).sort()).toEqual([...LAYERS].sort());
      expect(scene.audio).toEqual({
        rainCurve: expect.any(String),
        padVoicing: expect.any(String),
        eventPattern: expect.any(String),
      });
      expect(scene.visual.palette).toHaveLength(3);
      expect(scene.visual.motion).toMatch(/^(still|slow|gentle)$/);
      expect(scene.prompt).toEqual(expect.any(String));
    });
  });
});
