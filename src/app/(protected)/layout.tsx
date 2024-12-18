import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Topbar from "@/components/dashboard/topbar/topbar";
import { redirect } from "next/navigation";
import ClientProviders from "@/components/globals/client-providers";
import { getUser } from "@/actions/user-actions";
import { getUserTeams } from "@/actions/team-actions";
import { AUTH_URLS } from "@/configs/urls";
import { Card } from "@/components/ui/card";
import GridPattern from "@/components/ui/grid-pattern";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { type, data } = await getUser();

  if (type === "error") {
    return redirect(AUTH_URLS.SIGN_IN);
  }

  const { type: teamsType, data: teamsData } = await getUserTeams();

  return (
    <ClientProviders
      initialUserData={data}
      initialTeamsData={teamsType === "success" ? teamsData : undefined}
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
