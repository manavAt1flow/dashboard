"use client";

import { updateUserAction } from "@/actions/user-actions";
import ChangeDataInput from "@/components/globals/change-data-input";
import { UserData, useUser } from "@/components/providers/user-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAttributes } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export default function AccountPage() {
  const { data, setData } = useUser();

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: updateUserAction,
    onSuccess: (result) => {
      setData((state) => ({ ...state!, user: result.newUser }));
    },
  });

  const [name, setName] = useState<string>(
    data?.user?.user_metadata?.name || ""
  );
  const [nameError, setNameError] = useState<string | null>(null);

  const [email, setEmail] = useState(data?.user?.email || "");
  const [emailError, setEmailError] = useState<string | null>(null);

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Account</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Name</CardTitle>
          <CardDescription>
            Change your name to display on your invoices and receipts.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ChangeDataInput
            placeholder="Name"
            className="max-w-[25rem]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            hasChanges={name !== data.user?.user_metadata?.name}
            onSave={() => {
              setNameError(null);

              if (!z.string().min(1).safeParse(name).success) {
                setNameError("Name cannot be empty");
                return;
              }

              mutate({ name });
            }}
            isLoading={isPending}
          />

          {nameError && (
            <Alert
              variant="error"
              className="border-l-4 animate-in slide-in-from-bottom-1"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{nameError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
