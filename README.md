# Vasconcelos Fragrances — E-commerce

Storefront premium de perfumaria contratipo. Stack: **Next.js 15 (App Router) + TypeScript + Tailwind + Supabase + InfinitePay**.

## Setup local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sem `.env.local` o site já roda usando o catálogo de exemplo
(`src/lib/catalog/sample-data.ts`) e o checkout entra em "modo simulação".

## Estrutura

```
src/
  app/                 # rotas (App Router)
    page.tsx           # home
    perfumes/          # listagem + filtros
    perfumes/[slug]/   # página de produto
    checkout/          # checkout + página de sucesso
    api/checkout/      # POST inicia pagamento
  components/
    brand/             # wordmark
    layout/            # header, footer
    cart/              # drawer e botão
    product/           # card e painel de compra
  lib/
    catalog/           # tipos, queries, sample data
    cart/              # store Zustand persistida
    payments/          # wrapper InfinitePay
    supabase/          # clients (browser e server)
supabase/schema.sql    # rodar no Supabase Dashboard → SQL Editor
```

## Identidade visual

Tokens estão em `tailwind.config.ts` e `src/app/globals.css`:

- `offwhite` `#F5F2ED`, `ink` `#1A1A1A`, `gold` `#C6A25A`
- Fontes: Playfair Display (títulos), Cinzel (wordmark), Montserrat (UI)
- Regra: 70% claro / 20% preto / 10% dourado — nunca exagerar no dourado.

## Configuração obrigatória do Supabase Auth

Para que login e recuperação de senha funcionem, no Supabase Dashboard:

1. **Authentication → URL Configuration**
   - **Site URL**: `http://localhost:3000` (em produção, troque pela URL final).
   - **Redirect URLs** (adicione todas):
     - `http://localhost:3000/auth/callback`
     - `https://seu-dominio.com/auth/callback` (quando entrar em produção)

2. **Authentication → Providers → Email**: deixe **Email** habilitado.
   Para desenvolvimento local, deixe **Confirm email** desligado para os
   primeiros admins (assim o usuário entra sem precisar confirmar e-mail).

3. **Authentication → Email Templates → Reset Password**: o template padrão já
   funciona. Confira que o link contém `{{ .ConfirmationURL }}`.

4. Crie o primeiro admin: **Authentication → Users → Add user → Create new
   user** (marque _Auto Confirm User_), depois rode no SQL Editor:
   ```sql
   insert into public.admins (user_id, full_name)
   values ('cole-o-uuid', 'Seu Nome');
   ```

## Próximos passos sugeridos

1. Pegar credenciais da **InfinitePay** (`INFINITEPAY_HANDLE`, `INFINITEPAY_API_KEY`) e ativar a chamada real em `src/lib/payments/infinitepay.ts`.
2. Persistir pedidos no Supabase em `src/app/api/checkout/route.ts` (TODO marcado no arquivo).
3. Implementar webhook de confirmação de pagamento da InfinitePay em `/api/webhooks/infinitepay`.
4. Cálculo de frete real (Correios/Melhor Envio).
