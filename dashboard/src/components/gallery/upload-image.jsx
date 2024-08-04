"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import revalide_data from "@/app/actions";

const UploadImage = ({ access_token, api_endpoint, revalidation_tag }) => {
  const { toast } = useToast();
  const [loading, set_loading] = useState(false);

  const upload_image = async (image) => {
    try {
      if (!image.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Upload a valid image.",
        });

        return;
      }

      set_loading(true);
      const data = new FormData();
      data.append("image", image);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/${api_endpoint}`,
        {
          method: "POST",
          body: data,
          headers: { Authorization: `Bearer ${access_token}` },
        }
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
          description: "Image uploaded successfully.",
        });
        revalide_data(revalidation_tag);
      }
    } catch (error) {
      set_loading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <>
      {loading ? (
        <span className="flex items-center bg-muted p-4 rounded-md">
          <Loader className="mr-2 h-4 w-4 animate-spin" /> Uploading...
        </span>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor="image">Upload Image</Label>
          <Input
            id="image"
            type="file"
            onChange={(e) => upload_image(e.target.files[0])}
            required
            accept="image/*"
          />
        </div>
      )}
    </>
  );
};

export default UploadImage;
