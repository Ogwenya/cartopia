"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteProductModal from "./delete-product";

export function ColumnAction({ product }) {
  const { status, data: session } = useSession();
  const [modal_open, set_modal_open] = useState(false);

  return (
    <AlertDialog open={modal_open} onOpenChange={set_modal_open}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/products/${product.slug}`}>
              <SquarePen className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <span className="flex items-center">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </span>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteProductModal
        product={product}
        set_modal_open={set_modal_open}
        access_token={session?.access_token}
      />
    </AlertDialog>
  );
}
