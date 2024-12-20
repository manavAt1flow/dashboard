import { signUpAction } from "@/actions/auth-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OAuthProviders } from "@/components/auth/oauth-provider-buttons";
import {
  AuthFormMessage,
  AuthMessage,
} from "@/components/auth/auth-form-message";
import TextSeparator from "@/components/globals/text-separator";

export default async function Signup(props: {
  searchParams: Promise<AuthMessage>;
}) {
  const searchParam = await props.searchParams;

  return (
    <div className="flex w-full flex-col">
      <h1 className="text-2xl font-medium">Sign up</h1>

      <p className="text-sm leading-6 text-fg-300">
        Already have an account?{" "}
        <Link className="font-medium text-fg underline" href="/auth/sign-in">
          Sign in
        </Link>
      </p>

      <OAuthProviders />

      <TextSeparator text="or" />

      <form className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          placeholder="you@example.com"
          required
          className="mb-3"
          autoComplete="off"
        />
        <Label htmlFor="password">Password</Label>
        <div className="mb-3 space-y-3">
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
            autoComplete="new-password"
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            minLength={6}
            required
            autoComplete="new-password"
          />
        </div>
        <Button formAction={signUpAction}>Sign up</Button>
      </form>

      <AuthFormMessage className="mt-4" message={searchParam} />
    </div>
  );
}
