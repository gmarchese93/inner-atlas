import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Session from "../../artifacts/inner-atlas/src/pages/Session.jsx";

const audioMock = vi.hoisted(() => ({
  play: vi.fn(),
  pause: vi.fn(() => Promise.resolve()),
  resume: vi.fn(() => Promise.resolve()),
  applyMix: vi.fn(),
}));

vi.mock("../../artifacts/inner-atlas/src/lib/audioEngine.js", () => ({
  default: audioMock,
}));

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("Session timer behavior", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/session?mode=deep-focus&mood=calm");
    audioMock.play.mockReset();
    audioMock.pause.mockReset().mockResolvedValue(undefined);
    audioMock.resume.mockReset().mockResolvedValue(undefined);
    audioMock.applyMix.mockReset();
  });

  it("starts the visible timer before audioEngine.play resolves", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const play = deferred();
    audioMock.play.mockReturnValue(play.promise);

    render(
      <MemoryRouter>
        <Session />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /begin session/i }));

    await act(async () => {
      vi.advanceTimersByTime(1100);
    });

    expect(screen.getByText("00:01")).toBeInTheDocument();

    await act(async () => {
      play.resolve(true);
      await play.promise;
    });
  });
});
