"use client";

import Sidebar from "@/components/dashboard/sidebar";
import ClientProviders from "@/components/globals/client-providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <div className="flex h-[100dvh] flex-col gap-2">
        <div className="flex h-full max-h-full gap-4 overflow-hidden p-4">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ClientProviders>
  );
}
