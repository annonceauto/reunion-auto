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
        <div className="flex items-center gap-4">
          
                        <a href="https://www.instagram.com/annonce_auto.re/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Annonce Auto.re sur Instagram"
            className="hover:text-vanille"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
                      <a href="https://www.facebook.com/profile.php?id=61593048629729"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Annonce Auto.re sur Facebook"
            className="hover:text-vanille"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M22 12.061C22 6.505 17.523 2 12 2S2 6.505 2 12.061c0 5.022 3.657 9.184 8.438 9.939v-7.03H7.898v-2.909h2.54V9.845c0-2.526 1.492-3.921 3.777-3.921 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.884h2.773l-.443 2.91h-2.33V22c4.78-.755 8.437-4.917 8.437-9.939z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
