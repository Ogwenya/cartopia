"use client";

import format_currency from "@/lib/format-currency";
import format_date from "@/lib/format_date";
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";

export const columns = [
  {
    accessorKey: "reference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference" />
    ),
    // size: 300,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;

      return format_currency(amount);
    },
    size: 20,
  },
  {
    accessorKey: "channel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Channel" />
    ),
  },
  {
    accessorKey: "order",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
    cell: ({ row }) => {
      const order = row.original.order;

      return order ? order.order_number : "Deleted Order";
    },
    // size: 50,
  },

  {
    accessorKey: "transaction_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const transaction_time = row.original.transaction_time;

      return format_date(transaction_time);
    },
    // size: 50,
  },
];
