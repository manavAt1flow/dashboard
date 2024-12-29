"use client";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOutAction } from "@/actions/auth-actions";
import Link from "next/link";
import { PROTECTED_URLS } from "@/configs/urls";
import UserDetailsTile from "./user-details-tile";
import { useUser } from "@/hooks/use-user";

export default function UserMenu() {
  const { data: user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="iconSm" className="min-w-8" variant="ghost">
          <Avatar className="h-full w-full">
            <AvatarImage src={user?.user_metadata.avatar_url} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[15rem]">
        <DropdownMenuItem asChild className="p-1">
          <Link href={PROTECTED_URLS.ACCOUNT_SETTINGS}>
            <UserDetailsTile />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-error"
          onClick={() => signOutAction()}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
