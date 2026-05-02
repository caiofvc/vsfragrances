import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog/types";
import { formatBRL } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const fromCents = Math.min(...product.variants.map((v) => v.priceCents));
  return (
    <Link
      href={`/perfumes/${product.slug}`}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-soft/30">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-ink/5" />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-offwhite/95 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-gold border border-gold/30">
            Destaque
          </span>
        )}
      </div>
      <div className="pt-5 space-y-1.5">
        <p className="label-tech">{product.gender}</p>
        <h3 className="font-display text-xl text-ink uppercase tracking-title group-hover:text-gold transition-colors duration-300 ease-premium">
          {product.name}
        </h3>
        <p className="text-xs text-gray-mid line-clamp-1">
          {product.inspiration}
        </p>
        <p className="text-sm text-ink tabular-nums pt-1">
          a partir de {formatBRL(fromCents)}
        </p>
      </div>
    </Link>
  );
}
