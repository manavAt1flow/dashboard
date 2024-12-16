import { signInAction } from "@/actions/auth-actions";
import {
  AuthFormMessage,
  AuthMessage,
} from "@/components/auth/auth-form-message";
import { OAuthProviders } from "@/components/auth/oauth-provider-buttons";
import TextSeparator from "@/components/globals/text-separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function Login(props: {
  searchParams: Promise<AuthMessage>;
}) {
  const searchParam = await props.searchParams;

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-fg-300 leading-6">
        Don't have an account?{" "}
        <Link className="text-fg font-medium underline" href="/auth/sign-up">
          Sign up
        </Link>
      </p>

      <OAuthProviders />

      <TextSeparator text="or" />

      <form className="flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs underline underline-offset-[3px]"
            href="/auth/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <Button formAction={signInAction}>Sign in</Button>
      </form>

      <AuthFormMessage className="mt-4" message={searchParam} />
    </div>
  );
}
