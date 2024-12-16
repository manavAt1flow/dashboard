"use client";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOutAction } from "@/actions/auth-actions";
import { useUser } from "@/hooks/use-user";

export default function UserAvatar() {
  const { data: user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="iconSm" className="min-w-8" variant="muted">
          <Avatar className="w-full h-full">
            <AvatarImage src={user?.user_metadata.avatar_url} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => signOutAction()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
