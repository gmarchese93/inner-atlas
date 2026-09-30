import { describe, expect, it } from "vitest";
import { getPadVoicing } from "../../artifacts/inner-atlas/src/audio/layers/pad.js";
import { getRainSublayerLevels } from "../../artifacts/inner-atlas/src/audio/layers/rain.js";

describe("scene audio parameters", () => {
  it("keeps every rain sublayer silent at zero for every curve", () => {
    ["balanced", "low_sparse", "sheltered", "distant"].forEach(curve => {
      expect(getRainSublayerLevels(0, curve)).toEqual({
        bed: 0,
        mid: 0,
        rumble: 0,
        droplets: 0,
      });
    });
  });

  it("falls back safely for unknown rain curves and pad voicings", () => {
    expect(getRainSublayerLevels(0.6, "missing")).toEqual(
      getRainSublayerLevels(0.6, "balanced"),
    );
    expect(getPadVoicing("missing")).toEqual(getPadVoicing("warm_open"));
  });

  it("provides alternate pad voicings with a stable voice count", () => {
    const names = ["warm_open", "warm_low", "grounded_low", "clear_open"];
    const voicings = names.map(getPadVoicing);

    voicings.forEach(voicing => expect(voicing).toHaveLength(6));
    expect(voicings[1]).not.toEqual(voicings[0]);
    expect(voicings[2]).not.toEqual(voicings[0]);
    expect(voicings[3]).not.toEqual(voicings[0]);
  });
});
