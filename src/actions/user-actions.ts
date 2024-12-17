"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";
import { User } from "@supabase/supabase-js";

interface ErrorResponse {
  type: "error";
  data: {
    message: string;
  };
}

interface GetUserResponse {
  type: "success";
  data: {
    user: User;
    accessToken: Database["public"]["Tables"]["access_tokens"]["Row"];
  };
}

export async function getUser(): Promise<GetUserResponse | ErrorResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      type: "error",
      data: {
        message: "User not authenticated",
      },
    };
  }

  const { data: accessToken, error } = await supabaseAdmin
    .from("access_tokens")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    return {
      type: "error",
      data: {
        message: error.message,
      },
    };
  }

  return {
    type: "success",
    data: {
      user,
      accessToken,
    },
  };
}
