import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Topbar from "@/components/dashboard/topbar/topbar";
import { redirect } from "next/navigation";
import ClientProviders from "@/components/globals/client-providers";
import { getUser } from "@/actions/user-actions";
import { getUserTeams } from "@/actions/team-actions";
import { AUTH_URLS } from "@/configs/urls";
import GridPattern from "@/components/ui/grid-pattern";
import { cache } from "react";
import { UserData } from "@/components/providers/user-provider";
import { TeamsData } from "@/components/providers/teams-provider";

const getCachedUser = cache(async () => {
  const { type, data } = await getUser();
  return { type, data };
});

const getCachedUserTeams = cache(async () => {
  const { type, data } = await getUserTeams();
  return { type, data };
});

// we use cached data for the user + user details and teams

export const dynamic = "force-dynamic";
export const revalidate = 60;
export const fetchCache = "force-cache";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userResponse, teamsResponse] = await Promise.all([
    getCachedUser(),
    getCachedUserTeams(),
  ]);

  if (userResponse.type === "error") {
    return redirect(AUTH_URLS.SIGN_IN);
  }

  return (
    <ClientProviders
      initialUserData={userResponse.data as UserData}
      initialTeamsData={
        teamsResponse.type === "success"
          ? (teamsResponse.data as TeamsData)
          : undefined
      }
    >
      <div className="flex flex-col h-[100dvh]">
        <Topbar />
        <div className="flex h-full gap-2">
          <Sidebar />
          <div className="flex-1 pl-2 pr-4 pb-4">
            <div className="bg-bg-100 h-full w-full relative border-2 border-dashed border-border">
              <GridPattern
                gradientFrom="hsl(var(--bg-100))"
                gradientTo="hsl(var(--bg-100))"
                gradientVia="hsl(var(--bg-100))"
                strokeDasharray="4"
                x={4}
                y={4}
              />
              {children}
            </div>
          </div>
        </div>
      </div>
    </ClientProviders>
  );
}
