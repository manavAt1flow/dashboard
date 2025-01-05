"use server";

import { ActionResponse } from "@/types/actions";
import { Invoice } from "@/types/billing";
import { checkAuthenticated, getTeamApiKey } from "./utils";
import { E2BError } from "@/types/errors";

export const getTeamInvoicesAction = async (
  teamId: string,
): Promise<ActionResponse<Invoice[]>> => {
  try {
    const { user } = await checkAuthenticated();

    const apiKey = await getTeamApiKey(user.id, teamId);

    const res = await fetch(
      `${process.env.BILLING_API_URL}/teams/${teamId}/invoices`,
      {
        headers: {
          "X-Team-API-Key": apiKey,
        },
      },
    );

    if (!res.ok) {
      const text = await res.text();

      throw new Error(
        text ?? `Failed to fetch billing endpoint: /teams/${teamId}/invoices`,
      );
    }

    const invoices = (await res.json()) as Invoice[];

    return {
      type: "success",
      data: invoices,
    };
  } catch (e) {
    console.error(e);

    if (e instanceof E2BError) {
      return {
        type: "error",
        message: e.message,
      };
    }

    return {
      type: "error",
      message: "Failed to fetch invoices",
    };
  }
};
