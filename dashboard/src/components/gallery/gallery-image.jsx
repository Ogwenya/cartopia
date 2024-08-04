"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, Trash2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
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
import revalide_data from "@/app/actions";

const GalleryImage = ({
  image,
  access_token,
  api_endpoint,
  revalidation_tag,
}) => {
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState(null);
  const [modal_open, set_modal_open] = useState(false);

  const delete_image = async () => {
    try {
      set_error(null);
      set_loading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/${api_endpoint}`,
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
        revalide_data(revalidation_tag);
        set_error(null);
        set_modal_open(false);
      }
    } catch (error) {
      set_loading(false);
      set_error(error.message);
    }
  };
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted relative">
      <Image
        src={image.image_url}
        alt="Gallery image"
        fill
        className="rounded-md"
      />
      <AlertDialog open={modal_open} onOpenChange={set_modal_open}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-2 right-2"
          >
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Image deletion.</AlertDialogTitle>
            <AlertDialogDescription>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </AlertDialogDescription>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              image from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <SubmitButton
              variant="destructive"
              loading={loading}
              onClick={delete_image}
            >
              Delete Image
            </SubmitButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AspectRatio>
  );
};

export default GalleryImage;
