"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const FLASH_PARAM_KEYS = ["created", "logged", "deleted", "error", "fields"];

type FlashBannerProps = {
  message: string;
  variant: "success" | "error";
};

export function FlashBanner({ message, variant }: FlashBannerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cleanedRef = useRef(false);

  useEffect(() => {
    if (cleanedRef.current) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;
    for (const key of FLASH_PARAM_KEYS) {
      if (params.has(key)) {
        params.delete(key);
        changed = true;
      }
    }
    if (changed) {
      cleanedRef.current = true;
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [router, pathname, searchParams]);

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`mt-6 rounded-3xl px-5 py-4 text-sm font-medium ${
        variant === "success"
          ? "bg-emerald-100 text-emerald-900"
          : "bg-rose-100 text-rose-900"
      }`}
    >
      {message}
    </div>
  );
}
