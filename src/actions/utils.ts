"use server";

import { createClient } from "@/lib/supabase/server";

/*
 *  This function checks if the user is authenticated and returns the user and the supabase client.
 *  If the user is not authenticated, it throws an error.
 */
export default async function checkAuthenticated() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return { user, supabase };
}
