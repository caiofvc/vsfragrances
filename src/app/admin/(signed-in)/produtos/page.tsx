import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/utils";

interface Row {
  id: string;
  slug: string;
  name: string;
  inspiration: string;
  family: string;
  gender: string;
  image_url: string;
  featured: boolean;
  active: boolean;
  variants: { price_cents: number; stock: number; size_ml: number }[];
}

export default async function ProductsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
    .select(
      "id, slug, name, inspiration, family, gender, image_url, featured, active, variants:product_variants(price_cents, stock, size_ml)",
    )
    .order("featured", { ascending: false })
    .order("name");

  const rows = (products ?? []) as Row[];

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title="Produtos"
        description={`${rows.length} produto${rows.length === 1 ? "" : "s"} cadastrado${rows.length === 1 ? "" : "s"}.`}
        action={
          <Link href="/admin/produtos/novo" className="btn-primary">
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Novo perfume
          </Link>
        }
      />

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white border border-ink/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-offwhite">
              <tr className="text-left">
                <Th>Produto</Th>
                <Th>Família</Th>
                <Th>Gênero</Th>
                <Th>Estoque</Th>
                <Th className="text-right">A partir de</Th>
                <Th>Status</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const totalStock = p.variants.reduce(
                  (s, v) => s + v.stock,
                  0,
                );
                const lowestPrice =
                  p.variants.length > 0
                    ? Math.min(...p.variants.map((v) => v.price_cents))
                    : 0;
                return (
                  <tr
                    key={p.id}
                    className="border-t border-ink/8 hover:bg-offwhite/50 transition-colors"
                  >
                    <Td>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-14 w-12 flex-shrink-0 bg-gray-soft/40 overflow-hidden">
                          {p.image_url ? (
                            <Image
                              src={p.image_url}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display text-base text-ink truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-mid truncate">
                            {p.inspiration}
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td className="capitalize">{p.family}</Td>
                    <Td className="capitalize">{p.gender}</Td>
                    <Td>
                      <span
                        className={`tabular-nums ${totalStock <= 3 ? "text-red-700" : "text-ink"}`}
                      >
                        {totalStock}
                      </span>
                      <span className="text-gray-mid text-xs ml-1">
                        un · {p.variants.length} var.
                      </span>
                    </Td>
                    <Td className="text-right tabular-nums">
                      {p.variants.length > 0
                        ? formatBRL(lowestPrice)
                        : "—"}
                    </Td>
                    <Td>
                      {p.active ? (
                        <span className="text-[11px] uppercase tracking-[0.18em] text-gold">
                          Ativo
                        </span>
                      ) : (
                        <span className="text-[11px] uppercase tracking-[0.18em] text-gray-mid">
                          Inativo
                        </span>
                      )}
                      {p.featured && (
                        <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-ink/55">
                          Destaque
                        </span>
                      )}
                    </Td>
                    <Td className="text-right">
                      <Link
                        href={`/admin/produtos/${p.id}`}
                        className="text-[11px] uppercase tracking-[0.22em] text-ink hover:text-gold transition-colors"
                      >
                        Editar
                      </Link>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-5 py-4 text-[10px] uppercase tracking-[0.22em] font-medium text-gray-mid ${className ?? ""}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-5 py-4 align-middle ${className ?? ""}`}>{children}</td>;
}

function EmptyState() {
  return (
    <div className="bg-white border border-ink/10 p-16 text-center space-y-4">
      <span className="gold-rule">Comece agora</span>
      <h2 className="font-display text-2xl">
        Você ainda não cadastrou nenhum perfume
      </h2>
      <p className="text-sm text-gray-mid max-w-md mx-auto">
        Crie seu primeiro produto para que ele apareça na vitrine da loja.
      </p>
      <Link href="/admin/produtos/novo" className="btn-primary mt-2">
        <Plus className="h-4 w-4" strokeWidth={1.5} />
        Cadastrar perfume
      </Link>
    </div>
  );
}
