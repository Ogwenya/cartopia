"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import AppHeader from "./app-header";
import AppFooter from "./app-footer";

export default function AppLayout({ children }) {
  return (
    <SessionProvider>
      <AppHeader />
      <div className="max-w-9xl mx-auto px-1 sm:px-2 md:px-8 bg-secondary">
        {children}
      </div>
      <AppFooter />
      <Toaster />
    </SessionProvider>
  );
}
