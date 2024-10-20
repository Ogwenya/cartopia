"use client";

import { useSession } from "next-auth/react";
import { PlusIcon } from "@radix-ui/react-icons";
import { Loader, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import update_cart from "@/lib/update-cart";

const AddToCartButton = ({ product, className }) => {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const add_to_cart = async () => {
    if (status === "unauthenticated") {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "Please login to add products to cart.",
      });
      return;
    } else {
      await update_cart({
        operation: "add",
        product,
        toast,
        access_token: session.access_token,
      });
    }
  };

  return (
    <>
      {status === "loading" ? (
        <Button
          className={cn(
            "group/cart_btn flex items-center justify-between transition-colors bg-secondary/40 text-secondary-foreground hover:text-primary-foreground hover:bg-primary/90 relative",
            className,
          )}
        >
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button
          className={cn(
            "group/cart_btn flex items-center justify-between transition-colors bg-secondary/40 text-secondary-foreground hover:text-primary-foreground hover:bg-primary/90 relative",
            className,
          )}
          onClick={add_to_cart}
        >
          <span className="flex-1 max-md:hidden">Add</span>
          <ShoppingCart className="h-4 md:hidden" />

          <span className="absolute right-0 top-0 h-9 w-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground group-hover/cart_btn:bg-primary group-hover/cart_btn:text-primary-foreground">
            <PlusIcon />
          </span>
        </Button>
      )}
    </>
  );
};

export default AddToCartButton;
