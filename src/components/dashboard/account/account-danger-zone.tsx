"use client";

import { signOutAction } from "@/actions/auth-actions";
import { deleteAccountAction } from "@/actions/user-actions";
import { AuthFormMessage } from "@/components/auth/auth-form-message";
import { AlertDialog } from "@/components/globals/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTimeoutMessage } from "@/hooks/use-timeout-message";
import { useTransition } from "react";
import { useState } from "react";
import { AnimatePresence } from "motion/react";

export function DangerZone() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const [message, setMessage] = useTimeoutMessage();

  const handleDeleteAccount = async () => {
    startTransition(async () => {
      try {
        await deleteAccountAction();
        toast({
          title: "Account deleted",
          description: "You have been signed out",
        });
        await signOutAction();
      } catch (error: any) {
        setMessage({ error: error.message });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>
          Delete your account and all associated data.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AlertDialog
          trigger={<Button variant="error">Delete Account</Button>}
          title="Delete Account"
          description={
            <>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </>
          }
          confirm="Delete Account"
          onConfirm={handleDeleteAccount}
          confirmProps={{
            disabled: deleteConfirmation !== "delete my account",
            loading: isPending,
          }}
        >
          <>
            <p className="mb-4 text-fg-500">
              Please type{" "}
              <span className="font-medium text-fg">delete my account</span> to
              confirm:
            </p>
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type 'delete my account' to confirm"
            />
          </>
        </AlertDialog>
        <AnimatePresence initial={false} mode="wait">
          {message && <AuthFormMessage className="mt-4" message={message} />}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
