"use client";

import { updateUserAction } from "@/actions/user-actions";
import { AuthFormMessage } from "@/components/auth/auth-form-message";
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
import { useTransition } from "react";
import { useState } from "react";
import { z } from "zod";

export function NameSettings() {
  const { user, refetch: refetchUser } = useUser();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState<string>(user?.user_metadata?.name || "");
  const [message, setMessage] = useTimeoutMessage();

  const handleUpdateName = async () => {
    if (!z.string().min(1).safeParse(name).success) {
      setMessage({ error: "Name cannot be empty" });
      return;
    }

    startTransition(async () => {
      try {
        await updateUserAction({ name });
        await refetchUser();
        setMessage({ success: "Name updated successfully" });
      } catch (error: any) {
        setMessage({ error: error.message });
      }
    });
  };

  return (
    <Card hideUnderline>
      <CardHeader>
        <CardTitle>Your Name</CardTitle>
        <CardDescription>Will be visible to your team members.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateName();
          }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder="Name"
            className="w-[17rem]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            loading={isPending}
            disabled={name === user?.user_metadata?.name}
            type="submit"
          >
            Save Name
          </Button>
        </form>

        <AnimatePresence initial={false} mode="wait">
          {message && <AuthFormMessage message={message} className="mt-4" />}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
