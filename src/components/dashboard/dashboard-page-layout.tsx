"use client";

import { exponential } from "@/lib/utils";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
              ease: exponential(4),
            }}
            className="ml-3 text-sm text-fg-500"
          >
            {description}
          </motion.p>
        )}
      </motion.div>
      <div className="scrollbar relative h-full max-h-full w-full overflow-y-auto px-5 pb-36 pt-8">
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
  const timeout = useRef<NodeJS.Timeout | null>(null);
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
