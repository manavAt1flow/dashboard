"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserData, UserProvider } from "../providers/user-provider";
import { TeamsData, TeamsProvider } from "../providers/teams-provider";
import { MetadataProvider } from "../providers/metadata-provider";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

interface ClientProvidersProps {
  children: React.ReactNode;
  initialUserData?: UserData;
  initialTeamsData?: TeamsData;
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
  initialUserData,
  initialTeamsData,
}: ClientProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider initialUserData={initialUserData}>
        <TeamsProvider initialTeamsData={initialTeamsData}>
          <MetadataProvider initialTeamId={initialTeamsData?.defaultTeamId}>
            {children}
          </MetadataProvider>
        </TeamsProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
