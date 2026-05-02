import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Sparkles, Truck } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts } from "@/lib/catalog/queries";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-offwhite overflow-hidden">
        <div className="container-edge grid md:grid-cols-2 gap-10 items-center py-20 md:py-28">
          <div className="space-y-7">
            <span className="gold-rule">Vasconcelos · Edição 2026</span>
            <h1 className="heading-display text-5xl md:text-6xl leading-[1.05]">
              Fragrâncias inspiradas em grandes sucessos.
            </h1>
            <p className="text-base md:text-lg text-ink/80 max-w-md leading-relaxed">
              Alta fixação, presença marcante e elegância em cada detalhe.
              Contratipos premium pensados para quem entra antes de ser
              anunciado.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/perfumes" className="btn-primary">
                Explorar coleção
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link href="/sobre" className="btn-ghost">
                Conheça a marca
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full max-w-md justify-self-end">
            <Image
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80"
              alt="Frasco de perfume Vasconcelos"
              fill
              priority
              sizes="(min-width: 768px) 480px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-ink/8" />
            <div className="absolute -bottom-px left-6 right-6 h-px bg-gold/70" />
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="border-y border-ink/8 bg-offwhite">
        <div className="container-edge grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/8">
          <Pillar
            icon={<Sparkles className="h-5 w-5 text-gold" strokeWidth={1.4} />}
            title="Alta fixação"
            text="Composições com 25–30% de essência. Permanência de até 12h na pele."
          />
          <Pillar
            icon={<Award className="h-5 w-5 text-gold" strokeWidth={1.4} />}
            title="Inspiração premium"
            text="Releituras refinadas dos clássicos das casas mais desejadas do mundo."
          />
          <Pillar
            icon={<Truck className="h-5 w-5 text-gold" strokeWidth={1.4} />}
            title="Envio para todo Brasil"
            text="Frete calculado em tempo real e despacho em até 24h úteis."
          />
        </div>
      </section>

      {/* Destaques */}
      <section className="container-edge py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow">Coleção em destaque</span>
            <h2 className="heading-display text-4xl md:text-5xl mt-3">
              Os mais desejados
            </h2>
          </div>
          <Link
            href="/perfumes"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink hover:text-gold transition-colors duration-300 ease-premium"
          >
            Ver todos
            <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Manifesto */}
      <section className="bg-ink text-offwhite">
        <div className="container-edge py-24 grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div className="space-y-5">
            <span className="text-[11px] uppercase tracking-[0.32em] text-gold">
              A marca
            </span>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.1]">
              Elegância em cada detalhe.
            </h2>
            <p className="text-offwhite/75 leading-relaxed max-w-md">
              Vasconcelos nasceu com uma obsessão simples: oferecer a
              experiência de uma fragrância importada sem o exagero de seu
              preço. Composições autorais, frascos minimalistas, presença
              inconfundível.
            </p>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-gold hover:text-offwhite transition-colors duration-300 ease-premium"
            >
              Nossa história
              <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="relative aspect-[5/4] w-full">
            <Image
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=80"
              alt="Detalhe minimalista de perfume"
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover grayscale-[15%]"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-gold/25" />
          </div>
        </div>
      </section>
    </>
  );
}

function Pillar({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="px-2 md:px-10 py-10 flex items-start gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="font-display text-xl text-ink mb-1.5">{title}</h3>
        <p className="text-sm text-gray-mid leading-relaxed max-w-xs">
          {text}
        </p>
      </div>
    </div>
  );
}
