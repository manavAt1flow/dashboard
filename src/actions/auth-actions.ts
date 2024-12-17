"use server";

import { encodedRedirect } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Provider } from "@supabase/supabase-js";
import { AUTH_URLS, PROTECTED_URLS } from "@/configs/urls";

export const signInWithOAuth = async (provider: Provider) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${origin}${AUTH_URLS.CALLBACK}`,
      scopes: "email",
    },
  });

  if (error) {
    return encodedRedirect("error", AUTH_URLS.SIGN_IN, error.message);
  }

  if (data.url) {
    return redirect(data.url);
  }

  return encodedRedirect("error", AUTH_URLS.SIGN_IN, "Something went wrong");
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      AUTH_URLS.SIGN_UP,
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}${AUTH_URLS.CALLBACK}`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", AUTH_URLS.SIGN_UP, error.message);
  } else {
    return encodedRedirect(
      "success",
      AUTH_URLS.SIGN_UP,
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", AUTH_URLS.SIGN_IN, error.message);
  }

  return redirect(PROTECTED_URLS.DASHBOARD);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect(
      "error",
      AUTH_URLS.FORGOT_PASSWORD,
      "Email is required"
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}${AUTH_URLS.CALLBACK}?redirect_to=${AUTH_URLS.RESET_PASSWORD}`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      AUTH_URLS.FORGOT_PASSWORD,
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    AUTH_URLS.FORGOT_PASSWORD,
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      AUTH_URLS.RESET_PASSWORD,
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      AUTH_URLS.RESET_PASSWORD,
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      AUTH_URLS.RESET_PASSWORD,
      "Password update failed"
    );
  }

  encodedRedirect("success", AUTH_URLS.RESET_PASSWORD, "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return redirect(AUTH_URLS.SIGN_IN);
};
