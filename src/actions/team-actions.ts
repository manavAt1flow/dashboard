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
import { User } from "@supabase/supabase-js";

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

function memberDTO(user: User) {
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name,
    avatar_url: user.user_metadata?.avatar_url,
  };
}

type GetTeamMembersResponse = {
  user: ReturnType<typeof memberDTO>;
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
      user: memberDTO(user),
      relation: data.find((userTeam) => userTeam.user_id === user.id)!,
    }));
}

export async function removeTeamMemberAction(teamId: string, userId: string) {
  const { user } = await checkAuthenticated();

  const isAuthorized = await checkUserTeamAuthorization(user.id, teamId);

  if (!isAuthorized) {
    throw new Error("User is not authorized to remove team members");
  }

  const { data: teamMemberData, error: teamMemberError } = await supabaseAdmin
    .from("users_teams")
    .select("*")
    .eq("team_id", teamId)
    .eq("user_id", userId);

  if (teamMemberError || !teamMemberData || teamMemberData.length === 0) {
    throw new Error("User is not a member of this team");
  }

  const teamMember = teamMemberData[0];

  if (teamMember.user_id !== user.id && teamMember.is_default) {
    throw new Error("Cannot remove a default team member");
  }

  const { count, error: countError } = await supabaseAdmin
    .from("users_teams")
    .select("*", { count: "exact", head: true })
    .eq("team_id", teamId);

  if (countError) {
    throw new Error(countError.message);
  }

  if (count === 1) {
    throw new Error("Cannot remove the last team member");
  }

  const { error: removeError } = await supabaseAdmin
    .from("users_teams")
    .delete()
    .eq("team_id", teamId)
    .eq("user_id", userId);

  if (removeError) {
    throw new Error(removeError.message);
  }
}
