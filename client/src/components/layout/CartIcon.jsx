"use client";

import Link from "next/link";
import useCartStore from "@/hooks/cartStore";
import useStore from "@/hooks/useStore";

const CartIcon = () => {
  const totalCartItems = useStore(
    useCartStore,
    (state) => state.totalCartItems
  );

  return (
    <Link href="/shop/cart">
      <div className="relative">
        <svg
          className="w-7 h-7 text-primary"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1"
          />
        </svg>
        <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2">
          {totalCartItems}
        </div>
      </div>
    </Link>
  );
};

export default CartIcon;
