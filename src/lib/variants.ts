import { cva } from "class-variance-authority";

export const cardVariants = cva("p-4", {
  variants: {
    variant: {
      default: "bg-gradient-to-b from-bg-100 to-bg border border-border",
      surface: "bg-gradient-to-b from-bg-300 to-bg-400 border border-border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
