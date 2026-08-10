import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-basalte2/50 px-5 py-8 text-sm text-vanille/50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Annonce Auto.re</p>
        <nav className="flex flex-wrap gap-5">
          <Link href="/comment-ca-marche" className="hover:text-vanille">
            Comment ça marche
          </Link>
          <Link href="/voiture-occasion" className="hover:text-vanille">
            Voitures par ville
          </Link>
          <Link href="/vendre-voiture-reunion" className="hover:text-vanille">
            Guide : vendre sa voiture
          </Link>
          <Link href="/acheter-voiture-reunion" className="hover:text-vanille">
            Guide : acheter sa voiture
          </Link>
          <Link href="/contact" className="hover:text-vanille">
            Contact & FAQ
          </Link>
          <Link href="/mentions-legales" className="hover:text-vanille">
            Mentions légales
          </Link>
          <Link href="/cgu" className="hover:text-vanille">
            CGU
          </Link>
          <Link href="/politique-confidentialite" className="hover:text-vanille">
            Confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
