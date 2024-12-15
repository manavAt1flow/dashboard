import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  if (!supabase.auth.getSession()) {
    return redirect("/sign-in");
  }

  return <>{children}</>;
}
