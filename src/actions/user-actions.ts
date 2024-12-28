"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { User } from "@supabase/supabase-js";
import { checkAuthenticated } from "./utils";
import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/dashboard/[teamId]", "layout");

  return {
    newUser: updateData.user,
  };
}

interface DeleteAccountResponse {
  deleted: boolean;
}

export const deleteAccountAction = async (): Promise<DeleteAccountResponse> => {
  try {
    const { user } = await checkAuthenticated();

    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) {
      throw error;
    }

    return {
      deleted: true,
    };
  } catch (e) {
    console.error("delete-account-action:", e);

    throw new Error("Failed to delete account");
  }
};
