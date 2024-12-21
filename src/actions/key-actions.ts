"use server";

import { API_KEY_PREFIX } from "@/configs/constants";
import {
  checkAuthenticated,
  checkUserTeamAuthorization,
  maskApiKey,
} from "./utils";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

// Get API Keys

const GetApiKeysSchema = z.object({
  teamId: z.string({ required_error: "Team ID is required" }).uuid(),
});

interface ObscuredApiKey {
  id: string;
  name: string;
  maskedKey: string;
  createdBy: string | null;
  createdAt: string | null;
}

interface GetTeamApiKeysResponse {
  apiKeys: ObscuredApiKey[];
}

export const getTeamApiKeysAction = async ({
  teamId,
}: z.infer<typeof GetApiKeysSchema>): Promise<GetTeamApiKeysResponse> => {
  try {
    GetApiKeysSchema.parse({
      teamId,
    });

    const { user } = await checkAuthenticated();

    const isAuthorized = await checkUserTeamAuthorization(user.id, teamId);

    if (!isAuthorized) throw new Error("Not authorized to edit team api keys");

    const { data, error } = await supabaseAdmin
      .from("team_api_keys")
      .select("*")
      .eq("team_id", teamId);

    if (error) throw error;

    const resultApiKeys: ObscuredApiKey[] = [];

    for (const apiKey of data) {
      let userEmail: string | null = null;

      if (apiKey.created_by) {
        const { data: keyUserData } = await supabaseAdmin
          .from("auth_users")
          .select("email")
          .eq("id", apiKey.created_by);

        if (keyUserData && keyUserData[0]) {
          userEmail = keyUserData[0].email;
        }
      }

      resultApiKeys.push({
        id: apiKey.id,
        name: apiKey.name,
        maskedKey: maskApiKey(apiKey),
        createdAt: apiKey.created_at,
        createdBy: userEmail,
      });
    }

    return { apiKeys: resultApiKeys };
  } catch (e) {
    console.error("get-team-api-keys-action:", e);

    throw e;
  }
};

// Create API Key

const CreateApiKeySchema = z.object({
  teamId: z.string({ required_error: "Team ID is required" }).uuid(),
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name cannot be empty")
    .max(50, "Name cannot be longer than 50 characters")
    .trim(),
});

interface CreateApiKeyResponse {
  createdApiKey: string;
}

function generateTeamApiKey(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(20));
  const hexString = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return API_KEY_PREFIX + hexString;
}

export const createApiKeyAction = async ({
  teamId,
  name,
}: z.infer<typeof CreateApiKeySchema>): Promise<CreateApiKeyResponse> => {
  try {
    CreateApiKeySchema.parse({
      teamId,
      name,
    });

    const { user } = await checkAuthenticated();

    const isAuthorized = await checkUserTeamAuthorization(user.id, teamId);

    if (!isAuthorized)
      throw new Error("Not authorized to create team api keys");

    const apiKeyValue = generateTeamApiKey();

    console.log("apiKeyValue:", apiKeyValue);

    const { error } = await supabaseAdmin
      .from("team_api_keys")
      .insert({
        team_id: teamId,
        name: name,
        api_key: apiKeyValue,
        created_by: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return {
      createdApiKey: apiKeyValue,
    };
  } catch (e) {
    console.error("create-api-key-action:", e);
    throw e;
  }
};

// Delete API Key

const DeleteApiKeySchema = z.object({
  teamId: z.string({ required_error: "Team ID is required" }).uuid(),
  apiKeyId: z.string({ required_error: "API Key ID is required" }).uuid(),
});

interface DeleteApiKeyResponse {
  success: boolean;
}

export const deleteApiKeyAction = async ({
  teamId,
  apiKeyId,
}: z.infer<typeof DeleteApiKeySchema>): Promise<DeleteApiKeyResponse> => {
  try {
    DeleteApiKeySchema.parse({
      teamId,
      apiKeyId,
    });

    const { user } = await checkAuthenticated();

    const isAuthorized = await checkUserTeamAuthorization(user.id, teamId);

    if (!isAuthorized)
      throw new Error("Not authorized to delete team api keys");

    const { error } = await supabaseAdmin
      .from("team_api_keys")
      .delete()
      .eq("team_id", teamId)
      .eq("id", apiKeyId);

    if (error) throw error;

    return {
      success: true,
    };
  } catch (e) {
    console.error("delete-api-key-action:", e);
    throw e;
  }
};
