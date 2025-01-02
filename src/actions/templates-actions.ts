"use server";

import { ActionResponse } from "@/types/actions";
import { Template } from "@/types/api";
import { E2BError } from "@/types/errors";
import { z } from "zod";
import { checkAuthenticated, getTeamApiKey } from "./utils";
import { MOCK_TEMPLATES_DATA } from "@/configs/data";

const GetTeamTemplatesParamsSchema = z.object({
  apiUrl: z.string().url(),
  teamId: z.string().uuid(),
});

export async function getTeamTemplatesAction({
  apiUrl,
  teamId,
}: z.infer<typeof GetTeamTemplatesParamsSchema>): Promise<
  ActionResponse<Template[]>
> {
  const { success } = GetTeamTemplatesParamsSchema.safeParse({
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
      data: MOCK_TEMPLATES_DATA,
    };
  }
  try {
    const { user } = await checkAuthenticated();

    const apiKey = await getTeamApiKey(user.id, teamId);

    const res = await fetch(`${apiUrl}/templates?teamID=${teamId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();

      throw new Error(
        text ?? `Failed to fetch api endpoint: /templates?teamID=${teamId}`,
      );
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
