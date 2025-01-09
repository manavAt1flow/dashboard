import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GridPattern } from "@/components/ui/grid-pattern";
import { GradientBorder } from "@/components/ui/gradient-border";
import { cn } from "@/lib/utils";
import NetworkStateBanner from "@/components/providers/network-state-banner";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  if ((await supabase.auth.getUser()).data.user) {
    return redirect("/dashboard");
  }

  return (
    <div className="relative flex h-[100dvh] flex-col">
      <GridPattern
        width={50}
        height={50}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(800px_400px_at_center,white,transparent)]",
        )}
        gradientFrom="hsl(var(--accent-100))"
        gradientVia="hsl(var(--fg-100)/0.1)"
        gradientTo="hsl(var(--accent-100))"
        gradientDegrees={90}
      />
      <NetworkStateBanner />
      <div className="flex h-full w-full items-center justify-center px-4">
        <GradientBorder
          direction="bg-gradient-to-b"
          gradientFrom="from-bg-400"
          gradientVia="via-bg-200"
          gradientTo="to-bg-400"
          wrapperClassName="w-full max-w-96"
          className="p-6"
        >
          <div className="h-full w-full">{children}</div>
        </GradientBorder>
      </div>
    </div>
  );
}
