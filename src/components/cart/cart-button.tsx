"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { selectItemCount, useCart } from "@/lib/cart/store";

export function CartButton() {
  const open = useCart((s) => s.open);
  const count = useCart((s) => selectItemCount(s.lines));
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <button
      type="button"
      aria-label="Abrir sacola"
      onClick={open}
      className="relative inline-flex items-center transition-colors duration-300 ease-premium hover:text-gold"
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
      {hydrated && count > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold text-[10px] font-medium text-ink px-1">
          {count}
        </span>
      )}
    </button>
  );
}
