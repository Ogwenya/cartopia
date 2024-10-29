"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="County" />
    ),
    size: 300,
  },
  {
    accessorKey: "shipmentTowns",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub-counties" />
    ),
    cell: ({ row }) => {
      const locations = row.original;

      return locations.shipmentTowns.length;
    },
    size: 200,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const county = row.original;

      return (
        <Button variant="outline" asChild>
          <Link
            href={`/shipment/${county.id}`}
            className="cursor-pointer flex items-center"
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>View</span>
          </Link>
        </Button>
      );
    },
    size: 20,
  },
];
