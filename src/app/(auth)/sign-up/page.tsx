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
import { Separator } from "@/components/ui/separator";
import TextSeparator from "@/components/global/text-separator";

export default async function Signup(props: {
  searchParams: Promise<AuthMessage>;
}) {
  const searchParam = await props.searchParams;

  return (
    <div className="flex flex-col w-full ">
      <h1 className="text-2xl font-medium">Sign up</h1>

      <p className="text-sm text-fg-300 leading-6">
        Already have an account?{" "}
        <Link className="text-fg font-medium underline" href="/sign-in">
          Sign in
        </Link>
      </p>

      <OAuthProviders />

      <TextSeparator text="or" />

      <form className="flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          minLength={6}
          required
        />
        <Button formAction={signUpAction}>Sign up</Button>
      </form>

      <AuthFormMessage className="mt-4" message={searchParam} />
    </div>
  );
}
