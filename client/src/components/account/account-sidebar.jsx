"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import sidebar_items from "./sidebar-items";

export function LargeScreenSidebar() {
  const pathname = usePathname();
  return (
    <Card className="min-w-[280px] lg:min-w-[300px] py-4">
      <CardContent>
        {sidebar_items.map((item, index) => (
          <Link
            key={index}
            href={`/account${item.link}`}
            className={`flex items-center justify-between rounded-lg hover:bg-primary hover:text-primary-foreground ${
              pathname === `/account${item.link}` &&
              "bg-primary text-primary-foreground"
            }  px-3 py-2 transition-all`}
          >
            <span className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              {item.label}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export function SmallScreenSidebar() {
  const pathname = usePathname();

  return (
    <div>
      {pathname !== "/account" && (
        <div className=" flex items-center justify-between space-x-4 rounded-md bg-card border p-4 mb-4">
          <Link href="/account">
            <ArrowLeft />
          </Link>

          <span className="text-sm">
            {
              sidebar_items.filter(
                (item) => item.link === pathname.replace("/account", ""),
              )[0]?.label
            }
          </span>
        </div>
      )}
    </div>
  );
}
