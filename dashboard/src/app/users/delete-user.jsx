"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SubmitButton from "@/components/ui/submit-button";
import revalidate_data from "../actions";

const DeleteUserModal = ({ user, set_modal_open, access_token }) => {
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState(null);

  const delete_user = async () => {
    try {
      set_error(null);
      set_loading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/users/${user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const result = await res.json();

      set_loading(false);

      if (result.error) {
        set_error(
          Array.isArray(result.message) ? result.message[0] : result.message
        );
      } else {
        revalidate_data("users");
        set_error(null);
        set_modal_open(false);
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm user deletion.</AlertDialogTitle>
        <AlertDialogDescription>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </AlertDialogDescription>
        <AlertDialogDescription>
          <span>
            This action cannot be undone. This will permanently delete the user{" "}
            <span className="font-bold">
              &lsquo;{user.firstname} {user.lastname}&rsquo;
            </span>{" "}
            from the database.
          </span>
          <span className="mt-3">
            You can <span className="font-bold">deactivate</span> the user if
            you do not intend to permanently remove the account.
          </span>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>

        <SubmitButton
          variant="destructive"
          loading={loading}
          onClick={delete_user}
        >
          Delete User
        </SubmitButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteUserModal;
