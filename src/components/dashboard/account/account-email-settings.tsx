"use client";

import { updateUserAction } from "@/actions/user-actions";
import { AuthFormMessage } from "@/components/auth/auth-form-message";
import ChangeDataInput from "@/components/globals/change-data-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTimeoutMessage } from "@/hooks/use-timeout-message";
import { useUser } from "@/hooks/use-user";
import { AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTransition } from "react";
import { z } from "zod";

export function EmailSettings() {
  const { user, setUser, refetch: refetchUser } = useUser();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState(
    searchParams.get("new_email") || user?.email || "",
  );
  const [message, setMessage] = useTimeoutMessage();

  const handleUpdateEmail = async () => {
    if (!z.string().email().safeParse(email).success) {
      setMessage({ error: "Invalid email" });
      return;
    }

    startTransition(async () => {
      try {
        await updateUserAction({ email });
        setMessage({ success: "Check your email for a verification link" });
      } catch (error: any) {
        setMessage({ error: error.message });
      }
    });
  };

  useEffect(() => {
    if (
      !searchParams.has("success") &&
      !searchParams.has("error") &&
      !searchParams.has("type")
    )
      return;

    if (searchParams.get("type") === "update_email") {
      if (searchParams.has("success")) {
        if (searchParams.has("new_email")) {
          setUser((state) => ({
            ...state!,
            email: searchParams.get("new_email")!,
          }));
        }

        setMessage({
          success: decodeURIComponent(searchParams.get("success")!),
        });

        refetchUser();
      } else {
        setMessage({
          error: decodeURIComponent(searchParams.get("error")!),
        });
      }
    }
  }, [searchParams]);

  if (!user) return null;

  return (
    <Card hideUnderline>
      <CardHeader>
        <CardTitle>Your Email</CardTitle>
        <CardDescription>
          Change your email to receive notifications and updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateEmail();
          }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder="Email"
            className="w-[17rem]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            loading={isPending}
            disabled={email === user?.email}
            type="submit"
          >
            Save Email
          </Button>
        </form>

        <AnimatePresence initial={false} mode="wait">
          {message && <AuthFormMessage message={message} className="mt-4" />}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
