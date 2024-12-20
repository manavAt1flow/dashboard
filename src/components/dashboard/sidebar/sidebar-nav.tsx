"use client";

import { useMetadata } from "@/components/providers/metadata-provider";
import { Button } from "@/components/ui/button";
import {
  MAIN_SIDEBAR_LINKS,
  SidebarLink,
  SETTINGS_SIDEBAR_LINKS,
} from "@/configs/sidebar-links";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
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
      delay: index * 0.05,
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

type GroupedLinks = {
  [key: string]: SidebarLink[];
};

export default function SidebarNav() {
  const segments = useSelectedLayoutSegments();
  const pathname = usePathname();

  const { lastTeamId } = useMetadata();

  const level: "main" | "settings" = useMemo(
    () =>
      segments.includes("settings") || segments.includes("account")
        ? "settings"
        : "main",
    [segments],
  );

  const navLinks = useMemo<SidebarLink[]>(() => {
    if (level === "settings") return SETTINGS_SIDEBAR_LINKS;

    return MAIN_SIDEBAR_LINKS;
  }, [level]);

  const direction = useMemo(
    () => (level === "main" ? "back" : "deeper"),
    [level],
  );

  const groupedNavLinks = useMemo<GroupedLinks>(() => {
    return navLinks.reduce((acc, link) => {
      const group = link.group || "ungrouped"; // Default to "ungrouped" if no group is defined
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(link);
      return acc;
    }, {} as GroupedLinks);
  }, [navLinks]);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={level}
        custom={direction}
        variants={terminalFrameVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative h-full p-4"
      >
        {level !== "main" && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="mb-2"
          >
            <Button
              variant="link"
              size="slate"
              className="gap-1 font-mono"
              asChild
            >
              <Link href={`/dashboard/${lastTeamId}`}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </motion.div>
        )}

        <div>
          {Object.entries(groupedNavLinks).map(([group, links]) => (
            <motion.div
              key={group}
              className="mt-6 flex w-full flex-col first:mt-0"
            >
              {group && group !== "ungrouped" && (
                <div className="mb-3 font-mono text-xs uppercase text-fg-300">
                  [{group}]
                </div>
              )}
              {links.map((item, index) => (
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
                    variant={
                      pathname === item.href({ teamId: lastTeamId })
                        ? "default"
                        : "ghost"
                    }
                    size="sm"
                    className="w-full justify-start font-mono capitalize"
                    asChild
                  >
                    <Link prefetch href={item.href({ teamId: lastTeamId })}>
                      <span className="mr-2">$</span>
                      {item.label}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
