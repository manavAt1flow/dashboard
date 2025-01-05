import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";
import BillingInvoicesTable from "@/components/dashboard/billing/billing-invoices-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BillingPage() {
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
          <CardContent></CardContent>
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
