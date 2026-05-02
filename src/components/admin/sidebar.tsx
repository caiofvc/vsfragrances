"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, Receipt, LogOut, Store } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { logoutAction } from "@/app/admin/login/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Visão geral", icon: LayoutGrid, exact: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: Receipt },
];

export function Sidebar({
  email,
  fullName,
}: {
  email: string;
  fullName: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-ink text-offwhite/80 flex flex-col min-h-screen">
      <div className="px-7 pt-9 pb-7 border-b border-offwhite/10">
        <Wordmark className="text-[16px] [&_*]:!text-offwhite [&_.text-gold]:!text-gold" />
      </div>

      <nav className="flex-1 py-7 px-3 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-[12px] uppercase tracking-[0.18em] transition-colors duration-300 ease-premium",
                active
                  ? "bg-offwhite/8 text-gold border-l-2 border-gold"
                  : "text-offwhite/65 hover:text-offwhite hover:bg-offwhite/5 border-l-2 border-transparent",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3 space-y-1 border-t border-offwhite/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-offwhite/65 hover:text-gold transition-colors duration-300 ease-premium"
        >
          <Store className="h-4 w-4" strokeWidth={1.5} />
          Ver loja
        </Link>
      </div>

      <div className="border-t border-offwhite/10 px-7 py-5">
        <p className="text-sm text-offwhite truncate">
          {fullName ?? email.split("@")[0]}
        </p>
        <p className="text-[11px] text-offwhite/50 truncate">{email}</p>
        <form action={logoutAction} className="mt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-offwhite/55 hover:text-gold transition-colors duration-300 ease-premium"
          >
            <LogOut className="h-3 w-3" strokeWidth={1.5} />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
