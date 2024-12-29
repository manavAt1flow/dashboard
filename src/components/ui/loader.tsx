"use client";

import { useEffect, useState } from "react";

// Add this before the Button component
const LOADER_VARIANTS = {
  line: ["|", "/", "─", "\\"],
  progress: ["▰▱▱▱▱▱", "▰▰▱▱▱▱", "▰▰▰▱▱▱", "▰▰▰▰▱▱", "▰▰▰▰▰▱", "▰▰▰▰▰▰"],
  compute: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  dots: [".  ", ".. ", "...", " ..", "  .", "   "],
  clock: [
    "🕐",
    "🕑",
    "🕒",
    "🕓",
    "🕔",
    "🕕",
    "🕖",
    "🕗",
    "🕘",
    "🕙",
    "🕚",
    "🕛",
  ],
  bounce: ["⠁", "⠂", "⠄", "⠂"],
  wave: ["⠀", "⠄", "⠆", "⠇", "⠋", "⠙", "⠸", "⠰", "⠠", "⠀"],
  square: ["◰", "◳", "◲", "◱"],
  pulse: ["□", "◊", "○", "◊"],
} as const;

export const Loader = ({
  variant = "line",
  interval = 150,
}: {
  variant?: keyof typeof LOADER_VARIANTS;
  interval?: number;
}) => {
  const [index, setIndex] = useState(0);
  const chars = LOADER_VARIANTS[variant];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % chars.length);
    }, interval);
    return () => clearInterval(timer);
  }, [chars, interval]);

  return <span className="font-mono">{chars[index]}</span>;
};
