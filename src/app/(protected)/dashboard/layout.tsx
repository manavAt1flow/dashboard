"use client";

import Sidebar from "@/components/dashboard/sidebar";
import ClientProviders from "@/components/globals/client-providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <div className="mx-auto flex h-[100dvh] w-full flex-col gap-2">
        <div className="flex h-full max-h-full gap-4 overflow-hidden">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ClientProviders>
  );
}
