import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Product } from "./types";
import { sampleProducts } from "./sample-data";

const useSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/**
 * Cliente sem sessão para leituras públicas do catálogo.
 * RLS já permite SELECT público em products / product_variants.
 * Pode ser chamado em qualquer contexto (request, generateStaticParams, etc).
 */
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function getAllProducts(): Promise<Product[]> {
  if (!useSupabase) return sampleProducts;
  const { data, error } = await publicClient()
    .from("products_with_variants")
    .select("*")
    .order("featured", { ascending: false })
    .order("name");
  if (error || !data || data.length === 0) return sampleProducts;
  return data as unknown as Product[];
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.featured).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!useSupabase) {
    return sampleProducts.find((p) => p.slug === slug) ?? null;
  }
  const { data, error } = await publicClient()
    .from("products_with_variants")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) {
    return sampleProducts.find((p) => p.slug === slug) ?? null;
  }
  return data as unknown as Product;
}
