const storageKey = (userId) => `focus-ai-registration-onboarding:${userId}`;

export const markRegistrationOnboardingPending = (userId) => {
  if (!userId || typeof window === "undefined") return;
  window.sessionStorage.setItem(storageKey(userId), "pending");
};

export const hasPendingRegistrationOnboarding = (userId) => userId && typeof window !== "undefined" && window.sessionStorage.getItem(storageKey(userId)) === "pending";

export const dismissRegistrationOnboarding = (userId) => {
  if (!userId || typeof window === "undefined") return;
  window.sessionStorage.setItem(storageKey(userId), "dismissed");
};