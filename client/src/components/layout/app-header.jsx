"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { MapPin, User } from "lucide-react";
import { ReaderIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AppHeader = () => {
  const { status, data: session, update: updateSession } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 border-b border-slate-900/10 bg-white/95 supports-backdrop-blur:bg-white/60">
      <nav className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between gap-x-8 py-4 lg:px-8 lg:border-0 mx-4 lg:mx-0">
          <Link className="overflow-hidden w-auto" href="/">
            <div className="flex items-center w-auto">
              <img src="/images/logo.svg" className="h-8" alt="Cartopia Logo" />
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/shop/cart">
              <div className="relative">
                <svg
                  className="w-7 h-7 text-primary"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1"
                  />
                </svg>
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2">
                  0
                </div>
              </div>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="focus-visible:ring-0">
                  <User className="h-5 w-5 mr-3" />
                  <span>
                    {session
                      ? `${session.user.firstname} ${session.user.lastname}`
                      : "Account"}
                  </span>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {session ? (
                  <>
                    <DropdownMenuItem>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/profile" className="flex items-center">
                        <ReaderIcon className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/profile" className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Address Book</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <Button className="w-full" variant="destructive">
                        Logout
                      </Button>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link
                        href="/auth/login"
                        className="flex items-center w-full"
                      >
                        <Button className="w-full" variant="outline">
                          Login
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="/auth/signup"
                        className="flex items-center w-full"
                      >
                        <Button className="w-full">Sign up</Button>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
