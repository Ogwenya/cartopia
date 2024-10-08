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
import revalidate_data from "@/app/actions";

const DeleteCountyModal = ({ county, set_modal_open, access_token }) => {
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState(null);

  const delete_county = async () => {
    try {
      set_error(null);
      set_loading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/shipment/${county.id}`,
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
        revalidate_data("shipment");
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
        <AlertDialogTitle>Confirm county deletion.</AlertDialogTitle>
        <AlertDialogDescription>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </AlertDialogDescription>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the county
          and all shippment locations in the county{" "}
          <span className="font-bold">&lsquo;{county.name}&rsquo;</span> from
          the database.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>

        <SubmitButton
          variant="destructive"
          loading={loading}
          onClick={delete_county}
        >
          Delete County
        </SubmitButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteCountyModal;
