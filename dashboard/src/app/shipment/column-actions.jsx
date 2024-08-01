"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
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
import { Dialog } from "@/components/ui/dialog";
import DeleteCountyModal from "./delete-county";
import EditCountyModal from "./edit-county";

export function ColumnAction({ county }) {
  const { data: session } = useSession();
  const [modal_open, set_modal_open] = useState(false);

  return (
    <AlertDialog open={modal_open} onOpenChange={set_modal_open}>
      <Dialog>
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
              <Link href={`/shipment/${county.id}`} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                <span>View</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <EditCountyModal
                county={county}
                set_modal_open={set_modal_open}
                access_token={session?.access_token}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <span className="flex items-center cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </span>
              </AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DeleteCountyModal
          county={county}
          set_modal_open={set_modal_open}
          access_token={session?.access_token}
        />
      </Dialog>
    </AlertDialog>
  );
}
