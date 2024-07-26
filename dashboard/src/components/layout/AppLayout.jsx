"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import AppHeader from "./Header";
import AppSidebar from "./Sidebar";

export default function AppLayout({ session, messages, children }) {
  return (
    <SessionProvider>
      <div
        className={`grid min-h-screen w-full ${
          session && "lg:grid-cols-[280px_1fr]"
        }`}
      >
        {session && (
          <AppSidebar screen="large" user={session} messages={messages} />
        )}

        <div className="flex flex-col h-screen overflow-y-scroll">
          {session && <AppHeader user={session} messages={messages} />}

          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
            <Toaster />
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
