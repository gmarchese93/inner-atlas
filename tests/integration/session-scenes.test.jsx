import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Session from "../../artifacts/inner-atlas/src/pages/Session.jsx";

const audioMock = vi.hoisted(() => ({
  play: vi.fn(() => Promise.resolve(true)),
  pause: vi.fn(() => Promise.resolve(true)),
  resume: vi.fn(() => Promise.resolve(true)),
  applyMix: vi.fn(),
}));

vi.mock("../../artifacts/inner-atlas/src/lib/audioEngine.js", () => ({
  default: audioMock,
}));

function renderSession(search = "?mode=deep-focus&mood=calm") {
  window.history.pushState({}, "", `/session${search}`);
  return render(
    <MemoryRouter>
      <Session />
    </MemoryRouter>,
  );
}

describe("Session scenes", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.values(audioMock).forEach(mock => mock.mockClear());
  });

  it("selects and persists the mood default when the route omits scene", async () => {
    renderSession();

    expect(screen.getByRole("button", { name: /still room/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByPlaceholderText("Let the room quiet around one thought.")).toBeInTheDocument();

    await waitFor(() => {
      const draft = JSON.parse(localStorage.getItem("inner_atlas_active_session"));
      expect(draft.sceneId).toBe("still_room");
    });
  });

  it("switches scene before Begin and routes its mix and audio parameters", async () => {
    renderSession();
    const softRain = screen.getByRole("button", { name: /soft rain/i });

    fireEvent.click(softRain);

    expect(softRain).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByPlaceholderText("Notice what softens when nothing asks for an answer.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /begin session/i }));

    await waitFor(() => {
      expect(audioMock.play).toHaveBeenCalledWith(
        { drone: 0.20, pad: 0.48, rain: 0.28, analog: 0.06, air: 0.12 },
        { rainCurve: "sheltered", padVoicing: "warm_open", eventPattern: "crystal_start" },
      );
    });
    expect(softRain).toBeDisabled();
  });

  it("restores an old draft without sceneId into the default scene", async () => {
    localStorage.setItem("inner_atlas_active_session", JSON.stringify({
      mode: "deep-focus",
      mood: "calm",
      journalText: "An older draft.",
      audioMix: { drone: 0.11, pad: 0.22, rain: 0.33, analog: 0.04, air: 0.05 },
    }));

    renderSession();

    await waitFor(() => expect(screen.getByDisplayValue("An older draft.")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /still room/i })).toHaveAttribute("aria-pressed", "true");
  });

  it("saves the selected sceneId with the completed session", async () => {
    renderSession("?mode=deep-focus&mood=calm&scene=warm_drift");

    fireEvent.click(screen.getByRole("button", { name: /end & save/i }));

    await waitFor(() => {
      const sessions = JSON.parse(localStorage.getItem("inner_atlas_sessions"));
      expect(sessions[0].sceneId).toBe("warm_drift");
    });
  });
});
