import { describe, expect, it } from "vitest";
import { calculateStreakSummary } from "../src/utils/streakRule.js";

const NOW = new Date("2026-07-18T12:00:00.000Z");

describe("FocusOS streak rule", () => {
  it("counts one qualifying day even when several tasks complete that day", () => {
    expect(calculateStreakSummary(["2026-07-18T01:00:00Z", "2026-07-18T20:00:00Z"], NOW)).toEqual({ currentStreak: 1, bestStreak: 1 });
  });

  it("keeps a current streak active through today or yesterday only", () => {
    expect(calculateStreakSummary(["2026-07-16", "2026-07-17"], NOW)).toEqual({ currentStreak: 2, bestStreak: 2 });
    expect(calculateStreakSummary(["2026-07-16"], NOW)).toEqual({ currentStreak: 0, bestStreak: 1 });
  });

  it("calculates the longest consecutive run separately from the current streak", () => {
    expect(calculateStreakSummary(["2026-07-10", "2026-07-11", "2026-07-12", "2026-07-17"], NOW)).toEqual({ currentStreak: 1, bestStreak: 3 });
  });

  it("ignores future and invalid completion dates", () => {
    expect(calculateStreakSummary(["invalid", "2026-07-19", "2026-07-18"], NOW)).toEqual({ currentStreak: 1, bestStreak: 1 });
  });
});