import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import History from "../../artifacts/inner-atlas/src/pages/History.jsx";

const baseSession = {
  id: "session-1",
  mode: "deep-focus",
  mood: "calm",
  durationSeconds: 42,
  createdAt: "2026-01-01T12:00:00.000Z",
  audioMix: {},
  intention: null,
};

describe("History journal states", () => {
  it("shows quiet empty copy when a saved session has no journal text", () => {
    localStorage.setItem(
      "inner_atlas_sessions",
      JSON.stringify([{ ...baseSession, journalText: "" }]),
    );

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>,
    );

    expect(screen.getByText("No journal entry.")).toBeInTheDocument();
  });

  it("keeps the journal toggle for saved journal text", () => {
    localStorage.setItem(
      "inner_atlas_sessions",
      JSON.stringify([{ ...baseSession, journalText: "A saved reflection." }]),
    );

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /show journal/i })).toBeInTheDocument();
    expect(screen.queryByText("No journal entry.")).not.toBeInTheDocument();
  });
});
