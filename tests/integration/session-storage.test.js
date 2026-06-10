import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearActiveDraft,
  loadActiveDraft,
  saveActiveDraft,
} from "../../artifacts/inner-atlas/src/lib/activeSession.js";
import {
  clearAllSessions,
  deleteSession,
  loadSessions,
  saveSession,
} from "../../artifacts/inner-atlas/src/lib/sessionStorage.js";

describe("active session persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("saves a resumable draft with its update timestamp", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-07T12:00:00.000Z"));

    saveActiveDraft({
      mode: "deep-focus",
      mood: "calm",
      journalText: "Stay with one thought.",
    });

    expect(loadActiveDraft()).toEqual({
      mode: "deep-focus",
      mood: "calm",
      journalText: "Stay with one thought.",
      updatedAt: Date.now(),
    });
  });

  it("returns null for malformed draft data and can clear the draft", () => {
    localStorage.setItem("inner_atlas_active_session", "{invalid");
    expect(loadActiveDraft()).toBeNull();

    clearActiveDraft();
    expect(localStorage.getItem("inner_atlas_active_session")).toBeNull();
  });
});

describe("saved session history", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores new sessions in reverse chronological order", () => {
    saveSession({ id: "older", journalText: "First" });
    saveSession({ id: "newer", journalText: "Second" });

    expect(loadSessions().map((session) => session.id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("deletes one session without changing the others", () => {
    saveSession({ id: "keep" });
    saveSession({ id: "remove" });

    deleteSession("remove");

    expect(loadSessions()).toEqual([{ id: "keep" }]);
  });

  it("recovers from malformed history and clears all saved sessions", () => {
    localStorage.setItem("inner_atlas_sessions", "{invalid");
    expect(loadSessions()).toEqual([]);

    clearAllSessions();
    expect(localStorage.getItem("inner_atlas_sessions")).toBeNull();
  });
});
