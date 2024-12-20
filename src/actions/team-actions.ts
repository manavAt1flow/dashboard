"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";
import {
  checkAuthenticated,
  checkUserTeamAuthorization,
  getTeamApiKey,
} from "./utils";
import { z } from "zod";
import { headers } from "next/headers";

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
  if (!z.string().email().safeParse(email).success) {
    throw new Error("Invalid email address");
  }

  const { user } = await checkAuthenticated();

  const isAuthorized = await checkUserTeamAuthorization(user.id, teamId);

  if (!isAuthorized) {
    throw new Error("User is not authorized to add a team member");
  }

  const { data: existingUsers, error: userError } = await supabaseAdmin
    .from("auth_users")
    .select("*")
    .eq("email", email);

  if (userError) {
    throw new Error(userError.message);
  }

  const existingUser = existingUsers?.[0];

  const origin = (await headers()).get("origin");

  // check if user exists / is already a member of the team

  if (!existingUser) {
    throw new Error(
      "User with this email does not exist. Account must be registered first.",
    );
  }

  const { data: existingTeamMember } = await supabaseAdmin
    .from("users_teams")
    .select("*")
    .eq("team_id", teamId)
    .eq("user_id", existingUser.id!)
    .single();

  if (existingTeamMember) {
    throw new Error("User is already a member of this team");
  }

  const { error: insertError } = await supabaseAdmin
    .from("users_teams")
    .insert({
      team_id: teamId,
      user_id: existingUser.id!,
      added_by: user.id,
    });

  if (insertError) {
    throw new Error(insertError.message);
  }
}

type GetTeamMembersResponse = {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  relation: Database["public"]["Tables"]["users_teams"]["Row"];
}[];

export async function getTeamMembersAction(
  teamId: string,
): Promise<GetTeamMembersResponse> {
  const { user } = await checkAuthenticated();

  const isAuthorized = await checkUserTeamAuthorization(user.id, teamId);

  if (!isAuthorized) {
    throw new Error("User is not authorized to get team members");
  }

  const { data, error } = await supabaseAdmin
    .from("users_teams")
    .select("*")
    .eq("team_id", teamId);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return [];
  }

  const userResponses = await Promise.all(
    data.map(
      async (userTeam) =>
        (await supabaseAdmin.auth.admin.getUserById(userTeam.user_id)).data
          .user,
    ),
  );

  return userResponses
    .filter((user) => user !== null)
    .map((user) => ({
      user: {
        id: user.id,
        // email should be defined based on our login methods
        email: user.email!,
        name: user.user_metadata?.name,
      },
      relation: data.find((userTeam) => userTeam.user_id === user.id)!,
    }));
}
