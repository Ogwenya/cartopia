"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertCircle, PenBox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SubmitButton from "@/components/ui/submit-button";

const UpdateFees = ({ ward }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, set_loading] = useState(false);
  const [fees, set_fees] = useState(ward.fees);
  const [error, set_error] = useState(null);
  const [modal_open, set_modal_open] = useState(false);

  const update_location = async () => {
    set_error(null);
    if (!fees) {
      set_error("Provide shipment fees.");
      return;
    }

    try {
      set_loading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/shipment/wards/${ward.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ fees }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      const result = await res.json();

      set_loading(false);

      if (result.error) {
        set_error(
          Array.isArray(result.message) ? result.message[0] : result.message,
        );
      } else {
        set_fees("");
        set_error(null);
        set_modal_open(false);
        router.refresh();
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <Dialog open={modal_open} onOpenChange={set_modal_open}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PenBox className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Shipment Ward</DialogTitle>
          <DialogDescription>
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <span> Edditing Shipment Fees for {ward.name}.</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <Label htmlFor="fees">Fees</Label>
          <Input
            id="fees"
            type="number"
            value={fees}
            onChange={(e) => set_fees(parseFloat(e.target.value))}
            disabled={loading}
            required
          />
        </div>
        <DialogFooter>
          <SubmitButton
            loading={loading}
            onClick={update_location}
            className="w-full"
          >
            Save Changes
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFees;
