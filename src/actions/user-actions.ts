"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";
import { User, UserAttributes } from "@supabase/supabase-js";
import checkAuthenticated from "./utils";

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
  try {
    const { user } = await checkAuthenticated();

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
  } catch (error) {
    console.error("get-user-action:", error);

    if (error instanceof Error) {
      return {
        type: "error",
        data: {
          message: error.message,
        },
      };
    }

    return {
      type: "error",
      data: {
        message: "An unknown error occurred",
      },
    };
  }
}

interface UpdateUserResponse {
  type: "success";
  data: {
    newUser: User;
  };
}

export async function updateUser(
  data: UserAttributes
): Promise<UpdateUserResponse | ErrorResponse> {
  // TODO: validate data

  try {
    const { supabase } = await checkAuthenticated();

    const { data: updateData, error } = await supabase.auth.updateUser({
      data,
    });

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
        newUser: updateData.user,
      },
    };
  } catch (error) {
    console.error("update-user-action:", error);

    if (error instanceof Error) {
      return {
        type: "error",
        data: {
          message: error.message,
        },
      };
    }

    return {
      type: "error",
      data: {
        message: "An unknown error occurred",
      },
    };
  }
}
