import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <p className="font-display text-6xl text-lagon">404</p>
      <h1 className="mt-4 font-display text-2xl text-vanille">Page introuvable</h1>
      <p className="mt-2 text-vanille/60">
        Cette page n&apos;existe pas ou l&apos;annonce a peut-être expiré.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
