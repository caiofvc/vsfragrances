export type Gender = "masculino" | "feminino" | "unissex";

export type OlfactoryFamily =
  | "amadeirado"
  | "citrico"
  | "floral"
  | "oriental"
  | "aromatico"
  | "doce"
  | "frutal";

export interface ProductVariant {
  id: string;
  sizeMl: number;
  priceCents: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  inspiration: string;
  description: string;
  family: OlfactoryFamily;
  gender: Gender;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  imageUrl: string;
  featured: boolean;
  variants: ProductVariant[];
}
