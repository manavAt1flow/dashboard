import { forgotPasswordAction } from "@/actions/auth-actions";
import {
  AuthFormMessage,
  AuthMessage,
} from "@/components/auth/auth-form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<AuthMessage>;
}) {
  const searchParam = await props.searchParams;

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-medium">Reset Password</h1>
      <p className="text-sm text-fg-300 leading-6">
        Already have an account?{" "}
        <Link className="text-fg font-medium underline" href="/sign-in">
          Sign in
        </Link>
      </p>

      <form className="flex flex-col gap-2 [&>input]:mb-1 mt-5">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <Button formAction={forgotPasswordAction}>Reset Password</Button>
      </form>

      <AuthFormMessage className="mt-4" message={searchParam} />
    </div>
  );
}
