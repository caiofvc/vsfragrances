"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { slugify } from "@/lib/utils";
import type { Gender, OlfactoryFamily } from "@/lib/catalog/types";

const FAMILIES: OlfactoryFamily[] = [
  "amadeirado",
  "citrico",
  "floral",
  "oriental",
  "aromatico",
  "doce",
  "frutal",
];
const GENDERS: Gender[] = ["masculino", "feminino", "unissex"];

interface ProductFormData {
  name: string;
  slug: string;
  inspiration: string;
  description: string;
  family: OlfactoryFamily;
  gender: Gender;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  imageUrl: string;
  featured: boolean;
}

export interface ProductActionState {
  error?: string;
  fieldErrors?: Partial<Record<keyof ProductFormData, string>>;
}

function parseNotes(input: FormDataEntryValue | null): string[] {
  if (!input) return [];
  return String(input)
    .split(/[\n,;]/g)
    .map((n) => n.trim())
    .filter(Boolean);
}

function parseForm(formData: FormData): {
  data: ProductFormData;
  errors: Partial<Record<keyof ProductFormData, string>>;
} {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugInput ? slugify(slugInput) : slugify(name);
  const inspiration = String(formData.get("inspiration") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const family = String(formData.get("family") ?? "") as OlfactoryFamily;
  const gender = String(formData.get("gender") ?? "") as Gender;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const featured = formData.get("featured") === "on";

  const errors: Partial<Record<keyof ProductFormData, string>> = {};
  if (!name) errors.name = "Obrigatório";
  if (!slug) errors.slug = "Obrigatório";
  if (!inspiration) errors.inspiration = "Obrigatório";
  if (!description) errors.description = "Obrigatório";
  if (!FAMILIES.includes(family)) errors.family = "Família inválida";
  if (!GENDERS.includes(gender)) errors.gender = "Gênero inválido";
  if (!imageUrl) errors.imageUrl = "Adicione uma imagem";

  return {
    data: {
      name,
      slug,
      inspiration,
      description,
      family,
      gender,
      topNotes: parseNotes(formData.get("topNotes")),
      heartNotes: parseNotes(formData.get("heartNotes")),
      baseNotes: parseNotes(formData.get("baseNotes")),
      imageUrl,
      featured,
    },
    errors,
  };
}

function toRow(d: ProductFormData) {
  return {
    name: d.name,
    slug: d.slug,
    inspiration: d.inspiration,
    description: d.description,
    family: d.family,
    gender: d.gender,
    top_notes: d.topNotes,
    heart_notes: d.heartNotes,
    base_notes: d.baseNotes,
    image_url: d.imageUrl,
    featured: d.featured,
  };
}

export async function createProductAction(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdmin();
  const { data, errors } = parseForm(formData);
  if (Object.keys(errors).length > 0) return { fieldErrors: errors };

  const supabase = await createSupabaseServerClient();
  const { data: created, error } = await supabase
    .from("products")
    .insert(toRow(data))
    .select("id")
    .single();

  if (error || !created) {
    return {
      error:
        error?.code === "23505"
          ? "Já existe um produto com este slug."
          : (error?.message ?? "Não foi possível criar o produto."),
    };
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/perfumes");
  redirect(`/admin/produtos/${created.id}`);
}

export async function updateProductAction(
  productId: string,
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdmin();
  const { data, errors } = parseForm(formData);
  if (Object.keys(errors).length > 0) return { fieldErrors: errors };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("products")
    .update(toRow(data))
    .eq("id", productId);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Já existe um produto com este slug."
          : error.message,
    };
  }

  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/perfumes");
  revalidatePath(`/perfumes/${data.slug}`);
  return {};
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/produtos");
  revalidatePath("/perfumes");
  redirect("/admin/produtos");
}

// ---------------- Variantes ----------------

export interface VariantActionState {
  error?: string;
}

export async function upsertVariantAction(
  productId: string,
  _prev: VariantActionState,
  formData: FormData,
): Promise<VariantActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim() || null;
  const sizeMl = Number(formData.get("sizeMl"));
  const priceReais = Number(
    String(formData.get("priceReais") ?? "0").replace(",", "."),
  );
  const stock = Number(formData.get("stock") ?? 0);
  const sku = String(formData.get("sku") ?? "").trim();

  if (!sizeMl || sizeMl <= 0) return { error: "Volume inválido." };
  if (!priceReais || priceReais <= 0) return { error: "Preço inválido." };
  if (!sku) return { error: "Informe o SKU." };

  const supabase = await createSupabaseServerClient();
  const row = {
    product_id: productId,
    size_ml: sizeMl,
    price_cents: Math.round(priceReais * 100),
    stock,
    sku,
  };

  const { error } = id
    ? await supabase.from("product_variants").update(row).eq("id", id)
    : await supabase.from("product_variants").insert(row);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Já existe uma variante com este volume ou SKU."
          : error.message,
    };
  }

  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/perfumes");
  return {};
}

export async function deleteVariantAction(
  productId: string,
  variantId: string,
) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", variantId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/perfumes");
}

// ---------------- Upload de imagem ----------------

export async function uploadProductImageAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecione uma imagem." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Imagem maior que 5MB." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Arquivo precisa ser uma imagem." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const service = createSupabaseServiceClient();
  const { error } = await service.storage
    .from("products")
    .upload(key, file, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data } = service.storage.from("products").getPublicUrl(key);
  return { url: data.publicUrl };
}
