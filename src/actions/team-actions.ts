"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

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
