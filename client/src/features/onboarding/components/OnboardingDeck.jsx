import { useEffect, useRef, useState } from "react";
import { ONBOARDING_STEPS } from "../onboardingSteps";

export const OnboardingDeck = ({ isOpen, onDismiss, onOpenFeature }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const titleRef = useRef(null);
  const step = ONBOARDING_STEPS[stepIndex];
  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1;

  useEffect(() => {
    if (!isOpen) return undefined;
    setStepIndex(0);
    titleRef.current?.focus();
    const handleKeyDown = (event) => { if (event.key === "Escape") onDismiss(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" data-testid="registration-onboarding-deck">
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />
    <section role="dialog" aria-modal="true" aria-labelledby="onboarding-title" className="relative z-10 w-full max-w-xl rounded-[28px] border border-outline-variant/70 bg-surface/95 p-6 shadow-elevated backdrop-blur-sm sm:p-8">
      <div className="flex items-center justify-between gap-4"><p className="text-label-sm uppercase tracking-[0.2em] text-primary">{step.eyebrow}</p><p className="text-label-sm text-on-surface-variant">{stepIndex + 1} of {ONBOARDING_STEPS.length}</p></div>
      <h2 ref={titleRef} id="onboarding-title" tabIndex="-1" className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-on-surface">{step.title}</h2>
      <p className="mt-4 text-body-lg text-on-surface-variant">{step.description}</p>
      {step.to ? <button type="button" onClick={() => onOpenFeature(step.to)} className="mt-6 inline-flex rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-label-md text-primary transition hover:bg-primary/20">{step.actionLabel}</button> : null}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-outline-variant/60 pt-5 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={onDismiss} className="text-label-md text-on-surface-variant transition hover:text-on-surface">Skip for now</button><div className="flex gap-3"><button type="button" onClick={() => setStepIndex((current) => current - 1)} disabled={stepIndex === 0} className="rounded-xl border border-outline-variant px-4 py-3 text-label-md text-on-surface disabled:cursor-not-allowed disabled:opacity-50">Back</button>{isLastStep ? <button type="button" onClick={onDismiss} className="rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary">Finish</button> : <button type="button" onClick={() => setStepIndex((current) => current + 1)} className="rounded-xl bg-primary px-4 py-3 text-label-md text-on-primary">Next</button>}</div></div>
    </section>
  </div>;
};