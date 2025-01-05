"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { QUERY_KEYS } from "@/configs/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getTeamInvoicesAction } from "@/actions/billing-actions";

export default function BillingInvoicesTable() {
  const { teamId } = useParams();

  const {
    data: invoicesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.TEAM_INVOICES(teamId as string),
    queryFn: () => getTeamInvoicesAction(teamId as string),
    enabled: !!teamId,
  });

  return (
    <Table className="w-full animate-in fade-in">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              <div className="flex items-center gap-3">
                Loading invoices
                <Loader variant="line" />
              </div>
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          !error &&
          invoicesData?.type === "success" &&
          !invoicesData?.data?.length && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                <Alert variant="contrast1">
                  <AlertDescription>No invoices found</AlertDescription>
                </Alert>
              </TableCell>
            </TableRow>
          )}

        {error && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              <Alert variant="error">
                <AlertDescription>
                  Error loading invoices: {error?.message}
                </AlertDescription>
              </Alert>
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          invoicesData?.type === "success" &&
          invoicesData?.data?.map((invoice) => (
            <TableRow key={invoice.date_created}>
              <TableCell>
                {new Date(invoice.date_created).toLocaleDateString()}
              </TableCell>
              <TableCell>${invoice.cost.toFixed(2)}</TableCell>
              <TableCell>{invoice.paid ? "Paid" : "Pending"}</TableCell>
              <TableCell className="text-right">
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
