import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";
import { UnauthenticatedError, UnauthorizedError } from "@/types/errors";

/*
 *  This function checks if the user is authenticated and returns the user and the supabase client.
 *  If the user is not authenticated, it throws an error.
 *
 *  @params request - an optional NextRequest object to create a supabase client for route handlers
 */
export async function checkAuthenticated() {
  const supabase = await createClient();

  // retrieve session from storage medium (cookies)
  // if no stored session found, not authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw UnauthenticatedError();
  }

  // now retrieve user from supabase to use further
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw UnauthenticatedError();
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
    throw userTeamsRelationError;
  }

  if (!userTeamsRelationData) {
    throw UnauthorizedError(
      `User is not a member of team (user: ${userId}, team: ${teamId})`,
    );
  }

  const { data: teamApiKeyData, error: teamApiKeyError } = await supabaseAdmin
    .from("team_api_keys")
    .select("*")
    .eq("team_id", teamId);

  if (teamApiKeyError) {
    console.error(teamApiKeyError);
    throw new Error(
      `Failed to fetch team API key for team (user: ${userId}, team: ${teamId})`,
    );
  }

  if (!teamApiKeyData || teamApiKeyData.length === 0) {
    throw new Error(
      `No team API key found for team (user: ${userId}, team: ${teamId})`,
    );
  }

  return teamApiKeyData[0].api_key;
}

// TODO: we should probably add some team permission system here

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

/*
 *  This function masks an API key by showing only the first and last 4 characters,
 *  replacing the middle characters with dots (•).
 *  Returns the masked API key string.
 */
export function maskApiKey(
  apiKey: Database["public"]["Tables"]["team_api_keys"]["Row"],
) {
  const firstFour = apiKey.api_key.slice(0, 6);
  const lastFour = apiKey.api_key.slice(-4);
  const dots = "...";

  return `${firstFour}${dots}${lastFour}`;
}
