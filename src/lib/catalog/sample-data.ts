import type { Product } from "./types";

const variantsFor = (basePriceCents: number, baseSku: string) => [
  {
    id: `${baseSku}-30`,
    sizeMl: 30,
    priceCents: Math.round(basePriceCents * 0.55),
    stock: 24,
    sku: `${baseSku}-030`,
  },
  {
    id: `${baseSku}-50`,
    sizeMl: 50,
    priceCents: Math.round(basePriceCents * 0.78),
    stock: 18,
    sku: `${baseSku}-050`,
  },
  {
    id: `${baseSku}-100`,
    sizeMl: 100,
    priceCents: basePriceCents,
    stock: 12,
    sku: `${baseSku}-100`,
  },
];

const heroImage =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80";
const altImageA =
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80";
const altImageB =
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80";
const altImageC =
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80";

export const sampleProducts: Product[] = [
  {
    id: "vsf-001",
    slug: "silver-line",
    name: "Silver Line",
    inspiration: "Inspirado em Silver Scent — Jacques Bogart",
    description:
      "Frescor metálico com lastro amadeirado. Uma assinatura discreta para quem entra antes de ser anunciado.",
    family: "amadeirado",
    gender: "masculino",
    topNotes: ["Bergamota", "Limão siciliano", "Cardamomo"],
    heartNotes: ["Lavanda", "Gengibre", "Folhas verdes"],
    baseNotes: ["Cedro", "Almíscar branco", "Vetiver"],
    imageUrl: heroImage,
    featured: true,
    variants: variantsFor(28900, "VSF-001"),
  },
  {
    id: "vsf-002",
    slug: "ice-mountain",
    name: "Ice Mountain",
    inspiration: "Inspirado em Cool Water — Davidoff",
    description:
      "Brisa marinha sobre pedra molhada. Frescor cristalino que permanece o dia inteiro.",
    family: "aromatico",
    gender: "masculino",
    topNotes: ["Hortelã", "Lavanda", "Acordes marinhos"],
    heartNotes: ["Gerânio", "Sálvia", "Jasmim"],
    baseNotes: ["Tabaco", "Cedro", "Âmbar"],
    imageUrl: altImageA,
    featured: true,
    variants: variantsFor(26900, "VSF-002"),
  },
  {
    id: "vsf-003",
    slug: "noir-elixir",
    name: "Noir Elixir",
    inspiration: "Inspirado em Black Orchid — Tom Ford",
    description:
      "Orquídea escura, trufa e baunilha. Uma fragrância densa, magnética, à beira do proibido.",
    family: "oriental",
    gender: "unissex",
    topNotes: ["Trufa negra", "Bergamota", "Cassis"],
    heartNotes: ["Orquídea negra", "Frutas vermelhas", "Especiarias"],
    baseNotes: ["Patchouli", "Baunilha", "Sândalo"],
    imageUrl: altImageB,
    featured: true,
    variants: variantsFor(34900, "VSF-003"),
  },
  {
    id: "vsf-004",
    slug: "oud-imperial",
    name: "Oud Imperial",
    inspiration: "Inspirado em Oud Wood — Tom Ford",
    description:
      "Madeiras nobres em equilíbrio com especiarias. Discreto, mas inesquecível.",
    family: "amadeirado",
    gender: "unissex",
    topNotes: ["Pau-rosa", "Cardamomo", "Pimenta chinesa"],
    heartNotes: ["Oud", "Sândalo", "Vetiver"],
    baseNotes: ["Tonka", "Âmbar", "Almíscar"],
    imageUrl: altImageC,
    featured: true,
    variants: variantsFor(38900, "VSF-004"),
  },
  {
    id: "vsf-005",
    slug: "rose-de-marbella",
    name: "Rose de Marbella",
    inspiration: "Inspirado em Rose 31 — Le Labo",
    description:
      "A rosa redesenhada — esfumada, especiada, longe do óbvio. Sensual sem rodeios.",
    family: "floral",
    gender: "unissex",
    topNotes: ["Cominho", "Pimenta", "Bergamota"],
    heartNotes: ["Rosa de maio", "Olíbano", "Guaiac"],
    baseNotes: ["Cedro", "Almíscar", "Âmbar"],
    imageUrl: heroImage,
    featured: false,
    variants: variantsFor(31900, "VSF-005"),
  },
  {
    id: "vsf-006",
    slug: "blue-icon",
    name: "Blue Icon",
    inspiration: "Inspirado em Bleu de Chanel — Chanel",
    description:
      "Cítrico amadeirado de presença afiada. O perfume universal feito para qualquer ocasião.",
    family: "amadeirado",
    gender: "masculino",
    topNotes: ["Toranja", "Limão", "Pimenta rosa"],
    heartNotes: ["Gengibre", "Noz-moscada", "Jasmim"],
    baseNotes: ["Incenso", "Cedro do Atlas", "Sândalo"],
    imageUrl: altImageA,
    featured: true,
    variants: variantsFor(29900, "VSF-006"),
  },
  {
    id: "vsf-007",
    slug: "amber-saint",
    name: "Amber Saint",
    inspiration: "Inspirado em Santal 33 — Le Labo",
    description:
      "Sândalo cremoso sobre couro suave. Caloroso, aconchegante, viciante.",
    family: "amadeirado",
    gender: "unissex",
    topNotes: ["Cardamomo", "Iris", "Violeta"],
    heartNotes: ["Sândalo australiano", "Cedro virgínia", "Couro"],
    baseNotes: ["Almíscar", "Âmbar", "Papiro"],
    imageUrl: altImageB,
    featured: false,
    variants: variantsFor(32900, "VSF-007"),
  },
  {
    id: "vsf-008",
    slug: "white-lily",
    name: "White Lily",
    inspiration: "Inspirado em J'adore — Dior",
    description:
      "Buquê solar e luminoso. Feminilidade contemporânea, sem clichês florais.",
    family: "floral",
    gender: "feminino",
    topNotes: ["Pera", "Magnólia", "Mandarina"],
    heartNotes: ["Jasmim sambac", "Tuberosa", "Rosa"],
    baseNotes: ["Almíscar", "Cedro", "Baunilha"],
    imageUrl: altImageC,
    featured: false,
    variants: variantsFor(27900, "VSF-008"),
  },
  {
    id: "vsf-009",
    slug: "midnight-sugar",
    name: "Midnight Sugar",
    inspiration: "Inspirado em La Vie Est Belle — Lancôme",
    description:
      "Doce gourmand com lastro de íris e patchouli. Brilho noturno, açúcar com aresta.",
    family: "doce",
    gender: "feminino",
    topNotes: ["Pera", "Cassis", "Bergamota"],
    heartNotes: ["Iris", "Jasmim", "Flor de laranjeira"],
    baseNotes: ["Praliné", "Patchouli", "Baunilha"],
    imageUrl: heroImage,
    featured: false,
    variants: variantsFor(28900, "VSF-009"),
  },
  {
    id: "vsf-010",
    slug: "citrus-noir",
    name: "Citrus Noir",
    inspiration: "Inspirado em Sauvage Elixir — Dior",
    description:
      "Citrus afiado sobre especiarias densas e licorosas. Magnetismo absoluto.",
    family: "citrico",
    gender: "masculino",
    topNotes: ["Toranja", "Canela", "Cardamomo"],
    heartNotes: ["Lavanda", "Alcaçuz", "Noz-moscada"],
    baseNotes: ["Sândalo", "Patchouli", "Âmbar"],
    imageUrl: altImageA,
    featured: true,
    variants: variantsFor(36900, "VSF-010"),
  },
];
