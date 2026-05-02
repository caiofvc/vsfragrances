"use client";

import { useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/store";
import { formatBRL } from "@/lib/utils";
import type { Product } from "@/lib/catalog/types";

export function ProductBuyPanel({ product }: { product: Product }) {
  const sorted = [...product.variants].sort((a, b) => a.sizeMl - b.sizeMl);
  const defaultId = sorted.find((v) => v.stock > 0)?.id ?? sorted[0]!.id;
  const [variantId, setVariantId] = useState<string>(defaultId);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const add = useCart((s) => s.add);

  const variant = sorted.find((v) => v.id === variantId)!;
  const outOfStock = variant.stock <= 0;

  const onAdd = () => {
    add({
      variantId: variant.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      inspiration: product.inspiration,
      imageUrl: product.imageUrl,
      sizeMl: variant.sizeMl,
      unitPriceCents: variant.priceCents,
      quantity: qty,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="space-y-7">
      <div>
        <span className="label-tech">Volume</span>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {sorted.map((v) => {
            const active = v.id === variantId;
            return (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                disabled={v.stock <= 0}
                className={`group flex flex-col items-center justify-center px-4 py-4 border transition-colors duration-300 ease-premium disabled:opacity-40 disabled:cursor-not-allowed ${
                  active
                    ? "border-gold text-ink"
                    : "border-ink/15 text-ink/80 hover:border-ink/40"
                }`}
              >
                <span className="font-display text-lg">{v.sizeMl} ml</span>
                <span className="mt-1 text-xs tabular-nums text-gray-mid group-hover:text-ink">
                  {formatBRL(v.priceCents)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hairline" />

      <div className="flex items-end justify-between gap-6">
        <div>
          <span className="label-tech">Total</span>
          <p className="font-display text-3xl text-ink mt-2 tabular-nums">
            {formatBRL(variant.priceCents * qty)}
          </p>
          <p className="text-[11px] text-gray-mid mt-1">
            ou 12x de {formatBRL(Math.round((variant.priceCents * qty) / 12))}{" "}
            sem juros
          </p>
        </div>
        <div className="inline-flex items-center border border-ink/15">
          <button
            aria-label="Diminuir"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-12 w-12 inline-flex items-center justify-center text-ink hover:text-gold transition-colors"
          >
            −
          </button>
          <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
          <button
            aria-label="Aumentar"
            onClick={() => setQty((q) => Math.min(variant.stock || 99, q + 1))}
            className="h-12 w-12 inline-flex items-center justify-center text-ink hover:text-gold transition-colors"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.6} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={outOfStock}
        className="btn-primary w-full"
      >
        <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
        {outOfStock
          ? "Esgotado"
          : justAdded
            ? "Adicionado · ver sacola"
            : "Adicionar à sacola"}
      </button>

      <ul className="text-[11px] uppercase tracking-[0.22em] text-gray-mid space-y-2 pt-2">
        <li>· Envio em até 24h úteis</li>
        <li>· Pix com 5% de desconto</li>
        <li>· Cartão em até 12x sem juros</li>
      </ul>
    </div>
  );
}
