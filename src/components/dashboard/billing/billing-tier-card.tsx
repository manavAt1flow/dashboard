import { Button } from "@/components/ui/button";
import { GradientBorder } from "@/components/ui/gradient-border";
import { Tier } from "@/configs/tiers";

interface BillingTierCardProps {
  tier: Tier;
  isHighlighted?: boolean;
  isSelected?: boolean;
}

export default function BillingTierCard({
  tier,
  isHighlighted = false,
  isSelected = false,
}: BillingTierCardProps) {
  return (
    <GradientBorder
      {...(isHighlighted
        ? {
            gradientFrom: "from-accent",
            gradientVia: "via-accent/50",
            gradientTo: "to-transparent",
          }
        : {})}
      wrapperClassName="h-min"
      className="p-6"
    >
      <div className="mb-3 flex justify-between gap-2">
        <h5 className="text-lg font-semibold">{tier.name}</h5>
        {!isSelected && (
          <Button
            variant={isHighlighted ? "accent" : "muted"}
            className="h-7 text-xs"
            size="sm"
          >
            Select
          </Button>
        )}
      </div>
      <ul className="space-y-1 pl-4">
        {tier.prose.map((prose, i) => (
          <li className="font-sans" key={`tier-${tier.id}-prose-${i}`}>
            {prose}
          </li>
        ))}
      </ul>
    </GradientBorder>
  );
}
