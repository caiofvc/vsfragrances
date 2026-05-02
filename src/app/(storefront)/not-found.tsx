import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-edge py-32 text-center space-y-6">
      <span className="gold-rule">404</span>
      <h1 className="heading-display text-5xl">Página não encontrada</h1>
      <p className="text-gray-mid max-w-md mx-auto">
        O link que você seguiu pode estar quebrado ou esta página foi removida.
      </p>
      <Link href="/" className="btn-primary">
        Voltar ao início
      </Link>
    </section>
  );
}
