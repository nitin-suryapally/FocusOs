export const ConfirmActionModal = ({ isOpen, title, description, confirmLabel = "Confirm", isConfirming, onCancel, onConfirm, testId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" data-testid={testId}>
      <button type="button" aria-label="Close confirmation" onClick={onCancel} disabled={isConfirming} className="absolute inset-0 bg-background/75 backdrop-blur-sm" />
      <section role="dialog" aria-modal="true" aria-labelledby="confirm-action-title" className="relative z-10 w-full max-w-md rounded-[28px] border border-outline-variant/70 bg-surface/95 p-6 shadow-card backdrop-blur-sm sm:p-8">
        <h2 id="confirm-action-title" className="text-2xl font-semibold text-on-surface">{title}</h2>
        <p className="mt-3 text-body-md text-on-surface-variant">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} disabled={isConfirming} className="rounded-xl border border-outline-variant px-4 py-3 text-label-md text-on-surface disabled:opacity-70">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={isConfirming} className="rounded-xl bg-error px-4 py-3 text-label-md text-on-error disabled:opacity-70">{isConfirming ? "Deleting..." : confirmLabel}</button>
        </div>
      </section>
    </div>
  );
};