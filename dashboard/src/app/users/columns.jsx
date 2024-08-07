"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { DataTableActionColumn } from "./column-actions";

export const columns = [
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Firstname" />
    ),
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lastname" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role");
      const formatted = role === "SUPER_USER" ? "Administrator" : "Staff";

      return <div>{formatted}</div>;
    },
    size: 70,
  },

  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("is_active");

      const formatted = status ? "Active" : "Deactivated";

      return (
        <Badge variant={status ? "success" : "destructive"}>{formatted}</Badge>
      );
    },
    size: 50,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return <DataTableActionColumn user={user} />;
    },
    size: 20,
  },
];
