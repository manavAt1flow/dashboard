import { redirectToCheckoutAction } from "@/actions/billing-actions";
import { Button } from "@/components/ui/button";
import { GradientBorder } from "@/components/ui/gradient-border";
import { Tier } from "@/configs/tiers";
import { useSelectedTeam } from "@/hooks/use-teams";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

interface BillingTierCardProps {
  tier: Tier;
  isHighlighted?: boolean;
  isSelected?: boolean;
}

export default function BillingTierCard({
  tier,
  isHighlighted = false,
  isSelected,
}: BillingTierCardProps) {
  const team = useSelectedTeam();

  const { toast } = useToast();

  const { isPending, mutate: redirectToCheckout } = useMutation({
    mutationFn: async () => {
      if (!team) {
        return;
      }

      const res = await redirectToCheckoutAction({
        teamId: team.id,
        tierId: tier.id,
      });

      if (res?.type === "error") {
        throw new Error(res.message);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "error",
      });
    },
  });

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
        <h5 className="text-lg font-semibold">
          {tier.name}
          {isSelected === true && (
            <span className="align-top text-sm font-medium text-accent">
              {" *current"}
            </span>
          )}
        </h5>
        {isSelected === false && (
          <Button
            variant={isHighlighted ? "accent" : "muted"}
            className="h-7 text-xs"
            size="sm"
            loading={isPending}
            onClick={() => redirectToCheckout()}
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
