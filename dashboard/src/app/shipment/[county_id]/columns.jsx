"use client";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import { Eye } from "lucide-react";
import Link from "next/link";

export const columns = [
  {
    accessorKey: "name",
    size: "100%",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub-county" />
    ),
  },
  {
    accessorKey: "shipment_areas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wards" />
    ),
    cell: ({ row }) => {
      const sub_county = row.original;

      return sub_county._count.shipment_areas;
    },
  },

  {
    id: "actions",
    size: 70,
    cell: ({ row }) => {
      const sub_county = row.original;

      return (
        <Button variant="outline" asChild>
          <Link
            href={`/shipment/${sub_county.countyId}/${sub_county.id}`}
            className="cursor-pointer flex items-center"
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>View</span>
          </Link>
        </Button>
      );
    },
    // size: 20,
  },
];
