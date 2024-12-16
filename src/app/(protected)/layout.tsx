import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Topbar from "@/components/dashboard/topbar/topbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* const supabase = await createClient();

  if (!supabase.auth.getSession()) {
    return redirect("/sign-in");
  } */

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
