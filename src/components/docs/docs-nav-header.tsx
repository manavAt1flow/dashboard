import Link from "next/link";
import { Button } from "../ui/button";
import { DocumentIcon, LinkIcon } from "@heroicons/react/24/outline";
import { CookingPotIcon } from "lucide-react";
import { GradientBorder } from "../ui/gradient-border";

const tabs = [
  {
    title: "Documentation",
    description: "The E2B documentation",
    url: "/docs",
    icon: DocumentIcon,
  },
  {
    title: "Reference",
    description: "SDK & API Reference",
    url: "/docs/reference",
    icon: LinkIcon,
  },
  {
    title: "Examples",
    description: "Latest from the E2B kitchen",
    url: "/docs/examples",
    icon: CookingPotIcon,
  },
];

export default function DocsNavHeader() {
  return (
    <div className="space-y-1 py-2">
      {tabs.map((tab) => (
        <Link
          key={tab.url}
          href={tab.url}
          className="group flex w-full items-center justify-start gap-2"
        >
          <GradientBorder
            direction="bg-gradient-to-bl"
            className="p-2 group-hover:bg-fg group-hover:text-bg"
          >
            <tab.icon className="size-3.5" />
          </GradientBorder>
          <div>
            <span className="font-mono text-fg-100">{tab.title}</span>
            <p className="text-[0.65rem] text-fg-500">{tab.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
