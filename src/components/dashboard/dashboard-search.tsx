"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DashboardSearchProps {
  className?: string;
}

export default function DashboardSearch({ className }: DashboardSearchProps) {
  const [query, setQuery] = useState("");

  return (
    <Input
      className={cn("w-full", className)}
      placeholder="Search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
