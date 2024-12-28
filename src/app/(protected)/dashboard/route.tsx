import { checkAuthenticated } from "@/actions/utils";
import { PROTECTED_URLS } from "@/configs/urls";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { user } = await checkAuthenticated();

  const { data: teamsData, error: teamsError } = await supabaseAdmin
    .from("users_teams")
    .select(`*`)
    .eq("user_id", user.id);

  if (teamsError) {
    return redirect(PROTECTED_URLS.NEW_TEAM);
  }

  const teamId =
    teamsData.find((data) => data.is_default)?.team_id ?? teamsData[0].team_id;

  if (!teamId) {
    return redirect(PROTECTED_URLS.NEW_TEAM);
  }

  return redirect(PROTECTED_URLS.SANDBOXES(teamId));
};
