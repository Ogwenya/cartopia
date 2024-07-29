"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import EditCategory from "./edit-category";
import DeleteCategory from "./delete-category";

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
      const category = row.original;

      return category.products.length;
    },
    size: 200,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex gap-2">
          <EditCategory category={category} />

          {category.products.length === 0 && (
            <DeleteCategory category={category} />
          )}
        </div>
      );
    },
    size: 50,
  },
];
