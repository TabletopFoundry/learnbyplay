"use client";

import { useState } from "react";

import { SubmitButton } from "@/components/submit-button";

interface ConfirmDeleteFormProps {
  action: (formData: FormData) => Promise<void>;
  hiddenFields: Record<string, string | number>;
  confirmMessage: string;
  label?: string;
  pendingLabel?: string;
  className?: string;
}

export function ConfirmDeleteForm({
  action,
  hiddenFields,
  confirmMessage,
  label = "Delete",
  pendingLabel = "Deleting…",
  className = "!bg-transparent !text-rose-600 !shadow-none hover:!text-rose-800 !px-2 !py-1 text-xs",
}: ConfirmDeleteFormProps) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={`inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 ${className}`}
      >
        {label}
      </button>
    );
  }

  return (
    <form action={action} className="flex items-center gap-2">
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <span className="text-xs text-rose-700">{confirmMessage}</span>
      <SubmitButton
        label="Confirm"
        pendingLabel={pendingLabel}
        className="!bg-rose-600 hover:!bg-rose-700 !text-white !px-2 !py-1 text-xs"
      />
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-full px-2 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        Cancel
      </button>
    </form>
  );
}
