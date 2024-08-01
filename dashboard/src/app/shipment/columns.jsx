"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table/column-header";
import { ColumnAction } from "./column-actions";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="County" />
    ),
    size: 300,
  },
  {
    accessorKey: "shipmentLocation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shipment Locations" />
    ),
    cell: ({ row }) => {
      const locations = row.original;

      return locations.shipmentLocation.length;
    },
    size: 200,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const county = row.original;

      return <ColumnAction county={county} />;
    },
    size: 20,
  },
];
