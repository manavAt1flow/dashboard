import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Topbar from "@/components/dashboard/topbar/topbar";
import { redirect } from "next/navigation";
import ClientProviders from "@/components/globals/client-providers";
import { getUser } from "@/actions/user-actions";
import { getUserTeams } from "@/actions/team-actions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { type, data } = await getUser();

  if (type === "error") {
    return redirect("/auth/sign-in");
  }

  const { type: teamsType, data: teamsData } = await getUserTeams();

  return (
    <ClientProviders
      initialUserData={data}
      initialTeamsData={teamsType === "success" ? teamsData : undefined}
    >
      <div className="flex flex-col h-[100dvh]">
        <Topbar />
        <div className="flex h-full">
          <Sidebar />
          {children}
        </div>
      </div>
    </ClientProviders>
  );
}
