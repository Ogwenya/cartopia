"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import UpdateFees from "./update-fees";

export const columns = [
  {
    accessorKey: "name",
    size: "100%",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ward" />
    ),
  },
  {
    accessorKey: "fees",
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
      const ward = row.original;

      return (
        <div className="flex justify-end gap-2">
          <UpdateFees ward={ward} />
        </div>
      );
    },
    // size: 20,
  },
];
