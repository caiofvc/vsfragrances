"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Save, Trash2, X } from "lucide-react";
import {
  deleteVariantAction,
  upsertVariantAction,
} from "@/app/admin/(signed-in)/produtos/actions";
import { formatBRL } from "@/lib/utils";

interface Variant {
  id: string;
  size_ml: number;
  price_cents: number;
  stock: number;
  sku: string;
}

export function VariantsPanel({
  productId,
  variants,
}: {
  productId: string;
  variants: Variant[];
}) {
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const sorted = [...variants].sort((a, b) => a.size_ml - b.size_ml);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="label-tech">Variantes (tamanhos)</span>
        {editingId !== "new" && (
          <button
            onClick={() => setEditingId("new")}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ink hover:text-gold transition-colors"
          >
            <Plus className="h-3 w-3" strokeWidth={1.6} />
            Nova variante
          </button>
        )}
      </div>

      <div className="bg-white border border-ink/10 divide-y divide-ink/8">
        {editingId === "new" && (
          <VariantRow
            productId={productId}
            onClose={() => setEditingId(null)}
          />
        )}

        {sorted.length === 0 && editingId !== "new" && (
          <div className="px-5 py-10 text-center text-sm text-gray-mid">
            Cadastre os volumes deste perfume (ex.: 30ml, 50ml, 100ml).
          </div>
        )}

        {sorted.map((v) =>
          editingId === v.id ? (
            <VariantRow
              key={v.id}
              productId={productId}
              variant={v}
              onClose={() => setEditingId(null)}
            />
          ) : (
            <VariantReadRow
              key={v.id}
              productId={productId}
              variant={v}
              onEdit={() => setEditingId(v.id)}
            />
          ),
        )}
      </div>
    </section>
  );
}

function VariantReadRow({
  productId,
  variant,
  onEdit,
}: {
  productId: string;
  variant: Variant;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid grid-cols-12 items-center gap-4 px-5 py-4 text-sm">
      <div className="col-span-2 font-display text-lg">{variant.size_ml} ml</div>
      <div className="col-span-3 tabular-nums">
        {formatBRL(variant.price_cents)}
      </div>
      <div className="col-span-2 tabular-nums">
        <span className={variant.stock <= 3 ? "text-red-700" : "text-ink"}>
          {variant.stock}
        </span>
        <span className="text-gray-mid text-xs ml-1">un</span>
      </div>
      <div className="col-span-3 text-xs text-gray-mid font-mono truncate">
        {variant.sku}
      </div>
      <div className="col-span-2 flex justify-end gap-3">
        <button
          onClick={onEdit}
          className="text-[11px] uppercase tracking-[0.22em] text-ink hover:text-gold transition-colors"
        >
          Editar
        </button>
        <button
          disabled={pending}
          onClick={() => {
            if (!confirm(`Remover variante de ${variant.size_ml}ml?`)) return;
            startTransition(() => {
              deleteVariantAction(productId, variant.id);
            });
          }}
          className="text-gray-mid hover:text-red-700 transition-colors"
          aria-label="Remover variante"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
      </div>
    </div>
  );
}

function VariantRow({
  productId,
  variant,
  onClose,
}: {
  productId: string;
  variant?: Variant;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(fd) => {
        startTransition(async () => {
          const result = await upsertVariantAction(productId, {}, fd);
          if (result?.error) {
            setError(result.error);
          } else {
            setError(null);
            onClose();
          }
        });
      }}
      className="grid grid-cols-12 items-end gap-4 px-5 py-5 text-sm bg-offwhite/60"
    >
      {variant && <input type="hidden" name="id" value={variant.id} />}

      <Cell span={2} label="Volume (ml)">
        <input
          name="sizeMl"
          type="number"
          min={1}
          required
          defaultValue={variant?.size_ml}
          className="mt-1 w-full bg-transparent border-b border-ink/20 py-1.5 focus:outline-none focus:border-gold"
        />
      </Cell>
      <Cell span={3} label="Preço (R$)">
        <input
          name="priceReais"
          type="text"
          inputMode="decimal"
          required
          defaultValue={
            variant ? (variant.price_cents / 100).toFixed(2) : undefined
          }
          className="mt-1 w-full bg-transparent border-b border-ink/20 py-1.5 focus:outline-none focus:border-gold"
        />
      </Cell>
      <Cell span={2} label="Estoque">
        <input
          name="stock"
          type="number"
          min={0}
          required
          defaultValue={variant?.stock ?? 0}
          className="mt-1 w-full bg-transparent border-b border-ink/20 py-1.5 focus:outline-none focus:border-gold"
        />
      </Cell>
      <Cell span={3} label="SKU">
        <input
          name="sku"
          type="text"
          required
          defaultValue={variant?.sku}
          placeholder="VSF-001-050"
          className="mt-1 w-full bg-transparent border-b border-ink/20 py-1.5 font-mono text-xs focus:outline-none focus:border-gold"
        />
      </Cell>
      <div className="col-span-2 flex justify-end gap-2">
        <button
          type="submit"
          disabled={pending}
          aria-label="Salvar"
          className="h-9 w-9 inline-flex items-center justify-center bg-ink text-offwhite hover:bg-gold hover:text-ink transition-colors"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <Save className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cancelar"
          className="h-9 w-9 inline-flex items-center justify-center border border-ink/15 text-ink/70 hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
      {error && (
        <p className="col-span-12 text-xs text-red-700 mt-1">{error}</p>
      )}
    </form>
  );
}

const SPAN: Record<number, string> = {
  2: "col-span-2",
  3: "col-span-3",
};

function Cell({
  span,
  label,
  children,
}: {
  span: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`${SPAN[span] ?? "col-span-2"} block`}>
      <span className="text-[10px] uppercase tracking-[0.22em] text-gray-mid">
        {label}
      </span>
      {children}
    </label>
  );
}
