import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ListingCard from '@/components/ListingCard';
import BoutonRetour from '@/components/BoutonRetour';
import { COMMUNES_COORDS, slugCommune, communeParSlug, distanceKm } from '@/lib/communes-reunion';
import { jsonLdBreadcrumb } from '@/lib/breadcrumb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function generateStaticParams() {
  return COMMUNES_COORDS.map((c) => ({ commune: slugCommune(c.ville) }));
}

export async function generateMetadata({
  params,
}: {
  params: { commune: string };
}): Promise<Metadata> {
  const commune = communeParSlug(params.commune);
  if (!commune) return { title: 'Commune introuvable' };

  return {
    title: `Voiture d'occasion à ${commune.ville} (${commune.cp}) — La Réunion`,
    description: `Annonces de voitures d'occasion à ${commune.ville} et alentours, avec vidéo vérifiée pour chaque véhicule. Achète ou vends ta voiture à ${commune.ville} sur Annonce Auto.re.`,
    alternates: { canonical: `/voiture-occasion/${params.commune}` },
  };
}

export default async function VoitureOccasionCommune({
  params,
}: {
  params: { commune: string };
}) {
  const commune = communeParSlug(params.commune);
  if (!commune) notFound();

  const supabase = createClient();
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('statut', 'en_ligne')
    .eq('moderation_statut', 'valide')
    .eq('commune', commune.ville)
    .order('boost', { ascending: false })
    .order('created_at', { ascending: false });

  const communesProches = COMMUNES_COORDS.filter((c) => c.ville !== commune.ville)
    .map((c) => ({ ...c, distance: distanceKm(commune.lat, commune.lng, c.lat, c.lng) }))
    .sort((a, b) => a.distance - b.distance);

  const jsonLd = jsonLdBreadcrumb([
    { name: 'Accueil', url: 'https://annonce-auto.re' },
    { name: "Voiture d'occasion à La Réunion", url: 'https://annonce-auto.re/voiture-occasion' },
    { name: commune.ville, url: `https://annonce-auto.re/voiture-occasion/${params.commune}` },
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl text-vanille/80">
        <BoutonRetour />
        <h1 className="font-display text-2xl text-vanille sm:text-3xl">
          Voiture d&apos;occasion à {commune.ville}
        </h1>
        <p className="mt-2 text-sm text-vanille/60">
          Annonces de véhicules d&apos;occasion publiées à {commune.ville} ({commune.cp}) et dans
          les communes voisines de La Réunion, dont {communesProches[0]?.ville} (à environ{' '}
          {Math.round(communesProches[0]?.distance ?? 0)} km) et {communesProches[1]?.ville} (à
          environ {Math.round(communesProches[1]?.distance ?? 0)} km). Chaque annonce peut inclure
          une courte vidéo du véhicule, filmée par le vendeur, pour éviter les mauvaises
          surprises.
        </p>
      </div>

      <div className="mt-8">
        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-basalte2 p-8 text-center text-vanille/60">
            <p>
              Aucune annonce en ligne à {commune.ville} pour l&apos;instant. De nouvelles annonces
              sont ajoutées régulièrement à La Réunion.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/mes-alertes"
                className="rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2"
              >
                Être averti d&apos;une nouvelle annonce
              </Link>
              <Link
                href="/"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-vanille/80 hover:border-lagon"
              >
                Voir toutes les annonces à La Réunion
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-lagon/30 bg-lagon/5 p-6 text-center">
        <h2 className="font-display text-lg text-vanille">
          Tu vends une voiture à {commune.ville} ?
        </h2>
        <p className="mt-2 text-sm text-vanille/70">
          Ta première annonce est gratuite, avec possibilité d&apos;ajouter une vidéo vérifiée.
        </p>
        <Link
          href="/creer-annonce"
          className="mt-4 inline-block rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2"
        >
          Déposer mon annonce
        </Link>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <h2 className="font-display text-sm text-vanille/60">
          Communes voisines de {commune.ville}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {communesProches.map((c) => (
            <Link
              key={c.ville}
              href={`/voiture-occasion/${slugCommune(c.ville)}`}
              title={`À environ ${Math.round(c.distance)} km de ${commune.ville}`}
              className="rounded-full border border-white/10 bg-basalte2 px-3 py-1.5 text-xs text-vanille/70 hover:border-lagon/50 hover:text-lagon"
            >
              {c.ville}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
