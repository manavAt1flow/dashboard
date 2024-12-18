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
import { useParams } from "next/navigation";

export default function UserAvatar() {
  const { teamId } = useParams();
  const { data } = useUser();

  if (!data) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="iconSm" className="min-w-8" variant="ghost">
          <Avatar className="w-full h-full">
            <AvatarImage src={data.user?.user_metadata.avatar_url} />
            <AvatarFallback>
              {data.user?.email?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>General</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/${teamId}/settings/account`}>Account</Link>
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
