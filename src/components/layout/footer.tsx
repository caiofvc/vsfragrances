import Link from "next/link";
import { Instagram } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";

const cols: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Catálogo",
    links: [
      { href: "/perfumes", label: "Todos os perfumes" },
      { href: "/perfumes?gender=masculino", label: "Masculino" },
      { href: "/perfumes?gender=feminino", label: "Feminino" },
      { href: "/perfumes?gender=unissex", label: "Unissex" },
    ],
  },
  {
    title: "Atendimento",
    links: [
      { href: "/contato", label: "Fale conosco" },
      { href: "/trocas-e-devolucoes", label: "Trocas e devoluções" },
      { href: "/entrega", label: "Prazos e envio" },
      { href: "/faq", label: "Dúvidas frequentes" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { href: "/sobre", label: "A marca" },
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Privacidade" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/8 bg-offwhite">
      <div className="container-edge py-16 grid gap-12 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div className="space-y-5">
          <Wordmark className="text-[20px]" />
          <p className="text-sm leading-relaxed text-gray-mid max-w-xs">
            Fragrâncias inspiradas em grandes sucessos.
            <br />
            Alta fixação, presença marcante e elegância em cada detalhe.
          </p>
          <a
            href="https://instagram.com"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ink hover:text-gold transition-colors duration-300 ease-premium"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.4} />
            @vasconcelosfragrances
          </a>
        </div>

        {cols.map((col) => (
          <nav key={col.title} className="space-y-4">
            <div className="text-[11px] uppercase tracking-[0.28em] text-gold">
              {col.title}
            </div>
            <ul className="space-y-2.5 text-sm text-ink/80">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-gold transition-colors duration-300 ease-premium"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-ink/8">
        <div className="container-edge py-6 flex flex-col md:flex-row gap-2 md:items-center md:justify-between text-[11px] uppercase tracking-[0.22em] text-gray-mid">
          <span>
            © {new Date().getFullYear()} Vasconcelos Fragrances · Todos os
            direitos reservados
          </span>
          <span>Pagamento seguro · Pix · Cartão em até 12x</span>
        </div>
      </div>
    </footer>
  );
}
