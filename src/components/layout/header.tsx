import Link from "next/link";
import { Search, User } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { CartButton } from "@/components/cart/cart-button";

const NAV = [
  { href: "/perfumes", label: "Perfumes" },
  { href: "/perfumes?gender=masculino", label: "Masculino" },
  { href: "/perfumes?gender=feminino", label: "Feminino" },
  { href: "/perfumes?gender=unissex", label: "Unissex" },
  { href: "/sobre", label: "A marca" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-offwhite/85 backdrop-blur supports-[backdrop-filter]:bg-offwhite/70 border-b border-ink/8">
      <div className="container-edge flex items-center justify-between py-5">
        <div className="flex-1 hidden md:flex">
          <nav className="flex gap-7 text-[11px] uppercase tracking-[0.22em] text-ink/80">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors duration-300 ease-premium hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="shrink-0" aria-label="Início">
          <Wordmark className="text-[18px]" variant="full" />
        </Link>

        <div className="flex-1 flex items-center justify-end gap-5 text-ink/80">
          <button
            type="button"
            aria-label="Buscar"
            className="hidden sm:inline-flex transition-colors duration-300 ease-premium hover:text-gold"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
          </button>
          <Link
            href="/conta"
            aria-label="Minha conta"
            className="hidden sm:inline-flex transition-colors duration-300 ease-premium hover:text-gold"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={1.4} />
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
