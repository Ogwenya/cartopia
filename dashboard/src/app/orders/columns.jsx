"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { badge_color } from "@/lib/order-status-color";
import format_currency from "@/lib/format-currency";
import format_date from "@/lib/format_date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";

export const columns = [
  {
    accessorKey: "order_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Number" />
    ),
    // size: 300,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const customer = row.original.customer;

      return `${customer.firstname} ${customer.lastname}`;
    },
    // size: 50,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      const order = row.original;

      return format_currency(order.amount + order.shipment_fee);
    },
    size: 20,
  },
  {
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Items" />
    ),
    cell: ({ row }) => {
      const items = row.original.items;

      return items.length;
    },
    size: 20,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge className={cn("w-fit", badge_color(status))}>{status}</Badge>
      );
    },
    // size: 50,
  },
  {
    accessorKey: "shippingAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const shippingAddress = row.original.shippingAddress;

      return `${shippingAddress.county.name} county`;
    },
    // size: 50,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Date" />
    ),
    cell: ({ row }) => {
      const created_at = row.original.created_at;

      return format_date(created_at, true);
    },
    size: 300,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const order_number = row.original.order_number;

      return (
        <Link href={`/orders/${order_number}`}>
          <Button variant="outline" className="h-8 w-8 p-1.5 text-primary">
            <Eye />
          </Button>
        </Link>
      );
    },
    size: 10,
  },
];
