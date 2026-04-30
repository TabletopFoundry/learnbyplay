"use client";

import { ErrorFallback } from "@/components/error-fallback";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorFallback
      title="We couldn't load the teacher dashboard."
      description="Dashboard error"
      buttonLabel="Retry dashboard"
      reset={reset}
    />
  );
}
