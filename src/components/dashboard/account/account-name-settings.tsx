"use client";

import { updateUserAction } from "@/actions/user-actions";
import { AuthFormMessage } from "@/components/auth/auth-form-message";
import ChangeDataInput from "@/components/globals/change-data-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        setMessage({ success: "Name updated successfully" });
        await refetchUser();
      } catch (error: any) {
        setMessage({ error: error.message });
      }
    });
  };

  if (!user) return null;

  return (
    <Card hideUnderline>
      <CardHeader>
        <CardTitle>Your Name</CardTitle>
        <CardDescription>Will be visible to your team members.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ChangeDataInput
          placeholder="Name"
          className="w-[17rem]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          hasChanges={name !== user?.user_metadata?.name}
          onSave={handleUpdateName}
          isLoading={isPending}
        />

        <AnimatePresence initial={false} mode="wait">
          {message && <AuthFormMessage message={message} className="mt-4" />}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
