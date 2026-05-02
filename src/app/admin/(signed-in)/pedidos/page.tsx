import { PageHeader } from "@/components/admin/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/utils";

interface OrderRow {
  id: string;
  status: string;
  customer_name: string;
  customer_email: string;
  total_cents: number;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando",
  paid: "Pago",
  processing: "Em separação",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado",
  refunded: "Estornado",
};

const STATUS_TONE: Record<string, string> = {
  pending: "text-gray-mid",
  paid: "text-gold",
  processing: "text-gold",
  shipped: "text-ink",
  delivered: "text-ink",
  canceled: "text-red-700",
  refunded: "text-red-700",
};

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select("id, status, customer_name, customer_email, total_cents, created_at")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as OrderRow[];

  return (
    <>
      <PageHeader
        eyebrow="Operação"
        title="Pedidos"
        description="Acompanhe os pedidos recebidos pela loja."
      />

      {orders.length === 0 ? (
        <div className="bg-white border border-ink/10 p-16 text-center space-y-3">
          <span className="gold-rule">Sem pedidos</span>
          <p className="font-display text-2xl">Nada por aqui ainda</p>
          <p className="text-sm text-gray-mid max-w-md mx-auto">
            Os pedidos aparecerão aqui assim que a integração com a InfinitePay
            for ativada e o primeiro cliente finalizar uma compra.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-ink/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-offwhite">
              <tr className="text-left">
                <Th>Pedido</Th>
                <Th>Cliente</Th>
                <Th>Data</Th>
                <Th className="text-right">Total</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-ink/8 hover:bg-offwhite/50 transition-colors"
                >
                  <Td className="font-mono text-xs text-ink/80">
                    {o.id.slice(0, 8)}
                  </Td>
                  <Td>
                    <p className="text-ink">{o.customer_name}</p>
                    <p className="text-xs text-gray-mid">
                      {o.customer_email}
                    </p>
                  </Td>
                  <Td className="text-gray-mid">
                    {new Date(o.created_at).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Td>
                  <Td className="text-right tabular-nums">
                    {formatBRL(o.total_cents)}
                  </Td>
                  <Td>
                    <span
                      className={`text-[11px] uppercase tracking-[0.18em] ${STATUS_TONE[o.status] ?? "text-ink"}`}
                    >
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-5 py-4 text-[10px] uppercase tracking-[0.22em] font-medium text-gray-mid ${className ?? ""}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-5 py-4 align-middle ${className ?? ""}`}>{children}</td>;
}
