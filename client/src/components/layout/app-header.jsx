"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { MapPin, User, ShoppingCart } from "lucide-react";
import { ReaderIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from "../search-bar";

const AppHeader = ({ totalCartItems }) => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 bg-white/95 supports-backdrop-blur:bg-white/60">
      <nav className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-x-8 gap-y-3 py-4 lg:px-8 lg:border-0 mx-4 lg:mx-0">
          <Link className="overflow-hidden w-auto" href="/">
            <div className="flex items-center w-auto">
              <img
                src="/images/logo.svg"
                className="h-6 md:h-8"
                alt="Cartopia Logo"
              />
            </div>
          </Link>

          <div className="md:flex-1 max-md:order-last max-md:block max-md:w-full">
            <SearchBar />
          </div>

          <div className="flex items-center gap-6">
            {/*cart icon*/}
            <Link href="/cart">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-4 -right-4">
                  {totalCartItems}
                </div>
              </div>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="focus-visible:ring-0">
                  <User className="h-5 w-5 mr-3" />
                  <span className="max-md:hidden">
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
                      <Link href="/account" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Account</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="/account/orders"
                        className="flex items-center"
                      >
                        <ReaderIcon className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="/account/addresses"
                        className="flex items-center"
                      >
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
