"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const CartIcon = () => {
  const totalCartItems = 0;

  return (
    <Link href="/cart">
      <div className="relative">
        <ShoppingCart className="w-5 h-5 text-primary" />
        <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-4 -right-4">
          {totalCartItems}
        </div>
      </div>
    </Link>
  );
};

export default CartIcon;
