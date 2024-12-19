"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

/*
 *  This function checks if the user is authenticated and returns the user and the supabase client.
 *  If the user is not authenticated, it throws an error.
 */
export async function checkAuthenticated() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return { user, supabase };
}

/*
 *  This function fetches a team API key for a given user and team.
 *  If the user is not a member of the team, it throws an error.
 */
export async function getTeamApiKey(userId: string, teamId: string) {
  const { data: userTeamsRelationData, error: userTeamsRelationError } =
    await supabaseAdmin
      .from("users_teams")
      .select("*")
      .eq("user_id", userId)
      .eq("team_id", teamId)
      .single();

  if (userTeamsRelationError) {
    throw new Error(
      `Failed to fetch user teams relation (user: ${userId}, team: ${teamId})`,
    );
  }

  if (!userTeamsRelationData) {
    throw new Error(
      `User is not a member of team (user: ${userId}, team: ${teamId})`,
    );
  }

  const { data: teamApiKeyData, error: teamApiKeyError } = await supabaseAdmin
    .from("team_api_keys")
    .select("*")
    .eq("team_id", teamId)
    .single();

  if (teamApiKeyError) {
    throw new Error(
      `Failed to fetch team API key for team (user: ${userId}, team: ${teamId})`,
    );
  }

  if (!teamApiKeyData) {
    throw new Error(
      `No team API key found for team (user: ${userId}, team: ${teamId})`,
    );
  }

  return teamApiKeyData.api_key;
}

/*
 *  This function checks if a user is authorized to access a team.
 *  If the user is not authorized, it returns false.
 */
export async function checkUserTeamAuthorization(
  userId: string,
  teamId: string,
) {
  const { data: userTeamsRelationData, error: userTeamsRelationError } =
    await supabaseAdmin
      .from("users_teams")
      .select("*")
      .eq("user_id", userId)
      .eq("team_id", teamId)
      .single();

  if (userTeamsRelationError) {
    throw new Error(
      `Failed to fetch users_teams relation (user: ${userId}, team: ${teamId})`,
    );
  }

  return !!userTeamsRelationData;
}
