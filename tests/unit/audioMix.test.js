import { describe, expect, it } from "vitest";
import { normalizeMix } from "../../artifacts/inner-atlas/src/lib/audioMix.js";

const preset = {
  drone: 0.1,
  pad: 0.2,
  rain: 0.3,
  analog: 0.4,
  air: 0.5,
  extra: 0.6,
};

describe("normalizeMix", () => {
  it("returns the preset unchanged when raw is null", () => {
    expect(normalizeMix(null, preset)).toEqual(preset);
  });

  it("applies current layer values from raw", () => {
    expect(
      normalizeMix(
        { drone: 0.9, pad: 0.8, rain: 0.7, analog: 0.6, air: 0.5 },
        preset,
      ),
    ).toMatchObject({ drone: 0.9, pad: 0.8, rain: 0.7, analog: 0.6, air: 0.5 });
  });

  it("clamps current layer values to the [0, 1] range", () => {
    expect(
      normalizeMix({ drone: -1, pad: 2, rain: "0.75", analog: "bad" }, preset),
    ).toMatchObject({ drone: 0, pad: 1, rain: 0.75, analog: 0 });
  });

  it("maps legacy tape to analog after direct analog", () => {
    expect(normalizeMix({ analog: 0.2, tape: 0.85 }, preset).analog).toBe(0.85);
  });

  it("discards legacy pulse from the effective mix", () => {
    expect(normalizeMix({ pulse: 0.15 }, preset)).not.toHaveProperty("pulse");
  });

  it("preserves preset keys not present in raw", () => {
    expect(normalizeMix({ drone: 0.9 }, preset)).toEqual({ ...preset, drone: 0.9 });
  });
});
