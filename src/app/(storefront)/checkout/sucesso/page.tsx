import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface Props {
  searchParams: Promise<{ status?: string; order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { status, order } = await searchParams;
  const simulated = status === "simulated";

  return (
    <section className="container-edge py-24 text-center max-w-xl mx-auto space-y-5">
      <CheckCircle2
        className="h-12 w-12 text-gold mx-auto"
        strokeWidth={1.2}
      />
      <span className="gold-rule">Pedido recebido</span>
      <h1 className="heading-display text-4xl md:text-5xl">
        Obrigado pela compra
      </h1>
      <p className="text-gray-mid">
        Acompanhe os próximos passos pelo e-mail. Seu perfume já está sendo
        preparado com o cuidado de quem entende de presença.
      </p>
      {order && (
        <p className="label-tech">
          Pedido <span className="text-ink">{order}</span>
        </p>
      )}
      {simulated && (
        <p className="text-xs text-gray-mid italic max-w-md mx-auto bg-offwhite border border-gold/30 px-4 py-3">
          Modo simulação: a integração com InfinitePay ainda não foi ativada.
          Configure <code>INFINITEPAY_HANDLE</code> e{" "}
          <code>INFINITEPAY_API_KEY</code> no <code>.env.local</code> para
          processar pagamentos reais.
        </p>
      )}
      <div className="pt-4">
        <Link href="/perfumes" className="btn-ghost">
          Continuar comprando
        </Link>
      </div>
    </section>
  );
}
