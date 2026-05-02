"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { ImagePlus, Loader2, Save } from "lucide-react";
import {
  uploadProductImageAction,
  type ProductActionState,
} from "@/app/admin/(signed-in)/produtos/actions";

const FAMILIES = [
  ["amadeirado", "Amadeirado"],
  ["citrico", "Cítrico"],
  ["floral", "Floral"],
  ["oriental", "Oriental"],
  ["aromatico", "Aromático"],
  ["doce", "Doce"],
  ["frutal", "Frutal"],
] as const;

const GENDERS = [
  ["masculino", "Masculino"],
  ["feminino", "Feminino"],
  ["unissex", "Unissex"],
] as const;

export interface ProductFormDefaults {
  name?: string;
  slug?: string;
  inspiration?: string;
  description?: string;
  family?: string;
  gender?: string;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  imageUrl?: string;
  featured?: boolean;
}

interface Props {
  action: (
    prev: ProductActionState,
    formData: FormData,
  ) => Promise<ProductActionState>;
  defaults?: ProductFormDefaults;
  submitLabel?: string;
}

const initialState: ProductActionState = {};

export function ProductForm({
  action,
  defaults = {},
  submitLabel = "Salvar produto",
}: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(defaults.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onUpload = async (file: File) => {
    setUploadError(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadProductImageAction(fd);
    setUploading(false);
    if (res.error) {
      setUploadError(res.error);
      return;
    }
    if (res.url) setImageUrl(res.url);
  };

  return (
    <form action={formAction} className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
      <div className="space-y-7">
        <Field
          label="Nome do perfume"
          name="name"
          defaultValue={defaults.name}
          error={state.fieldErrors?.name}
          placeholder="Silver Line"
        />

        <Field
          label="Slug"
          name="slug"
          defaultValue={defaults.slug}
          error={state.fieldErrors?.slug}
          placeholder="silver-line"
          hint="Identificador na URL (gerado a partir do nome se vazio)."
        />

        <Field
          label="Inspiração"
          name="inspiration"
          defaultValue={defaults.inspiration}
          error={state.fieldErrors?.inspiration}
          placeholder="Inspirado em Silver Scent — Jacques Bogart"
        />

        <TextArea
          label="Descrição"
          name="description"
          defaultValue={defaults.description}
          error={state.fieldErrors?.description}
          rows={4}
          placeholder="Frescor metálico com lastro amadeirado..."
        />

        <div className="grid sm:grid-cols-2 gap-6">
          <Select
            label="Família olfativa"
            name="family"
            options={FAMILIES}
            defaultValue={defaults.family ?? ""}
            error={state.fieldErrors?.family}
          />
          <Select
            label="Gênero"
            name="gender"
            options={GENDERS}
            defaultValue={defaults.gender ?? ""}
            error={state.fieldErrors?.gender}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <NotesInput
            label="Notas de topo"
            name="topNotes"
            defaultValue={defaults.topNotes}
          />
          <NotesInput
            label="Notas de coração"
            name="heartNotes"
            defaultValue={defaults.heartNotes}
          />
          <NotesInput
            label="Notas de fundo"
            name="baseNotes"
            defaultValue={defaults.baseNotes}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={defaults.featured}
            className="h-4 w-4 accent-ink"
          />
          <span className="label-tech">Destacar este perfume na home</span>
        </label>

        {state.error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-3">
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Save className="h-4 w-4" strokeWidth={1.5} />
            )}
            {pending ? "Salvando…" : submitLabel}
          </button>
          <Link href="/admin/produtos" className="btn-ghost">
            Cancelar
          </Link>
        </div>
      </div>

      <aside className="space-y-4">
        <span className="label-tech">Imagem do produto</span>
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <div className="relative aspect-[4/5] w-full bg-gray-soft/30 border border-ink/10 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Pré-visualização"
              fill
              sizes="320px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-mid">
              <ImagePlus className="h-8 w-8" strokeWidth={1.2} />
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-ghost w-full"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <ImagePlus className="h-4 w-4" strokeWidth={1.5} />
          )}
          {uploading
            ? "Enviando…"
            : imageUrl
              ? "Substituir imagem"
              : "Enviar imagem"}
        </button>
        <p className="text-[11px] text-gray-mid">
          JPG, PNG ou WebP até 5MB. Recomendado 1200×1500px (4:5).
        </p>
        {uploadError && (
          <p className="text-xs text-red-700">{uploadError}</p>
        )}
        {state.fieldErrors?.imageUrl && (
          <p className="text-xs text-red-700">{state.fieldErrors.imageUrl}</p>
        )}
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  error,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="label-tech">{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-b border-ink/20 py-2.5 text-base text-ink placeholder:text-gray-mid/70 focus:outline-none focus:border-gold transition-colors duration-300 ease-premium"
      />
      {hint && <p className="text-[11px] text-gray-mid mt-1.5">{hint}</p>}
      {error && <p className="text-xs text-red-700 mt-1.5">{error}</p>}
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  error,
  rows = 3,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label-tech">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-b border-ink/20 py-2.5 text-base text-ink placeholder:text-gray-mid/70 focus:outline-none focus:border-gold transition-colors duration-300 ease-premium resize-y"
      />
      {error && <p className="text-xs text-red-700 mt-1.5">{error}</p>}
    </label>
  );
}

function Select({
  label,
  name,
  options,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  options: ReadonlyArray<readonly [string, string]>;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="label-tech">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full bg-transparent border-b border-ink/20 py-2.5 text-base text-ink focus:outline-none focus:border-gold transition-colors duration-300 ease-premium"
      >
        <option value="" disabled>
          Selecione…
        </option>
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-700 mt-1.5">{error}</p>}
    </label>
  );
}

function NotesInput({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string[];
}) {
  return (
    <label className="block">
      <span className="label-tech">{label}</span>
      <textarea
        name={name}
        rows={3}
        defaultValue={defaultValue?.join(", ")}
        placeholder="Bergamota, Limão siciliano…"
        className="mt-2 w-full bg-transparent border border-ink/15 py-2 px-3 text-sm text-ink placeholder:text-gray-mid/70 focus:outline-none focus:border-gold transition-colors duration-300 ease-premium resize-y"
      />
      <p className="text-[11px] text-gray-mid mt-1">
        Separe por vírgulas ou linhas.
      </p>
    </label>
  );
}
