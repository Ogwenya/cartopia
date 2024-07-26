"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DollarSign,
  Image,
  LayoutDashboard,
  Package,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const SidebarItem = ({ item, role }) => {
  const pathname = usePathname();

  const LinkItem = () => {
    return (
      <Link
        href={item.url}
        className={`flex items-center justify-between rounded-lg hover:bg-primary hover:text-primary-foreground ${
          pathname === item.url && "bg-primary text-primary-foreground"
        }  px-3 py-2 transition-all`}
      >
        <span className="flex items-center gap-3">
          <item.icon className="h-4 w-4" />
          {item.name}
        </span>
        {item.notification > 0 && <span className="">{item.notification}</span>}
      </Link>
    );
  };

  return (
    <>
      {item.super_user_route ? (
        role === "SUPER_USER" && <LinkItem />
      ) : (
        <LinkItem />
      )}
    </>
  );
};

const AppSidebar = ({ screen, user }) => {
  const sidebar_items = [
    { name: "Dashboard", url: "/", icon: LayoutDashboard },
    {
      group: true,
      group_name: "Shop",
      items: [
        { name: "Products", url: "/products", icon: ShoppingCart },
        { name: "Categories", url: "/categories", icon: Package },
        { name: "Brands", url: "/brands", icon: ShoppingBasket },
        { name: "Orders", url: "/orders", icon: ShoppingBag },
        { name: "Shipment Fees", url: "/shipment", icon: DollarSign },
        { name: "Transactions", url: "/transactions", icon: Wallet },
        { name: "Campaign Images", url: "/campaign-images", icon: Image },
      ],
    },
    {
      group: true,
      group_name: "Settings",
      items: [
        {
          name: "Users",
          url: "/users",
          icon: Users,
          super_user_route: true,
        },
      ],
    },
  ];

  return (
    <ScrollArea
      className={`${
        screen === "large" && "hidden lg:block border-r"
      } h-screen overflow-y-scroll`}
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img
              src="/images/logo-icon.png"
              alt="Cartopia logo"
              className="h-6 w-6"
            />
            <span className="">Cartopia</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid gap-1 items-start px-2 text-sm font-medium lg:px-4">
            {sidebar_items.map((item) =>
              item.group ? (
                <div className="my-3" key={item.group_name}>
                  <p className="text-xs font-medium uppercase text-zinc-400 px-3 py-1">
                    {item.group_name}
                  </p>
                  {item.items.map((group_items) => (
                    <SidebarItem
                      item={group_items}
                      key={group_items.name}
                      role={user.role}
                    />
                  ))}
                </div>
              ) : (
                <SidebarItem item={item} key={item.name} role={user.role} />
              )
            )}
          </nav>
        </div>
      </div>
    </ScrollArea>
  );
};

export default AppSidebar;
