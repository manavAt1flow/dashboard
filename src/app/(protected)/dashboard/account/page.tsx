"use client";

import { updateUserAction } from "@/actions/user-actions";
import {
  AuthFormMessage,
  AuthMessage,
} from "@/components/auth/auth-form-message";
import ChangeDataInput from "@/components/globals/change-data-input";
import { useUser } from "@/components/providers/user-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction } from "@/actions/auth-actions";

export default function AccountPage() {
  const { data, setData } = useUser();
  const searchParams = useSearchParams();

  const router = useRouter();

  const { mutate: mutateName, isPending: isPendingName } = useMutation({
    mutationKey: ["updateUserName"],
    mutationFn: (name: string) => updateUserAction({ name }),
    onSuccess: (result) => {
      setData((state) => ({ ...state!, user: result.newUser }));
      setNameMessage({ success: "Name updated successfully" });
    },
    onError: (error) => {
      setNameMessage({ error: error.message });
    },
  });

  const { mutate: mutateEmail, isPending: isPendingEmail } = useMutation({
    mutationKey: ["updateUserEmail"],
    mutationFn: (email: string) =>
      updateUserAction({ email }, document.location.origin),
    onSuccess: (result) => {
      setData((state) => ({ ...state!, user: result.newUser }));
      setEmailMessage({ success: "Check your email for a verification link" });
    },
    onError: (error) => {
      setEmailMessage({ error: error.message });
    },
  });

  const [name, setName] = useState<string>(
    data?.user?.user_metadata?.name || "",
  );
  const [nameMessage, setNameMessage] = useState<AuthMessage | null>(null);

  const [email, setEmail] = useState(
    searchParams.get("new_email") || data?.user?.email || "",
  );
  const [emailMessage, setEmailMessage] = useState<AuthMessage | null>(null);

  const [passwordMessage, setPasswordMessage] = useState<AuthMessage | null>(
    null,
  );

  // email redirect message handler
  useEffect(() => {
    if (!searchParams.has("success") && !searchParams.has("error")) return;

    if (searchParams.has("success")) {
      if (searchParams.has("new_email")) {
        setData((state) => ({
          ...state!,
          user: { ...state!.user!, email: searchParams.get("new_email")! },
        }));
      }

      setEmailMessage({
        success: decodeURIComponent(searchParams.get("success") || ""),
      });
    } else if (searchParams.has("error")) {
      setEmailMessage({
        error: decodeURIComponent(searchParams.get("error") || ""),
      });
    }
  }, [searchParams]);

  // timeouts to clear messages after 5 seconds
  useEffect(() => {
    if (!nameMessage) return;

    const timeout = setTimeout(() => {
      setNameMessage(null);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [nameMessage]);

  useEffect(() => {
    if (!emailMessage) return;

    const timeout = setTimeout(() => {
      setEmailMessage(null);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [emailMessage]);

  useEffect(() => {
    if (!passwordMessage) return;

    const timeout = setTimeout(() => {
      setPasswordMessage(null);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [passwordMessage]);

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Account</h1>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Your Name</CardTitle>
          <CardDescription>
            Change your name to display on your invoices and receipts.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ChangeDataInput
            placeholder="Name"
            className="w-[17rem]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            hasChanges={name !== data.user?.user_metadata?.name}
            onSave={() => {
              setNameMessage(null);

              if (!z.string().min(1).safeParse(name).success) {
                setNameMessage({ error: "Name cannot be empty" });
                return;
              }

              mutateName(name);
            }}
            isLoading={isPendingName}
          />

          {nameMessage && (
            <AuthFormMessage message={nameMessage} className="mt-4" />
          )}
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Your Email</CardTitle>
          <CardDescription>
            Change your email to receive notifications and updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ChangeDataInput
            placeholder="Email"
            className="w-[25rem]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hasChanges={email !== data.user?.email}
            onSave={() => {
              setEmailMessage(null);

              if (!z.string().email().safeParse(email).success) {
                setEmailMessage({ error: "Invalid email" });
                return;
              }

              mutateEmail(email);
            }}
            isLoading={isPendingEmail}
          />

          {emailMessage && (
            <AuthFormMessage message={emailMessage} className="mt-4" />
          )}
        </CardContent>
      </Card>

      {data.user?.app_metadata?.providers?.includes("email") && (
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Your Password</CardTitle>
              <CardDescription>
                Change your account password used to sign in.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                forgotPasswordAction(new FormData());
              }}
            >
              Reset Password
            </Button>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
