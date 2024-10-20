"use client";

import { useToast } from "@/hooks/use-toast";
import update_cart from "@/lib/update-cart";
import AddToCartButton from "@/components/add-to-cart-button";

const CartButtons = ({ product, access_token }) => {
  const { toast } = useToast();

  const quantity_in_cart =
    product.cart_items && product.cart_items.length > 0
      ? product.cart_items[0].quantity
      : 0;

  return (
    <div>
      {quantity_in_cart > 0 ? (
        <div className="flex items-center">
          <button
            className={`border rounded-md py-0.5 px-2 mr-2`}
            onClick={() =>
              update_cart({
                operation: "remove",
                product,
                toast,
                access_token,
              })
            }
            disabled={quantity_in_cart < 2}
          >
            -
          </button>
          <span className="text-center w-8">{quantity_in_cart}</span>
          <button
            className="border rounded-md py-0.5 px-2 ml-2"
            onClick={() =>
              update_cart({
                operation: "add",
                product,
                toast,
                access_token,
              })
            }
          >
            +
          </button>
        </div>
      ) : (
        <div className="w-full">
          <AddToCartButton product={product} className="w-full max-w-md" />
        </div>
      )}
    </div>
  );
};

export default CartButtons;
