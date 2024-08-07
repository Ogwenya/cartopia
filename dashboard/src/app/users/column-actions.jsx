"use client";

import { useState } from "react";
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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditUserModal } from "./edit-user";
import DeleteUserModal from "./delete-user";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function DataTableActionColumn({ user }) {
  const { data: session } = useSession();
  const [modal_open, set_modal_open] = useState(false);
  const [active_modal, set_active_modal] = useState(null);

  return (
    <>
      {user.id !== session?.user.id && (
        <AlertDialog>
          <Dialog open={modal_open} onOpenChange={set_modal_open}>
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
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => set_active_modal("edit-user")}
                  >
                    <SquarePen className="mr-2 h-4 w-4" />
                    <span>Edit User</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => set_active_modal("delete-user")}
                  >
                    <AlertDialogTrigger asChild>
                      <span className="flex items-center">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete User</span>
                      </span>
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            {active_modal === "edit-user" && (
              <EditUserModal
                user={user}
                set_modal_open={set_modal_open}
                access_token={session.access_token}
              />
            )}
            {active_modal === "delete-user" && (
              <DeleteUserModal
                user={user}
                set_modal_open={set_modal_open}
                access_token={session.access_token}
              />
            )}
          </Dialog>
        </AlertDialog>
      )}
    </>
  );
}
