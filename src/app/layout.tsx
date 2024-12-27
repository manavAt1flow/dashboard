import { RootProvider } from "fumadocs-ui/provider";
import { Body } from "./layout.client";

import "@/app/_fonts/fonts";

import "@/styles/globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { BASE_URL } from "@/configs/urls";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Body>
        <RootProvider
          theme={{
            attribute: "class",
            defaultTheme: "system",
            enableSystem: true,
            disableTransitionOnChange: true,
          }}
        >
          <ToastProvider>
            {children}
            <Toaster />
          </ToastProvider>
        </RootProvider>
      </Body>
    </html>
  );
}
