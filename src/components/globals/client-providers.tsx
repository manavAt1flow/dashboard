"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "../providers/user-provider";
import { TeamsProvider } from "../providers/teams-provider";
import { MetadataProvider } from "../providers/metadata-provider";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { InitResponse } from "@/types/dashboard";

interface ClientProvidersProps {
  children: React.ReactNode;
  initialData?: InitResponse;
}

/**
 * ClientProviders handles the setup and initialization of client-side providers
 * while supporting server-side rendered (SSR) data hydration.
 *
 * This component wraps the application with necessary providers:
 * - QueryClientProvider: Manages React Query state and cache
 * - UserProvider: Handles user authentication and data
 * - TeamsProvider: Manages teams-related state
 * - MetadataProvider: Manages metadata-related state
 */
export default function ClientProviders({
  children,
  initialData,
}: ClientProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  const defaultTeamId = initialData?.teams?.find((t) => t.is_default)?.id;

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider initialUser={initialData?.user}>
        <TeamsProvider initialTeams={initialData?.teams}>
          <MetadataProvider initialTeamId={defaultTeamId}>
            {children}
          </MetadataProvider>
        </TeamsProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
