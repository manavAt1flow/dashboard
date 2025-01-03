"use client";

import { cn, exponentialSmoothing } from "@/lib/utils";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GridPattern from "../ui/grid-pattern";

export default function DashboardPageLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <>
      <motion.div className="flex flex-col gap-1 bg-gradient-to-r from-bg-200 from-80% to-transparent to-20% bg-[length:22px_1px] bg-left-bottom bg-repeat-x pb-4">
        <AsciiTitleDecrypt title={title} interval={15} obscureCharacter="X" />
        {description && (
          <motion.p
            initial={{ opacity: 0, x: 5, y: 5 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              x: { delay: 0.3 },
              duration: 0.2,
              ease: exponentialSmoothing(4),
            }}
            className="ml-3 text-sm text-fg-500"
          >
            {description}
          </motion.p>
        )}
      </motion.div>
      <div className="scrollbar relative h-full max-h-full w-full overflow-y-auto px-16 pb-36 pt-12">
        <GridPattern
          width={100}
          height={100}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          gradientFrom="hsl(var(--bg-200)/0.7)"
          gradientVia="hsl(var(--bg-200)/0.5)"
          gradientTo="hsl(var(--bg-200)/0.7)"
          gradientDegrees={90}
          className="pt-4"
        />
        {children}
      </div>
    </>
  );
}

function AsciiTitleDecrypt({
  title,
  interval = 30,
  obscureCharacter = "X",
}: {
  title: string;
  interval?: number;
  obscureCharacter?: string;
}) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosition = 3 + title.length + 6;
  const baseText = useRef(title + " ".repeat(6)).current;

  const [position, setPosition] = useState(startPosition);

  const displayedText = useMemo(() => {
    return (
      "\\\\ " +
      baseText.slice(3, position).replace(/./g, obscureCharacter) +
      baseText.slice(position)
    );
  }, [position, baseText, obscureCharacter]);

  const animate = useCallback(() => {
    if (position <= 0) return;

    timeout.current = setTimeout(() => {
      setPosition((prev) => prev - 1);
    }, interval);
  }, [position, interval]);

  useEffect(() => {
    const startAnimation = () => {
      animate();
    };

    startAnimation();

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [animate]);

  return (
    <h1 className="text-2xl font-medium text-fg-100">
      {displayedText.split("").map((char, index) => (
        <span
          key={index}
          className={
            char === obscureCharacter
              ? "bg-fg text-bg"
              : char === "\\"
                ? "text-fg-500"
                : ""
          }
        >
          {char}
        </span>
      ))}
    </h1>
  );
}
