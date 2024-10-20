"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import AppHeader from "./app-header";
import AppFooter from "./app-footer";

export default function AppLayout({ totalCartItems, children }) {
  return (
    <SessionProvider>
      <AppHeader totalCartItems={totalCartItems} />
      <main className="max-w-9xl mx-auto px-1 sm:px-2 md:px-8 mt-4 bg-secondary">
        {children}
      </main>
      <AppFooter />
      <Toaster />
    </SessionProvider>
  );
}
