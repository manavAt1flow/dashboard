import { checkAuthenticated } from "@/actions/utils";
import UserMenu from "@/components/auth/user-menu";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import TeamSelector from "@/components/dashboard/team-selector";
import ClientProviders from "@/components/globals/client-providers";
import { ThemeSwitcher } from "@/components/globals/theme-switcher";
import { Button } from "@/components/ui/button";
import { PROTECTED_URLS } from "@/configs/urls";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { InitResponse } from "@/types/dashboard";
import { Database } from "@/types/supabase";
import { HeartPulse } from "lucide-react";
import { redirect } from "next/navigation";

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
 * Gets the initial data for protected dashboard routes.
 *
 * @user: The user object.
 * @teams: The teams the user is a member of + if it's the default team.
 */
async function getInitialData(): Promise<InitResponse> {
  const { user } = await checkAuthenticated();

  const { data: usersTeamsData, error } = await supabaseAdmin
    .from("users_teams")
    .select("*, teams (*)")
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  if (!usersTeamsData || usersTeamsData.length === 0) {
    redirect(PROTECTED_URLS.DASHBOARD);
  }

  return {
    user,
    teams: transformTeamsData(usersTeamsData),
  };
}

export const fetchCache = "force-cache";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const data = await getInitialData();

    return (
      <ClientProviders initialData={data}>
        <div className="flex h-[100dvh] flex-col gap-2">
          <div className="flex h-full max-h-full gap-4 overflow-hidden p-4">
            <aside className="flex w-56 flex-col gap-2">
              <DashboardNav />
              <TeamSelector />
              <div className="flex items-center gap-2 pr-2">
                <UserMenu />
                <Button size="sm">Upgrade</Button>
                <ThemeSwitcher />
                <Button variant="ghost" size="icon" className="size-8">
                  <HeartPulse className="h-4 w-4 text-fg-300" />
                </Button>
              </div>
            </aside>
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </ClientProviders>
    );
  } catch (error) {
    console.error("(protected)/layout.tsx:", error);
    throw error;
  }
}
