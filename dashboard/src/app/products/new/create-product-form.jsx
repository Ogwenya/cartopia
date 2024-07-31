"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import revalidate_data from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "@/components/ui/submit-button";
import AddCategory from "../../categories/add-category";
import { Combobox } from "@/components/ui/combobox";

const WYSIWYGEditor = dynamic(
  () => {
    return import("@/components/WYSIWYGEditor");
  },
  { ssr: false }
);

const CreateProductForm = ({ categories, brands, access_token }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [name, set_name] = useState("");
  const [description, set_description] = useState(null);
  const [price, set_price] = useState(0);
  const [in_stock, set_in_stock] = useState(0);
  const [discount_type, set_discount_type] = useState("NONE");
  const [discount_value, set_discount_value] = useState(0);
  const [brand, set_brand] = useState("");
  const [category, set_category] = useState("");
  const [images, set_images] = useState(null);
  const [loading, set_loading] = useState(false);

  const add_product = async () => {
    if (!name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Provide product name",
      });
      return;
    } else if (price === "" || isNaN(price)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Provide product price",
      });
      return;
    } else if (in_stock === "" || isNaN(in_stock)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Provide product stock",
      });
      return;
    } else if (!description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Provide product description",
      });
      return;
    } else if (!discount_type) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Provide product discount type",
      });
      return;
    } else if (discount_value === "" || isNaN(discount_value)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Provide product discount value",
      });
      return;
    } else if (!category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Provide product category",
      });
      return;
    } else if (!images) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Provide product images(s)",
      });
      return;
    }

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!image.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Upload a valid image.",
        });

        return;
      }
    }

    try {
      set_loading(true);

      const data = new FormData();
      data.append("name", name);
      data.append("price", price);
      data.append("in_stock", in_stock);
      data.append("description", description);
      data.append("discount_type", discount_type);
      data.append("discount_value", discount_value);
      data.append("brand", brand);
      data.append("category", category);

      for (let index = 0; index < images.length; index++) {
        const image = images[index];
        data.append("images", image);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/products`,
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
          description: "Product added successfully.",
        });
        revalidate_data("products");
        router.push("/products");
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

  useEffect(() => {
    if (discount_type === "NONE") {
      set_discount_value(0);
    }
  }, [discount_type]);

  return (
    <div>
      <div className="grid xl:grid-cols-2 gap-4 gap-y-8 py-4">
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
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="brand">Brand</Label>

            <Combobox
              entries={brands.map((brand) => {
                return { value: brand.name, label: brand.name };
              })}
              value={brand}
              items_name="brand"
              setValue={set_brand}
              add_if_not_found={true}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category" className="flex items-center gap-2">
              <span>Category</span>
              <AddCategory access_token={access_token} trigger="icon" />
            </Label>
            <Combobox
              entries={categories.map((category) => {
                return { value: category.name, label: category.name };
              })}
              value={category}
              items_name="category"
              setValue={set_category}
              add_if_not_found={false}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => set_price(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={in_stock}
              onChange={(e) => set_in_stock(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="discount_type">Discount type</Label>
            <Select
              value={discount_type}
              onValueChange={(value) => set_discount_type(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="NONE">No Discount</SelectItem>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                  <SelectItem value="Amount">Amount</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="discount_value">Discount Value</Label>
            <Input
              id="discount_value"
              type="number"
              value={discount_value}
              onChange={(e) => set_discount_value(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full min-h-96">
          <Label className="h-fit" htmlFor="description">
            Description
          </Label>
          <WYSIWYGEditor content={description} set_content={set_description} />
        </div>
        <div className="grid gap-2 h-fit">
          <Label htmlFor="images">Image(s)</Label>
          <Input
            id="images"
            type="file"
            onChange={(e) => set_images(Array.from(e.target.files))}
            disabled={loading}
            accept="image/*"
            required
            multiple
          />

          {/* image previews */}
          {images && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {images.map((image, index) => {
                const displayUrl = URL.createObjectURL(image);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-center border rounded-md p-2"
                  >
                    <img src={displayUrl} alt={`preview-${index}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <SubmitButton
        loading={loading}
        onClick={add_product}
        className="w-full sm:w-fit mt-5"
      >
        Add Product
      </SubmitButton>
    </div>
  );
};

export default CreateProductForm;
