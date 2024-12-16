"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarSearchProps {
  className?: string;
}

export default function SidebarSearch({ className }: SidebarSearchProps) {
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
