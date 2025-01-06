"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { QUERY_KEYS } from "@/configs/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getTeamInvoicesAction } from "@/actions/billing-actions";

export default function BillingInvoicesTable() {
  const { teamId } = useParams();

  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.TEAM_INVOICES(teamId as string),
    queryFn: async () => {
      const res = await getTeamInvoicesAction(teamId as string);
      if (res.type === "error") {
        throw new Error(res.message);
      }
      return res.data;
    },
    enabled: !!teamId,
  });

  return (
    <Table className="w-full animate-in fade-in">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={4} className="text-left">
              <Alert className="w-full" variant="contrast2">
                <AlertTitle className="flex items-center gap-2">
                  <Loader variant="compute" />
                  Loading invoices...
                </AlertTitle>
                <AlertDescription>This may take a moment.</AlertDescription>
              </Alert>
            </TableCell>
          </TableRow>
        )}

        {!isLoading && !error && !invoices?.length && (
          <TableRow>
            <TableCell colSpan={4} className="text-left">
              <Alert className="w-full" variant="contrast1">
                <AlertTitle>No invoices found.</AlertTitle>
                <AlertDescription>
                  Your team has no invoices yet.
                </AlertDescription>
              </Alert>
            </TableCell>
          </TableRow>
        )}

        {error && (
          <TableRow>
            <TableCell colSpan={4} className="text-left">
              <Alert className="w-full" variant="error">
                <AlertTitle>Error loading invoices.</AlertTitle>
                <AlertDescription>{error?.message}</AlertDescription>
              </Alert>
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          invoices?.map((invoice) => (
            <TableRow key={invoice.date_created}>
              <TableCell>
                {new Date(invoice.date_created).toLocaleDateString()}
              </TableCell>
              <TableCell>${invoice.cost.toFixed(2)}</TableCell>
              <TableCell>{invoice.paid ? "Paid" : "Pending"}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(invoice.url, "_blank")}
                >
                  View Invoice
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
