"use server";

import { Sandbox } from "@/types/api";
import { ActionResponse } from "@/types/actions";
import { checkAuthenticated, getTeamApiKey } from "./utils";
import { E2BError } from "@/types/errors";
import { z } from "zod";
import MOCK_SANDBOXES_DATA from "@/configs/data";

const GetTeamSandboxesParamsSchema = z.object({
  apiUrl: z.string().url(),
  teamId: z.string().uuid(),
});

export async function getTeamSandboxesAction({
  apiUrl,
  teamId,
}: z.infer<typeof GetTeamSandboxesParamsSchema>): Promise<
  ActionResponse<Sandbox[]>
> {
  const { success } = GetTeamSandboxesParamsSchema.safeParse({
    apiUrl,
    teamId,
  });

  if (!success) {
    return {
      type: "error",
      message: "Invalid parameters",
    };
  }

  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      type: "success",
      data: MOCK_SANDBOXES_DATA,
    };
  }

  try {
    const { user } = await checkAuthenticated();

    const apiKey = await getTeamApiKey(user.id, teamId);

    const res = await fetch(`${apiUrl}/sandboxes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
    });

    if (!res.ok) {
      const text = await res.text();

      throw new Error(text ?? `Failed to fetch api endpoint: /sandboxes`);
    }

    const data = await res.json();

    return {
      type: "success",
      data: data.sandboxes,
    };
  } catch (error) {
    if (error instanceof E2BError) {
      return {
        type: "error",
        message: error.message,
      };
    }

    return {
      type: "error",
      message: "Failed to fetch sandboxes",
    };
  }
}
