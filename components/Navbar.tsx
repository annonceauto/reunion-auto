'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';

const EMAIL_ADMIN = 'priscilla.coulibaly@gmail.com';

export default function Navbar() {
  const [connecte, setConnecte] = useState(false);
  const [estAdmin, setEstAdmin] = useState(false);
  const [aValider, setAValider] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function verifier(email?: string | null) {
      if (email === EMAIL_ADMIN) {
        setEstAdmin(true);
        const { count } = await supabase
          .from('listings')
          .select('id', { count: 'exact', head: true })
          .eq('moderation_statut', 'a_verifier');
        setAValider(count ?? 0);
      } else {
        setEstAdmin(false);
      }
    }
    supabase.auth.getUser().then(({ data }) => {
      setConnecte(!!data.user);
      verifier(data.user?.email);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setConnecte(!!session?.user);
      verifier(session?.user?.email);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-basalte/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-4">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <Link
            href="/comment-ca-marche"
            className="hidden text-sm text-vanille/70 hover:text-vanille md:block"
          >
            Comment ça marche
          </Link>
          {connecte ? (
            <>
              {estAdmin && (
                <Link
                  href="/moderation"
                  className="flex items-center gap-1 rounded-full border border-fournaise/40 bg-fournaise/10 px-3 py-1.5 text-sm font-semibold text-fournaise"
                >
                  🔔 Modération {aValider > 0 && `(${aValider})`}
                </Link>
              )}
              <details className="group relative hidden sm:block">
                <summary className="cursor-pointer list-none text-sm text-vanille/70 hover:text-vanille">
                  Mon compte ▾
                </summary>
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-basalte2 p-2 shadow-lg shadow-black/30">
                  <Link
                    href="/mes-annonces"
                    className="block rounded-xl px-3 py-2 text-sm text-vanille/80 hover:bg-white/5 hover:text-vanille"
                  >
                    Mes annonces
                  </Link>
                  <Link
                    href="/mes-favoris"
                    className="block rounded-xl px-3 py-2 text-sm text-vanille/80 hover:bg-white/5 hover:text-vanille"
                  >
                    Mes favoris
                  </Link>
                  <span className="block cursor-not-allowed rounded-xl px-3 py-2 text-sm text-vanille/30">
                    Mes recherches (bientôt)
                  </span>
                  <span className="block cursor-not-allowed rounded-xl px-3 py-2 text-sm text-vanille/30">
                    Mes alertes (bientôt)
                  </span>
                  <Link
                    href="/mon-profil"
                    className="block rounded-xl px-3 py-2 text-sm text-vanille/80 hover:bg-white/5 hover:text-vanille"
                  >
                    Mon profil
                  </Link>
                  <Link
                    href="/mon-solde"
                    className="block rounded-xl px-3 py-2 text-sm text-vanille/80 hover:bg-white/5 hover:text-vanille"
                  >
                    Mon solde
                  </Link>
                </div>
              </details>
              <Link
                href="/creer-annonce"
                className="rounded-full bg-fournaise px-4 py-2 text-sm font-semibold text-vanille transition hover:bg-fournaise/90"
              >
                Déposer une annonce
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
                className="text-sm text-vanille/40 hover:text-vanille/70"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="rounded-full border border-lagon/40 px-4 py-2 text-sm font-semibold text-lagon transition hover:bg-lagon/10"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded-full bg-lagon px-4 py-2 text-sm font-semibold text-basalte transition hover:bg-lagon2"
              >
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
