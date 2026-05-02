"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import { selectSubtotalCents, useCart } from "@/lib/cart/store";
import { formatBRL } from "@/lib/utils";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const lines = useCart((s) => s.lines);
  const remove = useCart((s) => s.remove);
  const setQuantity = useCart((s) => s.setQuantity);
  const subtotal = selectSubtotalCents(lines);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/35 transition-opacity duration-500 ease-premium ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-offwhite shadow-soft border-l border-ink/10 flex flex-col transition-transform duration-500 ease-premium ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Sacola de compras"
      >
        <header className="flex items-center justify-between px-7 py-5 border-b border-ink/8">
          <span className="text-[11px] uppercase tracking-[0.32em] text-gold">
            Sua sacola
          </span>
          <button
            onClick={close}
            aria-label="Fechar"
            className="text-ink/70 hover:text-gold transition-colors duration-300 ease-premium"
          >
            <X className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          {lines.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="font-display text-2xl text-ink">Sua sacola está vazia</p>
              <p className="text-sm text-gray-mid">
                Comece explorando nossas fragrâncias.
              </p>
              <Link
                href="/perfumes"
                onClick={close}
                className="btn-ghost mt-2"
              >
                Ver perfumes
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/8">
              {lines.map((l) => (
                <li key={l.variantId} className="py-5 flex gap-4">
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-gray-soft/40">
                    <Image
                      src={l.imageUrl}
                      alt={l.productName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/perfumes/${l.productSlug}`}
                      onClick={close}
                      className="font-display text-lg text-ink hover:text-gold transition-colors duration-300 ease-premium"
                    >
                      {l.productName}
                    </Link>
                    <p className="label-tech mt-0.5">{l.sizeMl} ml</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-ink/15">
                        <button
                          aria-label="Diminuir"
                          onClick={() =>
                            setQuantity(l.variantId, l.quantity - 1)
                          }
                          className="h-8 w-8 inline-flex items-center justify-center text-ink hover:text-gold transition-colors"
                        >
                          <Minus className="h-3 w-3" strokeWidth={1.6} />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {l.quantity}
                        </span>
                        <button
                          aria-label="Aumentar"
                          onClick={() =>
                            setQuantity(l.variantId, l.quantity + 1)
                          }
                          className="h-8 w-8 inline-flex items-center justify-center text-ink hover:text-gold transition-colors"
                        >
                          <Plus className="h-3 w-3" strokeWidth={1.6} />
                        </button>
                      </div>
                      <span className="text-sm tabular-nums text-ink">
                        {formatBRL(l.unitPriceCents * l.quantity)}
                      </span>
                    </div>
                    <button
                      onClick={() => remove(l.variantId)}
                      className="mt-2 text-[11px] uppercase tracking-[0.22em] text-gray-mid hover:text-gold transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-ink/8 px-7 py-6 space-y-4 bg-offwhite">
            <div className="flex justify-between text-sm">
              <span className="label-tech">Subtotal</span>
              <span className="tabular-nums">{formatBRL(subtotal)}</span>
            </div>
            <p className="text-[11px] text-gray-mid">
              Frete e impostos calculados no checkout.
            </p>
            <Link
              href="/checkout"
              onClick={close}
              className="btn-primary w-full"
            >
              Finalizar compra
            </Link>
            <Link
              href="/perfumes"
              onClick={close}
              className="block text-center text-[11px] uppercase tracking-[0.22em] text-ink/70 hover:text-gold transition-colors"
            >
              Continuar comprando
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
