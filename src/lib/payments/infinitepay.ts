/**
 * InfinitePay — wrapper de checkout.
 *
 * Documentação: https://docs.infinitepay.io
 *
 * Modo recomendado para MVP: Checkout Link (gera URL hospedada da
 * InfinitePay, sem PCI no nosso servidor). Quando ativar, preencha
 * INFINITEPAY_HANDLE e INFINITEPAY_API_KEY no .env.
 *
 * Esta função é um placeholder controlado: enquanto não houver credenciais,
 * o checkout opera em "modo simulação" para o MVP rodar end-to-end.
 */
export interface CheckoutItem {
  name: string;
  quantity: number;
  unitPriceCents: number;
}

export interface CheckoutPayload {
  orderId: string;
  customer: { name: string; email: string; phone?: string };
  items: CheckoutItem[];
  totalCents: number;
  redirectUrl: string;
}

export interface CheckoutResult {
  paymentUrl: string;
  reference: string;
  simulated: boolean;
}

export async function createInfinitePayCheckout(
  payload: CheckoutPayload,
): Promise<CheckoutResult> {
  const handle = process.env.INFINITEPAY_HANDLE;
  const apiKey = process.env.INFINITEPAY_API_KEY;

  if (!handle || !apiKey) {
    return {
      paymentUrl: `${payload.redirectUrl}?status=simulated&order=${payload.orderId}`,
      reference: `SIM-${payload.orderId}`,
      simulated: true,
    };
  }

  // TODO: trocar pela chamada real à InfinitePay quando as credenciais
  // estiverem em mãos. Estrutura esperada (referência):
  //
  // const res = await fetch(`https://api.infinitepay.io/checkout/links`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${apiKey}`,
  //   },
  //   body: JSON.stringify({
  //     handle,
  //     order_nsu: payload.orderId,
  //     amount: payload.totalCents,
  //     items: payload.items.map((i) => ({
  //       description: i.name,
  //       quantity: i.quantity,
  //       price: i.unitPriceCents,
  //     })),
  //     customer: payload.customer,
  //     redirect_url: payload.redirectUrl,
  //   }),
  // });
  // const data = await res.json();
  // return { paymentUrl: data.url, reference: data.id, simulated: false };

  return {
    paymentUrl: `${payload.redirectUrl}?status=simulated&order=${payload.orderId}`,
    reference: `SIM-${payload.orderId}`,
    simulated: true,
  };
}
