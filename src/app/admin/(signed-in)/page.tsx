import Link from "next/link";
import {
  ArrowUpRight,
  Package,
  PackageX,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/utils";

interface Kpi {
  label: string;
  value: string;
  hint?: string;
  icon: typeof Package;
  href?: string;
}

async function loadKpis(): Promise<Kpi[]> {
  const supabase = await createSupabaseServerClient();

  const [productsCount, lowStockCount, ordersAgg, ordersCount] = await Promise.all([
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("product_variants")
      .select("id", { count: "exact", head: true })
      .lte("stock", 3),
    supabase
      .from("orders")
      .select("total_cents.sum()")
      .in("status", ["paid", "processing", "shipped", "delivered"])
      .single(),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const revenueCents = (ordersAgg.data as { sum: number | null } | null)?.sum ?? 0;

  return [
    {
      label: "Produtos ativos",
      value: String(productsCount.count ?? 0),
      icon: Package,
      href: "/admin/produtos",
    },
    {
      label: "Estoque baixo",
      value: String(lowStockCount.count ?? 0),
      hint: "variantes com 3 ou menos unidades",
      icon: PackageX,
      href: "/admin/produtos",
    },
    {
      label: "Receita confirmada",
      value: formatBRL(revenueCents),
      hint: "pedidos pagos ou em andamento",
      icon: TrendingUp,
    },
    {
      label: "Pedidos pendentes",
      value: String(ordersCount.count ?? 0),
      hint: "aguardando confirmação",
      icon: Receipt,
      href: "/admin/pedidos",
    },
  ];
}

export default async function AdminDashboardPage() {
  const kpis = await loadKpis();

  return (
    <>
      <PageHeader
        eyebrow="Painel"
        title="Visão geral"
        description="Acompanhe os indicadores chave do seu e-commerce."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((k) => {
          const Icon = k.icon;
          const Card = (
            <div className="group bg-white border border-ink/10 p-6 h-full hover:border-gold/40 transition-colors duration-300 ease-premium">
              <div className="flex items-start justify-between">
                <Icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
                {k.href && (
                  <ArrowUpRight
                    className="h-4 w-4 text-gray-mid group-hover:text-gold transition-colors duration-300"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <p className="font-display text-3xl text-ink mt-6 tabular-nums">
                {k.value}
              </p>
              <p className="label-tech mt-2">{k.label}</p>
              {k.hint && (
                <p className="text-[11px] text-gray-mid mt-1">{k.hint}</p>
              )}
            </div>
          );
          return k.href ? (
            <Link key={k.label} href={k.href} className="block">
              {Card}
            </Link>
          ) : (
            <div key={k.label}>{Card}</div>
          );
        })}
      </div>

      <section className="grid lg:grid-cols-2 gap-6 mt-10">
        <div className="bg-white border border-ink/10 p-8">
          <span className="eyebrow">Atalhos</span>
          <h2 className="font-display text-2xl mt-2 mb-6">Próximos passos</h2>
          <ul className="space-y-3 text-sm">
            <ShortcutLink
              href="/admin/produtos/novo"
              text="Cadastrar um novo perfume"
            />
            <ShortcutLink
              href="/admin/produtos"
              text="Ajustar estoque ou preços"
            />
            <ShortcutLink
              href="/admin/pedidos"
              text="Conferir pedidos recebidos"
            />
          </ul>
        </div>

        <div className="bg-ink text-offwhite/85 p-8">
          <span className="text-[11px] uppercase tracking-[0.32em] text-gold">
            Lembrete da marca
          </span>
          <p className="font-display text-2xl mt-3 leading-snug text-offwhite">
            Consistência &gt; perfeição.
          </p>
          <p className="text-sm mt-3 leading-relaxed">
            Use o dourado com parcimônia. 70% claro · 20% preto · 10% dourado.
            Cada cadastro de produto é uma oportunidade de reforçar a
            identidade Vasconcelos.
          </p>
        </div>
      </section>
    </>
  );
}

function ShortcutLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center justify-between border-b border-ink/8 pb-3 hover:border-gold transition-colors duration-300 ease-premium"
      >
        <span className="text-ink group-hover:text-gold transition-colors duration-300">
          {text}
        </span>
        <ArrowUpRight
          className="h-4 w-4 text-gray-mid group-hover:text-gold"
          strokeWidth={1.5}
        />
      </Link>
    </li>
  );
}
