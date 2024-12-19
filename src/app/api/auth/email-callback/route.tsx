import { encodedRedirect } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const message = requestUrl.searchParams.get("message");
  const newEmail = requestUrl.searchParams.get("new_email");
  const code = requestUrl.searchParams.get("code");

  const next = "/dashboard/account";

  if (!code && !message) {
    encodedRedirect("error", next, "Invalid email verification link");
  }

  if (message) {
    redirect(`${next}?message=${message}`);
  }

  encodedRedirect("success", next, "Email changed successfully", {
    new_email: newEmail || "",
  });
}
