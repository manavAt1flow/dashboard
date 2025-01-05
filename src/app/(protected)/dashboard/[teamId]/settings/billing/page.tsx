"use client";

import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";
import BillingInvoicesTable from "@/components/dashboard/billing/billing-invoices-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TIERS } from "@/configs/tiers";
import BillingTierCard from "@/components/dashboard/billing/billing-tier-card";
import { useSelectedTeam } from "@/hooks/use-teams";

export default function BillingPage() {
  const team = useSelectedTeam();

  return (
    <DashboardPageLayout title="Billing">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-8">
          <CardHeader>
            <CardTitle>Plan</CardTitle>
            <CardDescription>
              Manage your current plan and subscription details.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            {TIERS.map((tier) => (
              <BillingTierCard
                key={tier.id}
                tier={tier}
                isHighlighted={tier.id === "pro_v1"}
                isSelected={!team ? true : team?.tier === tier.id}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Credits</CardTitle>
            <CardDescription>Your team has 1000 credits.</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>

        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View your team's billing history and invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BillingInvoicesTable />
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
