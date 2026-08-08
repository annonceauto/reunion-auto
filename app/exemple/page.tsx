import type { Metadata } from 'next';
import Link from 'next/link';
import ExempleMedia from './ExempleMedia';

export const metadata: Metadata = {
  title: 'Exemple d\'annonce',
  description:
    "Découvre à quoi ressemble une fiche annonce sur Annonce Auto.re, avec photos et vidéo.",
  robots: { index: false, follow: false },
};

export default function ExempleAnnonce() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-6 rounded-2xl border border-fournaise/30 bg-fournaise/10 px-5 py-4 text-sm text-vanille">
        🎬 <strong>Exemple d&apos;annonce</strong> — véhicule fictif, non disponible à la vente.
        Cette page montre à quoi ressemble le rendu d&apos;une annonce sur Annonce Auto.re
        (photos + vidéo). Aucun moyen de contact n&apos;est associé.
      </div>

      <ExempleMedia />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-vanille sm:text-3xl">Renault Clio 4</h1>
          <p className="mt-1 text-vanille/60">Clio 4 1.5 dCi 90 — entretien suivi (exemple)</p>
        </div>
        <p className="font-display text-3xl text-lagon">8 900 €</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-vanille/40">
        <span>Exemple généré automatiquement</span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-basalte2 p-5 sm:grid-cols-4">
        {[
          ['Année', 2016],
          ['Kilométrage', '98 500 km'],
          ['Carburant', 'Diesel'],
          ['Boîte', 'Manuelle'],
          ['Contrôle technique', 'Moins de 6 mois'],
        ].map(([label, valeur]) => (
          <div key={label as string}>
            <dt className="text-xs uppercase tracking-wide text-vanille/40">{label}</dt>
            <dd className="mt-1 text-vanille">{valeur}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <h2 className="font-display text-lg text-vanille">Description</h2>
        <p className="mt-2 whitespace-pre-line text-vanille/70">
          Clio 4 bien entretenue, courroie de distribution changée récemment, pneus en bon état,
          climatisation fonctionnelle. Petite citadine idéale pour un premier véhicule.{'\n\n'}
          ⚠️ Ceci est un exemple : ce véhicule n&apos;existe pas et n&apos;est pas à vendre. Cette
          page sert uniquement à montrer le rendu d&apos;une fiche annonce avec photos et vidéo.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-basalte2/60 p-5 text-center">
        <p className="text-sm text-vanille/50">
          Exemple d&apos;annonce — aucun vendeur ni moyen de contact n&apos;est associé à cette
          page.
        </p>
        <Link
          href="/creer-annonce"
          className="mt-4 inline-block rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2"
        >
          Déposer ma vraie annonce
        </Link>
      </div>

      <div className="mt-6">
        <Link href="/" className="text-sm text-vanille/50 underline hover:text-vanille">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
