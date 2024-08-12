"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import AppHeader from "./app-header";
import AppFooter from "./app-footer";

export default function AppLayout({ children }) {
  return (
    <SessionProvider>
      <AppHeader />
      <div className="max-w-9xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
      <AppFooter />
      <Toaster />
    </SessionProvider>
  );
}
