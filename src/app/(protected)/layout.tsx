import Topbar from "@/components/dashboard/topbar/topbar";
import { redirect } from "next/navigation";
import ClientProviders from "@/components/globals/client-providers";
import { getUserAction } from "@/actions/user-actions";
import { getUserTeamsAction } from "@/actions/team-actions";
import { AUTH_URLS } from "@/configs/urls";

export const fetchCache = "force-cache";
export const revalidate = 300;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const [userResponse, teamsResponse] = await Promise.all([
      getUserAction(),
      getUserTeamsAction(),
    ]);

    return (
      <ClientProviders
        initialUserData={userResponse}
        initialTeamsData={teamsResponse}
      >
        <div className="flex h-[100dvh] flex-col">
          <Topbar />
          {children}
        </div>
      </ClientProviders>
    );
  } catch (error) {
    console.error("(protected)/layout.tsx:", error);

    // TODO: replace with proper error codes that can be configured somewhere

    if (
      error instanceof Error &&
      ["User not found", "User not authenticated"].includes(error.message)
    ) {
      return redirect(AUTH_URLS.SIGN_IN);
    }

    throw error;
  }
}
