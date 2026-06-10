import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Home from "../../artifacts/inner-atlas/src/pages/Home.jsx";
import MoodSelector from "../../artifacts/inner-atlas/src/pages/MoodSelector.jsx";

describe("home-to-mood navigation", () => {
  it("opens the mood selector for the chosen mode", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mood" element={<MoodSelector />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(
      screen.getByRole("button", { name: /deep focus/i }),
    );

    expect(
      screen.getByRole("heading", { name: /how are you arriving/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /quiet/i })).toBeInTheDocument();
  });
});
