"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SubmitButton from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";

const DeleteOrder = ({ order_number, access_token }) => {
  const router = useRouter();

  const [modal_open, set_modal_open] = useState(false);
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState(null);

  const delete_order = async () => {
    try {
      set_error(null);
      set_loading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/orders/${order_number}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      const result = await res.json();

      set_loading(false);

      if (result.error) {
        set_error(
          Array.isArray(result.message) ? result.message[0] : result.message,
        );
      } else {
        set_error(null);
        set_modal_open(false);
        router.push("/orders");
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <AlertDialog open={modal_open} onOpenChange={set_modal_open}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Order deletion.</AlertDialogTitle>
          <AlertDialogDescription>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </AlertDialogDescription>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the order{" "}
            <span className="font-bold">{order_number}</span> from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <SubmitButton
            variant="destructive"
            loading={loading}
            onClick={delete_order}
          >
            Delete Order
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteOrder;
