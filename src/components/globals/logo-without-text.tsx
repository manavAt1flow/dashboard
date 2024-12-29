"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function LogoWithoutText({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();

  return (
    <img
      src={`/meta/logo-${resolvedTheme || "dark"}.svg`}
      className={cn("h-10 w-10", className)}
      suppressHydrationWarning
    />
  );
}
