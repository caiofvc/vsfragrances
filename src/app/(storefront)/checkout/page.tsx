"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock } from "lucide-react";
import { selectSubtotalCents, useCart } from "@/lib/cart/store";
import { formatBRL } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const subtotal = selectSubtotalCents(lines);
  const shipping = subtotal > 0 && subtotal < 35000 ? 2490 : 0;
  const total = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone },
          shippingCents: shipping,
          items: lines.map((l) => ({
            variantId: l.variantId,
            productName: l.productName,
            sizeMl: l.sizeMl,
            unitPriceCents: l.unitPriceCents,
            quantity: l.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Falha ao iniciar o pagamento.");
        return;
      }
      clear();
      router.push(data.paymentUrl);
    } catch {
      setError("Não foi possível iniciar o pagamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <section className="container-edge py-24 text-center space-y-4">
        <span className="gold-rule">Checkout</span>
        <h1 className="heading-display text-4xl">Sua sacola está vazia</h1>
        <p className="text-gray-mid">
          Adicione um perfume antes de finalizar a compra.
        </p>
        <Link href="/perfumes" className="btn-primary mt-4">
          Ver perfumes
        </Link>
      </section>
    );
  }

  return (
    <section className="container-edge py-12 grid lg:grid-cols-[1.2fr_1fr] gap-12">
      <div>
        <span className="gold-rule">Finalizar compra</span>
        <h1 className="heading-display text-4xl md:text-5xl mt-4 mb-10">
          Seus dados
        </h1>

        <form onSubmit={onSubmit} className="space-y-6 max-w-lg">
          <Field
            label="Nome completo"
            value={name}
            onChange={setName}
            required
            autoComplete="name"
          />
          <div className="grid sm:grid-cols-2 gap-6">
            <Field
              label="E-mail"
              type="email"
              value={email}
              onChange={setEmail}
              required
              autoComplete="email"
            />
            <Field
              label="Telefone"
              value={phone}
              onChange={setPhone}
              required
              autoComplete="tel"
              placeholder="(11) 90000-0000"
            />
          </div>
          <Field
            label="CEP"
            value={zip}
            onChange={setZip}
            autoComplete="postal-code"
            placeholder="00000-000"
          />

          {error && (
            <p className="text-sm text-red-700 bg-red-100/50 border border-red-200 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            <Lock className="h-4 w-4" strokeWidth={1.5} />
            {submitting ? "Processando…" : `Pagar ${formatBRL(total)}`}
          </button>

          <p className="text-[11px] uppercase tracking-[0.22em] text-gray-mid text-center">
            Pagamento processado pela InfinitePay · Pix · Cartão
          </p>
        </form>
      </div>

      <aside className="bg-offwhite border border-ink/10 p-8 h-fit">
        <span className="label-tech">Resumo do pedido</span>
        <ul className="mt-6 space-y-5">
          {lines.map((l) => (
            <li key={l.variantId} className="flex gap-4 items-start">
              <div className="relative h-20 w-16 flex-shrink-0 bg-gray-soft/40 overflow-hidden">
                <Image
                  src={l.imageUrl}
                  alt={l.productName}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base">{l.productName}</p>
                <p className="label-tech mt-0.5">
                  {l.sizeMl} ml · qtd {l.quantity}
                </p>
              </div>
              <span className="text-sm tabular-nums">
                {formatBRL(l.unitPriceCents * l.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-ink/8 space-y-2 text-sm">
          <Row label="Subtotal" value={formatBRL(subtotal)} />
          <Row
            label="Frete"
            value={shipping === 0 ? "Grátis" : formatBRL(shipping)}
          />
          <Row
            label="Total"
            value={formatBRL(total)}
            emphasis
          />
        </div>
      </aside>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label-tech">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border-b border-ink/20 py-2.5 text-base text-ink placeholder:text-gray-mid focus:outline-none focus:border-gold transition-colors duration-300 ease-premium"
      />
    </label>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className={emphasis ? "label-tech" : "text-gray-mid text-sm"}>
        {label}
      </span>
      <span
        className={`tabular-nums ${
          emphasis ? "font-display text-xl text-ink" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
