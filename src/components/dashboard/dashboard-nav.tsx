"use client";

import { useMetadata } from "@/components/providers/metadata-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { DashboardNavLink } from "@/configs/dashboard-navs";
import {
  MAIN_DASHBOARD_LINKS,
  SETTINGS_DASHBOARD_LINKS,
} from "@/configs/dashboard-navs";
import { PROTECTED_URLS } from "@/configs/urls";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";

const terminalFrameVariants = {
  initial: (direction: "deeper" | "back") => ({
    x: direction === "deeper" ? 30 : -30,
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.1,
    },
  },
  exit: (direction: "deeper" | "back") => ({
    x: direction === "deeper" ? -30 : 30,
    opacity: 0,
    transition: {
      duration: 0.1,
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

type GroupedLinks = {
  [key: string]: DashboardNavLink[];
};

export default function DasboardNav() {
  const segments = useSelectedLayoutSegments();
  const pathname = usePathname();

  const { selectedTeamId } = useMetadata();

  const level: "main" | "settings" = useMemo(
    () =>
      segments.includes("settings") || segments.includes("account")
        ? "settings"
        : "main",
    [segments],
  );

  const navLinks = useMemo<DashboardNavLink[]>(() => {
    if (level === "settings") return SETTINGS_DASHBOARD_LINKS;

    return MAIN_DASHBOARD_LINKS;
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
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={level}
        custom={direction}
        variants={terminalFrameVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative h-full"
      >
        {level !== "main" && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <Button
              variant="link"
              size="slate"
              className="gap-1 font-mono"
              asChild
            >
              <Link prefetch href={PROTECTED_URLS.DASHBOARD}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </motion.div>
        )}

        <div>
          {Object.entries(groupedNavLinks).map(([group, links]) => (
            <div
              key={group}
              className="mt-6 flex w-full flex-col gap-1 first:mt-0"
            >
              {group && group !== "ungrouped" && (
                <div className="mb-2 font-mono text-xs uppercase text-fg-500">
                  <span className="text-fg-300">{group}</span>
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
                  <Link
                    prefetch
                    href={item.href({ teamId: selectedTeamId })}
                    className={cn(
                      "h-8 p-0 pl-1",
                      "group flex w-full items-center justify-start gap-1 font-mono text-sm font-medium capitalize hover:no-underline",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2 px-2 py-1",
                        pathname === item.href({ teamId: selectedTeamId }) &&
                          "bg-fg text-bg",
                      )}
                    >
                      <span>{item.goesDeeper ? ">" : "$"}</span>
                      {item.label}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
