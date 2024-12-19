"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";
import {
  checkAuthenticated,
  checkUserTeamAuthorization,
  getTeamApiKey,
} from "./utils";

interface GetUserTeamsResponse {
  teams: Database["public"]["Tables"]["teams"]["Row"][];
  defaultTeamId: string;
}

export async function getUserTeamsAction(): Promise<GetUserTeamsResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data, error } = await supabaseAdmin
    .from("users_teams")
    .select("*, teams (*)")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No user teams found");
  }

  const defaultTeamId = data.find((userTeam) => userTeam.is_default)?.team_id;

  if (!defaultTeamId) {
    throw new Error("No default team found");
  }

  return {
    teams: data.flatMap((userTeam) => userTeam.teams!),
    defaultTeamId,
  };
}

export async function updateTeamNameAction(teamId: string, name: string) {
  const { user } = await checkAuthenticated();

  const isAuthorized = await checkUserTeamAuthorization(user.id, teamId);

  if (!isAuthorized) {
    throw new Error("User is not authorized to update this team");
  }

  const { data, error } = await supabaseAdmin
    .from("teams")
    .update({ name })
    .eq("id", teamId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function addTeamMemberAction(teamId: string, email: string) {
  const { user } = await checkAuthenticated();

  const isAuthorized = await checkUserTeamAuthorization(user.id, teamId);

  if (!isAuthorized) {
    throw new Error("User is not authorized to add a team member");
  }
}
