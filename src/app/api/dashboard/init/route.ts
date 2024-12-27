import { NextRequest, NextResponse } from "next/server";
import { checkAuthenticated } from "@/actions/utils";
import { E2BError } from "@/types/errors";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { InitResponse } from "@/types/dashboard";
import { Database } from "@/types/supabase";

function transformTeamsData(
  data: (Database["public"]["Tables"]["users_teams"]["Row"] & {
    teams: Database["public"]["Tables"]["teams"]["Row"];
  })[],
): InitResponse["teams"] {
  return data.map((userTeam) => {
    const team = userTeam.teams;
    return { ...team, is_default: userTeam.is_default };
  });
}

/*
 * This route is used to fetch the user's teams and user data.
 * It is cached until its invalidated or the page is reloaded.
 *
 * see @/app/(protected)/dashboard/layout.tsx
 */
export const GET = async (req: NextRequest) => {
  try {
    const { user } = await checkAuthenticated();

    const { data, error } = await supabaseAdmin
      .from("users_teams")
      .select("*, teams (*)")
      .eq("user_id", user.id);

    if (error) {
      console.error("Database error fetching user teams:", {
        error,
        userId: user.id,
      });
      return NextResponse.json(
        { message: "Failed to fetch user teams" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      user,
      teams: transformTeamsData(data),
    } satisfies InitResponse);
  } catch (error) {
    if (error instanceof E2BError && error.code === "UNAUTHENTICATED") {
      console.warn("Unauthenticated access attempt:", { error });
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    console.error("Unexpected error in dashboard init:", { error });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
