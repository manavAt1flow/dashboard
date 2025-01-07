"use server";

import { Template } from "@/types/api";
import { z } from "zod";
import { checkAuthenticated, getTeamApiKey, guardAction } from "./utils";
import { MOCK_TEMPLATES_DATA } from "@/configs/mock-data";

const GetTeamTemplatesParamsSchema = z.object({
  apiUrl: z.string().url(),
  teamId: z.string().uuid(),
});

export const getTeamTemplatesAction = guardAction(
  GetTeamTemplatesParamsSchema,
  async ({ apiUrl, teamId }) => {
    // TODO: Remove this after staging
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_TEMPLATES_DATA;
    }

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

    const data = (await res.json()) as Template[];

    return data;
  },
);
