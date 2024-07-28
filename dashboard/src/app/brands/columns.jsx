"use client";

import { useSession } from "next-auth/react";
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import EditBrand from "./edit-brand";
import DeleteBrand from "./delete-brand";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    size: 300,
  },
  {
    accessorKey: "products",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Products" />
    ),
    cell: ({ row }) => {
      const brand = row.original;

      return brand.products.length;
    },
    size: 200,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const brand = row.original;

      return (
        <div className="flex gap-2">
          <EditBrand brand={brand} />

          {brand.products.length === 0 && <DeleteBrand brand={brand} />}
        </div>
      );
    },
    size: 50,
  },
];
