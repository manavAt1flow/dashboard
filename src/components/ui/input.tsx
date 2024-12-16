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
          "flex h-10 w-full bg-bg px-3 py-2",
          "text-sm font-mono tracking-wider",

          "border-2 border-dashed rounded-none",
          "shadow-[0px_1px_0_0px] shadow-contrast-2",

          "placeholder:text-fg-300 placeholder:font-mono",
          "focus:outline-none focus:shadow-accent",
          "disabled:cursor-not-allowed disabled:opacity-50",

          "file:border-0 file:bg-transparent",
          "file:text-sm file:font-mono file:uppercase",
          "file:mr-4 file:py-1 file:px-2",
          "file:border-2 file:border-dashed",
          "file:hover:bg-bg-300/80",

          "autofill:border-accent-100/80",
          "autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--accent-100)/0.2)] autofill:focus:shadow-accent-100/20",
          "autofill:text-fg autofill:bg-accent-100/30",

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
