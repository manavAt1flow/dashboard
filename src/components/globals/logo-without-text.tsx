"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LogoWithoutText({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !resolvedTheme) {
    return null;
  }

  return (
    <img
      src={`/meta/logo-${resolvedTheme}.svg`}
      className={cn("h-10 w-10", className)}
    />
  );
}
