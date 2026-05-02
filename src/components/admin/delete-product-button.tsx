"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteProductAction } from "@/app/admin/(signed-in)/produtos/actions";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (
          !confirm(
            `Excluir "${productName}"? Esta ação remove o produto e todas as suas variantes.`,
          )
        )
          return;
        start(() => {
          deleteProductAction(productId);
        });
      }}
      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gray-mid hover:text-red-700 transition-colors"
    >
      {pending ? (
        <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1.5} />
      ) : (
        <Trash2 className="h-3 w-3" strokeWidth={1.5} />
      )}
      Excluir produto
    </button>
  );
}
