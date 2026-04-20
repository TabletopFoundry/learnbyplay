"use client";

import { ErrorFallback } from "@/components/error-fallback";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorFallback
      title="Dashboard error"
      description="We couldn't load the teacher dashboard."
      buttonLabel="Retry dashboard"
      reset={reset}
    />
  );
}
