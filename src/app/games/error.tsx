"use client";

import { ErrorFallback } from "@/components/error-fallback";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorFallback
      title="We couldn't load the game browser."
      description="Catalog error"
      buttonLabel="Retry browser"
      reset={reset}
    />
  );
}
