"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MetadataProvider } from "../providers/metadata-provider";
import { useState } from "react";
import { InitResponse } from "@/types/dashboard";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MetadataProvider>{children}</MetadataProvider>
    </QueryClientProvider>
  );
}
