import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Topbar from "@/components/dashboard/topbar/topbar";
import ClientProviders from "@/components/globals/client-providers";
import { getBaseUrl } from "@/lib/utils";
import { InitResponse } from "@/types/dashboard";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/dashboard/init`, {
      method: "GET",
      headers: {
        Cookie: (await cookies()).toString(),
      },
      cache: "force-cache",
    });

    const data: InitResponse = await res.json();

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
