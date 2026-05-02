import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { getAllProducts } from "@/lib/catalog/queries";
import type { Gender, OlfactoryFamily } from "@/lib/catalog/types";

interface Props {
  searchParams: Promise<{
    gender?: Gender;
    family?: OlfactoryFamily;
  }>;
}

const GENDER_FILTERS: { value: Gender | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "unissex", label: "Unissex" },
];

const FAMILY_FILTERS: { value: OlfactoryFamily | "all"; label: string }[] = [
  { value: "all", label: "Todas as famílias" },
  { value: "amadeirado", label: "Amadeirado" },
  { value: "citrico", label: "Cítrico" },
  { value: "floral", label: "Floral" },
  { value: "oriental", label: "Oriental" },
  { value: "aromatico", label: "Aromático" },
  { value: "doce", label: "Doce" },
  { value: "frutal", label: "Frutal" },
];

export default async function PerfumesPage({ searchParams }: Props) {
  const { gender, family } = await searchParams;
  const all = await getAllProducts();
  const filtered = all.filter((p) => {
    if (gender && p.gender !== gender) return false;
    if (family && p.family !== family) return false;
    return true;
  });

  const buildHref = (
    next: Partial<{ gender: Gender | "all"; family: OlfactoryFamily | "all" }>,
  ) => {
    const params = new URLSearchParams();
    const finalGender = next.gender ?? gender;
    const finalFamily = next.family ?? family;
    if (finalGender && finalGender !== "all") params.set("gender", finalGender);
    if (finalFamily && finalFamily !== "all") params.set("family", finalFamily);
    const qs = params.toString();
    return qs ? `/perfumes?${qs}` : "/perfumes";
  };

  return (
    <section className="container-edge py-16">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
        <span className="gold-rule">Coleção completa</span>
        <h1 className="heading-display text-4xl md:text-5xl">
          Nossas fragrâncias
        </h1>
        <p className="text-gray-mid">
          Composições autorais inspiradas nos grandes clássicos da perfumaria
          mundial.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-12">
        <FilterRow
          label="Gênero"
          filters={GENDER_FILTERS}
          active={gender ?? "all"}
          buildHref={(v) => buildHref({ gender: v as Gender | "all" })}
        />
        <FilterRow
          label="Família olfativa"
          filters={FAMILY_FILTERS}
          active={family ?? "all"}
          buildHref={(v) =>
            buildHref({ family: v as OlfactoryFamily | "all" })
          }
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <p className="font-display text-2xl">Nenhum perfume encontrado</p>
          <p className="text-sm text-gray-mid">
            Tente ajustar os filtros para ver outras opções.
          </p>
          <Link href="/perfumes" className="btn-ghost mt-4">
            Limpar filtros
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterRow({
  label,
  filters,
  active,
  buildHref,
}: {
  label: string;
  filters: { value: string; label: string }[];
  active: string;
  buildHref: (value: string) => string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="label-tech mr-2">{label}</span>
      {filters.map((f) => {
        const isActive = active === f.value;
        return (
          <Link
            key={f.value}
            href={buildHref(f.value)}
            className={`text-[11px] uppercase tracking-[0.22em] px-3 py-1.5 border transition-colors duration-300 ease-premium ${
              isActive
                ? "border-gold text-gold"
                : "border-ink/15 text-ink/70 hover:border-ink/30 hover:text-ink"
            }`}
          >
            {f.label}
          </Link>
        );
      })}
    </div>
  );
}
