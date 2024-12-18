"use client";

import { useEffect, useState } from "react";

// Add this before the Button component
const LOADER_VARIANTS = {
  line: ["|", "/", "─", "\\"],
  progress: ["▰▱▱▱", "▰▰▱▱", "▰▰▰▱", "▰▰▰▰"],
  compute: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  dots: [".  ", ".. ", "...", " ..", "  .", "   "],
} as const;

export const Loader = ({
  variant = "line",
}: {
  variant?: keyof typeof LOADER_VARIANTS;
}) => {
  const [index, setIndex] = useState(0);
  const chars = LOADER_VARIANTS[variant];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % chars.length);
    }, 150);
    return () => clearInterval(timer);
  }, [chars]);

  return <span className="font-mono">{chars[index]}</span>;
};
