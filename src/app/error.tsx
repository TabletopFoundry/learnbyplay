"use client";

import { ErrorFallback } from "@/components/error-fallback";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorFallback
      title="Something needs another try"
      description="We couldn't load LearnByPlay right now."
      buttonLabel="Try again"
      reset={reset}
    />
  );
}
