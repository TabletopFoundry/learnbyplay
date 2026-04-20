"use client";

import { ErrorFallback } from "@/components/error-fallback";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorFallback
      title="Catalog error"
      description="We couldn't load the game browser."
      buttonLabel="Retry browser"
      reset={reset}
    />
  );
}
