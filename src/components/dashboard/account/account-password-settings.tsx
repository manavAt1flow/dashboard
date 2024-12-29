"use client";

import { forgotPasswordAction } from "@/actions/auth-actions";
import { AuthFormMessage } from "@/components/auth/auth-form-message";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTimeoutMessage } from "@/hooks/use-timeout-message";
import { useUser } from "@/hooks/use-user";
import { AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function PasswordSettings() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [message, setMessage] = useTimeoutMessage();

  useEffect(() => {
    if (
      !searchParams.has("success") &&
      !searchParams.has("error") &&
      !searchParams.has("type")
    )
      return;

    if (searchParams.get("type") === "reset_password") {
      setMessage(
        searchParams.has("success")
          ? {
              success: decodeURIComponent(searchParams.get("success")!),
            }
          : {
              error: decodeURIComponent(searchParams.get("error")!),
            },
      );
    }
  }, [searchParams]);

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Password</CardTitle>
        <CardDescription>
          Change your account password used to sign in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          variant="muted"
          onClick={() => {
            if (!user?.email) return;

            const formData = new FormData();
            formData.set("email", user.email);
            formData.set("callbackUrl", "/dashboard/account");

            forgotPasswordAction(formData);
          }}
        >
          Change Password
        </Button>
        <AnimatePresence initial={false} mode="wait">
          {message && <AuthFormMessage className="mt-4" message={message} />}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
