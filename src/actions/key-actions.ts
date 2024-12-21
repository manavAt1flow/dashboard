"use server";

import {
  checkAuthenticated,
  checkUserTeamAuthorization,
  maskApiKey,
} from "./utils";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface ObscuredApiKey {
  name: string;
  masked_key: string;
  created_at: string | null;
}

interface GetTeamApiKeysResponse {
  apiKeys: ObscuredApiKey[];
}

export const getTeamApiKeysAction = async (
  teamId: string,
): Promise<GetTeamApiKeysResponse> => {
  try {
    const { user } = await checkAuthenticated();

    const isAuthorized = await checkUserTeamAuthorization(user.id, teamId);

    if (!isAuthorized) throw new Error("Not authorized to edit team api keys");

    const { data, error } = await supabaseAdmin
      .from("team_api_keys")
      .select("*")
      .eq("team_id", teamId);

    if (error) throw error;

    return {
      apiKeys: data.map((apiKey) => ({
        name: apiKey.name,
        masked_key: maskApiKey(apiKey),
        created_at: apiKey.created_at,
      })),
    };
  } catch (e) {
    console.error("get-team-api-keys-action:", e);

    throw e;
  }
};
