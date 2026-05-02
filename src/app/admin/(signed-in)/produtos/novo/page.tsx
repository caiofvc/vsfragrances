import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="Catálogo · Novo"
        title="Cadastrar perfume"
        description="Preencha as informações principais. Cadastre as variantes (tamanhos) depois de salvar."
      />
      <ProductForm action={createProductAction} submitLabel="Criar produto" />
    </>
  );
}
