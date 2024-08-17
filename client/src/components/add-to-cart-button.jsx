"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AddToCartButton = ({ product, number_of_products, className }) => {
  const [page_loaded, set_page_loaded] = useState(false);

  const add_to_cart = async () => {
    console.log("will add logic here...");
  };

  useEffect(() => {
    set_page_loaded(true);
  }, []);

  return (
    <>
      {page_loaded && (
        <Button
          className={cn(
            "group/cart_btn flex items-center justify-between transition-colors bg-secondary/40 text-secondary-foreground hover:text-primary-foreground hover:bg-primary/90 relative",
            className
          )}
          onClick={add_to_cart}
        >
          <span className="flex-1 max-md:hidden">Add</span>
          <ShoppingCart className="h-4 md:hidden" />
          <Button
            size="icon"
            className="absolute right-0 top-0 bottom-0 bg-secondary shadow-none text-secondary-foreground group-hover/cart_btn:bg-primary group-hover/cart_btn:text-primary-foreground"
          >
            <PlusIcon />
          </Button>
        </Button>
      )}
    </>
  );
};

export default AddToCartButton;
