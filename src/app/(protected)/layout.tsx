import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Topbar from "@/components/dashboard/topbar/topbar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  if (!supabase.auth.getSession()) {
    return redirect("/auth/sign-in");
  }

  return (
    <div className="flex flex-col h-[100dvh]">
      <Topbar />
      <div className="flex h-full">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
