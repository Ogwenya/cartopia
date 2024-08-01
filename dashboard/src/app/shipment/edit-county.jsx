"use client";

import { useState } from "react";
import { AlertCircle, SquarePen } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SubmitButton from "@/components/ui/submit-button";
import revalidate_data from "@/app/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const EditCountyModal = ({ county, set_modal_open, access_token }) => {
  console.log(county);

  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState(null);
  const [name, set_name] = useState(county.name);

  const edit_county = async () => {
    try {
      set_error(null);
      set_loading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/shipment/${county.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name }),
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
    <>
      <DialogTrigger asChild>
        <span className="flex items-center px-2 py-1.5 text-sm rounded-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer">
          <SquarePen className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit County</DialogTitle>
          <DialogDescription>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 gap-y-8 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => set_name(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <SubmitButton
            loading={loading}
            onClick={edit_county}
            className="w-full"
          >
            Edit County
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </>
  );
};

export default EditCountyModal;
