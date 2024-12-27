import { checkAuthenticated } from "@/actions/utils";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Topbar from "@/components/dashboard/topbar/topbar";
import ClientProviders from "@/components/globals/client-providers";
import { PROTECTED_URLS } from "@/configs/urls";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { InitResponse } from "@/types/dashboard";
import { Database } from "@/types/supabase";
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
        <div className="flex h-[100dvh] flex-col">
          <Topbar />
          <main className="flex h-full gap-2 overflow-hidden">
            <Sidebar />
            <div className="flex-1 pb-4 pl-2 pr-4">
              <div className="relative h-full max-h-full w-full overflow-y-auto">
                <div className="mx-auto max-w-5xl py-12">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </ClientProviders>
    );
  } catch (error) {
    console.error("(protected)/layout.tsx:", error);

    throw error;
  }
}
