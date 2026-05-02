import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { VariantsPanel } from "@/components/admin/variants-panel";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateProductAction } from "../actions";

interface Props {
  params: Promise<{ id: string }>;
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  inspiration: string;
  description: string;
  family: string;
  gender: string;
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  image_url: string;
  featured: boolean;
}

interface VariantRow {
  id: string;
  size_ml: number;
  price_cents: number;
  stock: number;
  sku: string;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: product }, { data: variants }] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, slug, name, inspiration, description, family, gender, top_notes, heart_notes, base_notes, image_url, featured",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("product_variants")
      .select("id, size_ml, price_cents, stock, sku")
      .eq("product_id", id),
  ]);

  if (!product) notFound();
  const p = product as ProductRow;
  const updateAction = updateProductAction.bind(null, p.id);

  return (
    <>
      <PageHeader
        eyebrow="Catálogo · Edição"
        title={p.name}
        description={p.inspiration}
        action={
          <Link
            href={`/perfumes/${p.slug}`}
            target="_blank"
            className="btn-ghost"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
            Ver na loja
          </Link>
        }
      />

      <ProductForm
        action={updateAction}
        defaults={{
          name: p.name,
          slug: p.slug,
          inspiration: p.inspiration,
          description: p.description,
          family: p.family,
          gender: p.gender,
          topNotes: p.top_notes,
          heartNotes: p.heart_notes,
          baseNotes: p.base_notes,
          imageUrl: p.image_url,
          featured: p.featured,
        }}
        submitLabel="Salvar alterações"
      />

      <div className="mt-14">
        <VariantsPanel
          productId={p.id}
          variants={(variants ?? []) as VariantRow[]}
        />
      </div>

      <div className="mt-16 pt-8 border-t border-ink/8">
        <DeleteProductButton productId={p.id} productName={p.name} />
      </div>
    </>
  );
}
