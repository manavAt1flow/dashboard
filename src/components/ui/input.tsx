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
          "flex  h-9 text-fg w-full border border-fg-100 bg-bg px-3 text-sm ring-offset-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-fg-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0.5 disabled:cursor-not-allowed disabled:opacity-50",
          "autofill:border-accent-100 autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--accent-100)/0.2)]",
          "autofill:transition-[background-color] autofill:duration-[5000s] autofill:delay-0 autofill:ease-in-out",
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
