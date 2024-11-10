"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import AppHeader from "./app-header";
import AppFooter from "./app-footer";

export default function AppLayout({ totalCartItems = 0, children }) {
  return (
    <SessionProvider>
      <AppHeader totalCartItems={totalCartItems} />
      <main className="max-w-9xl mx-auto lg:px-3">{children}</main>
      <AppFooter />
      <Toaster />
    </SessionProvider>
  );
}
