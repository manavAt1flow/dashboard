import { encodedRedirect } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");
  const message = requestUrl.searchParams.get("message");
  const next = "/dashboard/account";

  if (message) {
    return redirect(`${next}?message=${message}`);
  }

  if (!token_hash || !type || type !== "email_change") {
    return encodedRedirect("error", next, "Invalid email verification link");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: token_hash as string,
    type: type as EmailOtpType,
  });

  if (error) {
    return encodedRedirect("error", next, error.message);
  }

  return encodedRedirect("success", next, "Email changed successfully");
}
