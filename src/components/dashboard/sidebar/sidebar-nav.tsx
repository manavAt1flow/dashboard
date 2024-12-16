"use client";

import { Button } from "@/components/ui/button";
import { MAIN_SIDEBAR_LINKS, TEAM_SIDEBAR_LINKS } from "@/configs/constants";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";

const terminalFrameVariants = {
  initial: (direction: "deeper" | "back") => ({
    x: direction === "deeper" ? 30 : -30,
    opacity: 0,
    clipPath:
      direction === "deeper" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
  }),
  animate: {
    x: 0,
    opacity: 1,
    clipPath: "inset(0 0 0 0)",
    transition: {
      x: { type: "spring", stiffness: 400, damping: 25 },
      opacity: { duration: 0.1 },
      clipPath: { duration: 0.15, ease: "easeOut" },
    },
  },
  exit: (direction: "deeper" | "back") => ({
    x: direction === "deeper" ? -30 : 30,
    opacity: 0,
    clipPath:
      direction === "deeper" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
    transition: {
      x: { type: "spring", stiffness: 400, damping: 25 },
      opacity: { duration: 0.1 },
      clipPath: { duration: 0.15, ease: "easeOut" },
    },
  }),
};

const itemVariants = {
  initial: { opacity: 0, x: -10 },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05, // Stagger effect
      duration: 0.2,
    },
  }),
  exit: { opacity: 0, x: 10 },
};

const scanlineVariants = {
  initial: { scaleX: 0 },
  animate: {
    scaleX: 1,
    transition: {
      duration: 0.3,
      ease: "linear",
    },
  },
};

export default function SidebarNav() {
  const segments = useSelectedLayoutSegments();
  const params = useParams();

  const level: "main" | "team" | "user" = useMemo(
    () =>
      segments.includes("dashboard") && segments.includes("settings")
        ? "team"
        : segments.includes("settings")
          ? "user"
          : "main",
    [segments]
  );

  const navLinks = useMemo(() => {
    if (level === "main") return MAIN_SIDEBAR_LINKS;
    if (level === "team") return TEAM_SIDEBAR_LINKS;
    return MAIN_SIDEBAR_LINKS;
  }, [level]);

  const direction = useMemo(
    () => (level === "main" ? "back" : "deeper"),
    [level]
  );

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={level}
        custom={direction}
        variants={terminalFrameVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative border-2 border-dashed p-4"
      >
        <motion.div
          variants={scanlineVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 bg-accent/5 pointer-events-none"
          style={{ originX: direction === "deeper" ? 0 : 1 }}
        />

        <div className="flex flex-col items-start gap-1">
          {level !== "main" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="link"
                size="slate"
                className="mb-2 font-mono gap-1"
                asChild
              >
                <Link href={`/dashboard/${params.orgId}`}>
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Link>
              </Button>
            </motion.div>
          )}

          {navLinks.map((item, index) => (
            <motion.div
              key={item.label}
              custom={index}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-mono"
                asChild
              >
                <Link href={item.href(params.teamId as string)}>
                  <span className="text-fg-300 mr-2">$</span>
                  {/* <item.icon className="w-4 h-4 mr-2" /> */}
                  {item.label}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
