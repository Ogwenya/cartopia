"use client";

import { useState } from "react";
import { AlertCircle, Plus } from "lucide-react";
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
import revalidate_data from "@/app/actions";

const AddBrand = ({ access_token }) => {
  const [name, set_name] = useState("");
  const [image, set_image] = useState(null);
  const [error, set_error] = useState(null);
  const [loading, set_loading] = useState(false);
  const [modal_open, set_modal_open] = useState(false);

  const add_brand = async () => {
    set_error(null);

    if (!name || !image) {
      set_error("Provide brand name and image.");
      return;
    }

    if (!image.type.startsWith("image/")) {
      set_error("Upload a valid image.");

      return;
    }

    try {
      set_loading(true);

      const data = new FormData();
      data.append("image", image);
      data.append("name", name);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/brands`,
        {
          method: "POST",
          body: data,
          headers: {
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
        set_name("");
        set_error(null);
        set_modal_open(false);
        revalidate_data("brands");
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <Dialog open={modal_open} onOpenChange={set_modal_open}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Brand</DialogTitle>
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

          <div className="grid gap-2">
            <Label htmlFor="image">Brand Image</Label>
            <Input
              id="image"
              type="file"
              onChange={(e) => set_image(e.target.files[0])}
              accept="image/*"
              disabled={loading}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <SubmitButton
            loading={loading}
            onClick={add_brand}
            className="w-full"
          >
            Add Brand
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBrand;
