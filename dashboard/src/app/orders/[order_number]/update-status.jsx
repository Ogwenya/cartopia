"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Combobox } from "@/components/ui/combobox";
import SubmitButton from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";

const UpdateStatus = ({ order_status, order_number, access_token }) => {
  const status_array = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "CANCELED",
    "COMPLETED",
  ];

  const { toast } = useToast();
  const router = useRouter();

  const [status, set_status] = useState(order_status);
  const [loading, set_loading] = useState(false);

  const reset_state = () => {
    set_status(order_status);
  };

  const update_status = async () => {
    if (status !== order_status) {
      try {
        set_loading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/orders/${order_number}`,
          {
            method: "PATCH",
            body: JSON.stringify({ status }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          },
        );

        const result = await res.json();

        set_loading(false);

        if (result.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: Array.isArray(result.message)
              ? result.message[0]
              : result.message,
          });
        } else {
          toast({
            variant: "success",
            title: "Success",
            description: result.message,
          });

          router.refresh();
        }
      } catch (error) {
        set_loading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="inline-flex gap-2">
      <div className="[&>button]:h-8 w-48">
        <Combobox
          entries={status_array.map((status) => {
            return { value: status, label: status };
          })}
          value={status}
          items_name="status"
          setValue={set_status}
        />
      </div>

      <SubmitButton size="sm" loading={loading} onClick={update_status}>
        Update Status
      </SubmitButton>
      <Button variant="outline" size="sm" onClick={reset_state}>
        Cancel Update
      </Button>
    </div>
  );
};

export default UpdateStatus;
