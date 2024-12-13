import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-y-0 before:-inset-x-1/2",
        "before:bg-[linear-gradient(90deg,transparent_0%,theme(colors.bg.100)_33%,theme(colors.bg.100)_66%,theme(colors.bg.100)_67%,theme(colors.bg.100)_68%,transparent_100%)]",
        "before:animate-shimmer before:bg-center before:bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
