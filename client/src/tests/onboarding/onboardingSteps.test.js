import { describe, expect, it } from "vitest";
import { ONBOARDING_STEPS } from "../../features/onboarding/onboardingSteps";

describe("onboarding steps", () => {
  it("covers every protected product feature route", () => {
    expect(ONBOARDING_STEPS.map((step) => step.to).filter(Boolean)).toEqual([
      "/app",
      "/app/resources",
      "/app/tasks",
      "/app/streaks",
      "/app/projects",
      "/app/applications"
    ]);
  });
});