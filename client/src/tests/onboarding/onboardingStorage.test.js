import { beforeEach, describe, expect, it } from "vitest";
import { dismissRegistrationOnboarding, hasPendingRegistrationOnboarding, markRegistrationOnboardingPending } from "../../features/onboarding/onboardingStorage";

describe("registration onboarding storage", () => {
  beforeEach(() => window.sessionStorage.clear());
  it("keeps pending and dismissed state isolated by user", () => {
    markRegistrationOnboardingPending("user-1");
    expect(hasPendingRegistrationOnboarding("user-1")).toBe(true);
    expect(hasPendingRegistrationOnboarding("user-2")).toBe(false);
    dismissRegistrationOnboarding("user-1");
    expect(hasPendingRegistrationOnboarding("user-1")).toBe(false);
  });
});