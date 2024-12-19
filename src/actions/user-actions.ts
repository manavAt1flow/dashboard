"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { Database } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import checkAuthenticated from "./utils";
import { z } from "zod";
import { headers } from "next/headers";

interface GetUserResponse {
  user: User;
  accessToken: Database["public"]["Tables"]["access_tokens"]["Row"];
}

export async function getUserAction(): Promise<GetUserResponse> {
  const { user } = await checkAuthenticated();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: accessToken, error } = await supabaseAdmin
    .from("access_tokens")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    user,
    accessToken,
  };
}

const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  name: z.string().min(1).optional(),
});

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;

interface UpdateUserResponse {
  newUser: User;
}

export async function updateUserAction(
  data: UpdateUserSchemaType,
): Promise<UpdateUserResponse> {
  const parsedData = UpdateUserSchema.safeParse(data);

  if (!parsedData.success) {
    console.error(parsedData.error);
    throw new Error("Invalid data");
  }

  const { supabase } = await checkAuthenticated();

  const origin = (await headers()).get("origin");

  const { data: updateData, error } = await supabase.auth.updateUser(
    {
      email: data.email,
      password: data.password,
      data: {
        name: data.name,
      },
    },
    {
      emailRedirectTo: `${origin}/api/auth/email-callback?new_email=${data.email}`,
    },
  );

  if (error) {
    throw error;
  }

  return {
    newUser: updateData.user,
  };
}
