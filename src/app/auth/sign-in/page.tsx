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
import { AUTH_URLS } from "@/configs/urls";
import Link from "next/link";

export default async function Login(props: {
  searchParams: Promise<AuthMessage>;
}) {
  const searchParam = await props.searchParams;

  return (
    <div className="flex w-full flex-col">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm leading-6 text-fg-300">
        Don&apos;t have an account?{" "}
        <Link
          className="font-medium text-fg underline"
          href={AUTH_URLS.SIGN_UP}
        >
          Sign up
        </Link>
      </p>

      <OAuthProviders />

      <TextSeparator text="or" />

      <form className="flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs underline underline-offset-[3px]"
            href={AUTH_URLS.FORGOT_PASSWORD}
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
