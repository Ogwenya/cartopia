"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import UpdateLocation from "./update-location";
import DeleteLocation from "./delete-location";

export const columns = [
  {
    accessorKey: "name",
    size: "100%",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
  },
  {
    accessorKey: "fees",
    size: 250,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fees" />
    ),
    cell: ({ row }) => {
      const fees = parseFloat(row.getValue("fees"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KES",
      }).format(fees);

      return formatted;
    },
  },

  {
    id: "actions",
    size: 70,
    cell: ({ row }) => {
      const location = row.original;

      return (
        <div className="flex justify-end gap-2">
          <UpdateLocation location={location} />

          <DeleteLocation location={location} />
        </div>
      );
    },
    // size: 20,
  },
];
