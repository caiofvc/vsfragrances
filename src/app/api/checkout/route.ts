import { NextResponse } from "next/server";
import { createInfinitePayCheckout } from "@/lib/payments/infinitepay";

interface IncomingItem {
  variantId: string;
  productName: string;
  sizeMl: number;
  unitPriceCents: number;
  quantity: number;
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    customer: { name: string; email: string; phone?: string };
    items: IncomingItem[];
    shippingCents?: number;
  };

  if (!body.customer?.email || !body.customer?.name) {
    return NextResponse.json(
      { error: "Dados do cliente incompletos." },
      { status: 400 },
    );
  }

  if (!body.items?.length) {
    return NextResponse.json(
      { error: "Sacola vazia." },
      { status: 400 },
    );
  }

  const subtotal = body.items.reduce(
    (sum, i) => sum + i.unitPriceCents * i.quantity,
    0,
  );
  const total = subtotal + (body.shippingCents ?? 0);

  // TODO: persistir o pedido no Supabase (tabela orders + order_items) usando
  // a service-role-key. O MVP segue sem persistência por enquanto.
  const orderId = `VSF-${Date.now()}`;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const result = await createInfinitePayCheckout({
    orderId,
    customer: body.customer,
    items: body.items.map((i) => ({
      name: `${i.productName} ${i.sizeMl}ml`,
      quantity: i.quantity,
      unitPriceCents: i.unitPriceCents,
    })),
    totalCents: total,
    redirectUrl: `${siteUrl}/checkout/sucesso`,
  });

  return NextResponse.json({
    orderId,
    paymentUrl: result.paymentUrl,
    simulated: result.simulated,
    totalCents: total,
  });
}
