import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OnboardingDeck } from "../../features/onboarding/components/OnboardingDeck";

const renderDeck = (props = {}) => {
  const onDismiss = vi.fn();
  const onOpenFeature = vi.fn();
  render(<OnboardingDeck isOpen onDismiss={onDismiss} onOpenFeature={onOpenFeature} {...props} />);
  return { onDismiss, onOpenFeature };
};

describe("OnboardingDeck", () => {
  it("moves through steps and opens the selected feature", async () => {
    const user = userEvent.setup(); const { onOpenFeature } = renderDeck();
    expect(screen.getByRole("dialog")).toHaveTextContent("1 of 7");
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Dashboard");
    expect(screen.getByRole("button", { name: "Back" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Open Dashboard" }));
    expect(onOpenFeature).toHaveBeenCalledWith("/app");
  });

  it("dismisses with skip, Escape, and finish", async () => {
    const user = userEvent.setup(); const { onDismiss } = renderDeck();
    await user.click(screen.getByRole("button", { name: /skip for now/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(2);
    for (let index = 0; index < 6; index += 1) await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Finish" }));
    expect(onDismiss).toHaveBeenCalledTimes(3);
  });
});