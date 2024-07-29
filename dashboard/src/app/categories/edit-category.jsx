"use client";

import { useState } from "react";
import Image from "next/image";
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
import revalide_data from "@/app/actions";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const EditCategory = ({ category }) => {
  const { data: session } = useSession();
  const [name, set_name] = useState(category.name);
  const [image, set_image] = useState(null);
  const [error, set_error] = useState(null);
  const [loading, set_loading] = useState(false);
  const [modal_open, set_modal_open] = useState(false);

  const edit_category = async () => {
    set_error(null);

    if (!name) {
      set_error("Provide category name.");
      return;
    }

    if (image && !image.type.startsWith("image/")) {
      set_error("Upload a valid image.");

      return;
    }

    try {
      set_loading(true);

      const data = new FormData();
      data.append("name", name);

      if (image) {
        data.append("image", image);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/categories/${category.id}`,
        {
          method: "PATCH",
          body: data,
          headers: {
            Authorization: `Bearer ${session.access_token}`,
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
        revalide_data("categories");
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };

  return (
    <Dialog open={modal_open} onOpenChange={set_modal_open}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PenBox className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
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
            <Label htmlFor="image">Category Image</Label>
            <AspectRatio ratio={16 / 9} className="bg-muted pb-0">
              <Image fill src={category.image_url} alt={category.name} />
            </AspectRatio>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Change Image</Label>
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
            onClick={edit_category}
            className="w-full"
          >
            Update Category
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategory;
