"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type FlashBannerProps = {
  message: string;
  variant: "success" | "error";
};

export function FlashBanner({ message, variant }: FlashBannerProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

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
