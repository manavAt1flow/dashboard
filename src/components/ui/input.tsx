import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full bg-bg-100 px-3 py-2",
          "font-mono text-sm tracking-wider",

          "rounded-none border border-dashed",
          "[border-bottom:1px_solid_hsl(var(--contrast-2))]",

          "placeholder:font-mono placeholder:text-fg-500",
          "focus:outline-none focus:[border-bottom:1px_solid_hsl(var(--accent))]",
          "disabled:cursor-not-allowed disabled:opacity-50",

          "file:border-0 file:bg-transparent",
          "file:font-mono file:text-sm file:uppercase",
          "file:mr-4 file:px-2 file:py-1",
          "file:border-2 file:border-dashed",
          "file:hover:bg-bg-300/80",

          "autofill:border-solid autofill:border-accent-100/80 autofill:border-b-accent autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--accent-100)/0.2)]",
          "autofill:bg-accent-100/30 autofill:text-fg",

          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
