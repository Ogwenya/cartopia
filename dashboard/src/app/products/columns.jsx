"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { ColumnAction } from "./column-actions";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    size: 300,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KES",
      }).format(price);

      return formatted;
    },
    size: 20,
  },
  {
    accessorKey: "discount_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" />
    ),
    cell: ({ row }) => {
      const discount_type = row.original.discount_type;
      const discount_value = parseFloat(row.getValue("discount_value"));

      const formatted =
        discount_type === "Percentage"
          ? `${discount_value}%`
          : new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "KES",
            }).format(discount_value);

      return formatted;
    },
    size: 50,
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" />
    ),
    cell: ({ row }) => {
      const brand = row.getValue("brand");

      return brand.name;
    },
    size: 100,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category");

      return category.name;
    },
    size: 70,
  },
  {
    accessorKey: "in_stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),

    size: 70,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Status" />
    ),
    cell: ({ row }) => {
      const product_status = row.getValue("status");

      return (
        <Badge
          variant={product_status === "ACTIVE" ? "success" : "destructive"}
        >
          {product_status}
        </Badge>
      );
    },
    size: 100,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return <ColumnAction product={product} />;
    },
    size: 10,
  },
];
