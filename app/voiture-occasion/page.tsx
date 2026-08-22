import type { Metadata } from 'next';
import Link from 'next/link';
import BoutonRetour from '@/components/BoutonRetour';
import { COMMUNES_COORDS, slugCommune } from '@/lib/communes-reunion';
import { jsonLdBreadcrumb } from '@/lib/breadcrumb';

export const metadata: Metadata = {
  title: "Voiture d'occasion à La Réunion : toutes les communes",
  description:
    "Trouve une voiture d'occasion près de chez toi à La Réunion : Saint-Denis, Saint-Pierre, Le Tampon, Saint-Paul et toutes les autres communes, avec vidéo vérifiée pour chaque annonce.",
  alternates: { canonical: '/voiture-occasion' },
};

const jsonLd = jsonLdBreadcrumb([
  { name: 'Accueil', url: 'https://annonce-auto.re' },
  { name: "Voiture d'occasion à La Réunion", url: 'https://annonce-auto.re/voiture-occasion' },
]);

export default function VoitureOccasionParVille() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 text-vanille/80">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BoutonRetour />
      <h1 className="font-display text-2xl text-vanille">
        Voiture d&apos;occasion à La Réunion, par commune
      </h1>
      <p className="mt-2 text-sm text-vanille/60">
        Choisis ta commune pour voir les annonces publiées près de chez toi. Chaque annonce peut
        inclure une vidéo du véhicule filmée par le vendeur, pour éviter les mauvaises surprises.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {COMMUNES_COORDS.map((c) => (
          <Link
            key={c.ville}
            href={`/voiture-occasion/${slugCommune(c.ville)}`}
            className="rounded-2xl border border-white/10 bg-basalte2 px-4 py-3 text-center text-sm text-vanille hover:border-lagon/50 hover:text-lagon"
          >
            {c.ville}
          </Link>
        ))}
      </div>
    </div>
  );
}
