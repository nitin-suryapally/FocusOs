/**
 * FocusOS streak rule
 *
 * A qualifying day is a UTC calendar day with at least one completed task.
 * Multiple completed tasks on the same day count once. Future dates and invalid
 * values never count. The current streak is the consecutive run ending today,
 * or yesterday when today has not yet qualified; a gap before yesterday breaks it.
 * Best streak is the longest consecutive run across all qualifying days.
 *
 * This pure rule accepts completion dates only. Persistence and task completion
 * timestamps are deliberately deferred to the following Streaks slice.
 */
const toUtcDay = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const calculateStreakSummary = (completionDates, now = new Date()) => {
  const today = toUtcDay(now);
  const days = [...new Set(completionDates.map(toUtcDay).filter((day) => day !== null && day <= today))].sort((a, b) => a - b);
  let bestStreak = 0;
  let run = 0;

  days.forEach((day, index) => {
    run = index > 0 && day === days[index - 1] + DAY_MS ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
  });

  const currentEnd = days.at(-1);
  const canContinue = currentEnd === today || currentEnd === today - DAY_MS;
  let currentStreak = 0;

  if (canContinue) {
    for (let index = days.length - 1; index >= 0; index -= 1) {
      if (index < days.length - 1 && days[index] !== days[index + 1] - DAY_MS) break;
      currentStreak += 1;
    }
  }

  return { currentStreak, bestStreak };
};