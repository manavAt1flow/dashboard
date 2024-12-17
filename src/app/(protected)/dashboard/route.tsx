import { AUTH_URLS, PROTECTED_URLS } from "@/configs/urls";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return redirect(AUTH_URLS.SIGN_IN);
  }

  const { data: teamsData, error: teamsError } = await supabaseAdmin
    .from("users_teams")
    .select(
      `
      teams (*)
    `
    )
    .eq("user_id", user.id)
    .single();

  if (teamsError || !teamsData?.teams) {
    return redirect(AUTH_URLS.SIGN_IN);
  }

  return redirect(`${PROTECTED_URLS.DASHBOARD}/${teamsData.teams.id}`);
};
