"use client";

import { ErrorFallback } from "@/components/error-fallback";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorFallback
      title="We couldn't load LearnByPlay right now."
      description="Something needs another try"
      buttonLabel="Try again"
      reset={reset}
    />
  );
}
