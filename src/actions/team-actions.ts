"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

interface ErrorResponse {
  type: "error";
  data: {
    message: string;
  };
}

interface GetUserTeamsResponse {
  type: "success";
  data: {
    teams: Database["public"]["Tables"]["teams"]["Row"][];
    defaultTeamId: string;
  };
}

export async function getUserTeams(): Promise<
  GetUserTeamsResponse | ErrorResponse
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      type: "error",
      data: {
        message: "User not found",
      },
    };
  }

  const { data, error } = await supabaseAdmin
    .from("users_teams")
    .select("*, teams (*)")
    .eq("user_id", user.id);

  if (error) {
    return {
      type: "error",
      data: {
        message: error.message,
      },
    };
  }

  if (!data) {
    return {
      type: "error",
      data: {
        message: "No user teams found",
      },
    };
  }

  const defaultTeamId = data.find((userTeam) => userTeam.is_default)?.team_id;

  if (!defaultTeamId) {
    return {
      type: "error",
      data: {
        message: "No default team found",
      },
    };
  }

  return {
    type: "success",
    data: {
      teams: data.flatMap((userTeam) => userTeam.teams!),
      defaultTeamId,
    },
  };
}
