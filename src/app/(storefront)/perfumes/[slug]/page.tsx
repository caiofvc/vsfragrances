import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductBuyPanel } from "@/components/product/product-buy-panel";
import { ProductCard } from "@/components/product/product-card";
import { getAllProducts, getProductBySlug } from "@/lib/catalog/queries";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = await getAllProducts();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.inspiration}`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getAllProducts();
  const related = all
    .filter((p) => p.id !== product.id && p.family === product.family)
    .slice(0, 4);

  return (
    <>
      <nav className="container-edge pt-8 text-[11px] uppercase tracking-[0.22em] text-gray-mid flex items-center gap-2">
        <Link href="/" className="hover:text-gold transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3" strokeWidth={1.6} />
        <Link href="/perfumes" className="hover:text-gold transition-colors">
          Perfumes
        </Link>
        <ChevronRight className="h-3 w-3" strokeWidth={1.6} />
        <span className="text-ink">{product.name}</span>
      </nav>

      <article className="container-edge py-12 grid md:grid-cols-2 gap-12 lg:gap-20">
        <div className="relative aspect-[4/5] w-full bg-gray-soft/30">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-ink/8" />
        </div>

        <div className="flex flex-col justify-center space-y-7">
          <div>
            <span className="eyebrow">{product.family} · {product.gender}</span>
            <h1 className="heading-display text-4xl md:text-5xl uppercase tracking-title mt-3">
              {product.name}
            </h1>
            <p className="text-gold mt-2 italic text-sm">
              {product.inspiration}
            </p>
          </div>

          <p className="text-ink/85 leading-relaxed">{product.description}</p>

          <ProductBuyPanel product={product} />
        </div>
      </article>

      {/* Pirâmide olfativa */}
      <section className="container-edge py-16 border-t border-ink/8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="gold-rule">Pirâmide olfativa</span>
          <h2 className="heading-display text-3xl md:text-4xl">
            A composição
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          <NoteBlock title="Notas de topo" notes={product.topNotes} index={1} />
          <NoteBlock
            title="Notas de coração"
            notes={product.heartNotes}
            index={2}
          />
          <NoteBlock title="Notas de fundo" notes={product.baseNotes} index={3} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-edge py-16 border-t border-ink/8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="eyebrow">Você também pode gostar</span>
              <h2 className="heading-display text-3xl md:text-4xl mt-2">
                Da mesma família
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function NoteBlock({
  title,
  notes,
  index,
}: {
  title: string;
  notes: string[];
  index: number;
}) {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold font-display">
        {index}
      </div>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <ul className="space-y-1.5 text-sm text-ink/80">
        {notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
