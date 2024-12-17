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
import { Skeleton } from "../ui/skeleton";
import { useUser } from "../providers/user-provider";

export default function UserAvatar() {
  const { data } = useUser();

  if (!data) return <Skeleton className="w-8 h-8" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="iconSm" className="min-w-8" variant="muted">
          <Avatar className="w-full h-full">
            <AvatarImage src={data.user?.user_metadata.avatar_url} />
            <AvatarFallback>
              {data.user?.email?.charAt(0).toUpperCase() || "?"}
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
