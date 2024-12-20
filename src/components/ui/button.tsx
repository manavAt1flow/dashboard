import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader } from "./loader";

const buttonVariants = cva(
  [
    "inline-flex items-center gap-2 justify-center whitespace-nowrap",
    "font-mono uppercase tracking-wider text-sm",
    "transition-colors duration-150",
    "focus-visible:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-0",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-fg text-bg",
          "hover:bg-fg-100",
          "active:translate-y-[1px] active:shadow-none",
        ].join(" "),
        accent: [
          "border-2 border-dashed bg-accent text-accent-fg",
          "shadow-[0px_1px_0_0px] shadow-accent",
          "hover:bg-accent/90",
          "active:translate-y-[1px] active:shadow-none",
        ].join(" "),
        ghost: [
          "bg-transparent",
          "hover:bg-bg-200/90",
          "active:translate-y-[1px] active:shadow-none",
        ].join(" "),
        muted: [
          "border border-border-200 border-dashed bg-bg-200 text-fg",
          "hover:bg-bg-200/90",
          "active:translate-y-[1px] active:shadow-none",
        ].join(" "),
        error: [
          "bg-error text-error-fg",
          "hover:bg-error/90",
          "active:translate-y-[1px] active:shadow-none",
        ].join(" "),
        outline: [
          "border border-border bg-transparent",
          "hover:bg-bg-300/80",
          "active:translate-y-[1px] active:shadow-none",
        ].join(" "),
        link: [
          "text-accent underline-offset-4",
          "hover:underline hover:bg-transparent",
          "focus:ring-0 focus:underline",
          "shadow-none",
        ].join(" "),
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
        iconSm: "h-8 w-8",
        slate: "h-auto px-0 py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? <Loader variant="compute" /> : props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
