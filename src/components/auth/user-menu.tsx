"use client";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOutAction } from "@/actions/auth-actions";
import { useUser } from "../providers/user-provider";
import Link from "next/link";
import { PROTECTED_URLS } from "@/configs/urls";
import UserDetailsTile from "./user-details-tile";

export default function UserMenu() {
  const { data } = useUser();

  if (!data) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="iconSm" className="min-w-8" variant="ghost">
          <Avatar className="h-full w-full">
            <AvatarImage src={data.user?.user_metadata.avatar_url} />
            <AvatarFallback>
              {data.user?.email?.charAt(0).toUpperCase() || "?"}
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
