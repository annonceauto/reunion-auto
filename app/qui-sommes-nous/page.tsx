import BoutonRetour from '@/components/BoutonRetour';

export default function QuiSommesNous() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 text-vanille/80">
      <BoutonRetour />
      <h1 className="font-display text-2xl text-vanille">Qui sommes-nous</h1>

      <p className="mt-6 text-sm">
        Annonce Auto.re est né d&apos;un constat simple : acheter une voiture d&apos;occasion à
        La Réunion implique souvent de se déplacer pour rien, sur la foi de quelques photos qui ne
        montrent pas toujours l&apos;état réel du véhicule.
      </p>

      <p className="mt-4 text-sm">
        Notre idée : permettre à chaque vendeur d&apos;ajouter une courte vidéo à son annonce —
        moteur, carrosserie, intérieur — pour que l&apos;acheteur sache à quoi s&apos;attendre
        avant de prendre rendez-vous. Moins de déplacements inutiles, plus de transactions
        sérieuses entre Réunionnais.
      </p>

      <p className="mt-4 text-sm">
        Annonce Auto.re est édité par une entreprise individuelle basée à La Réunion (détails dans
        les{' '}
        <a href="/mentions-legales" className="text-lagon underline">
          mentions légales
        </a>
        ).
      </p>

      <div className="mt-6 rounded-2xl border border-lagon/30 bg-lagon/5 p-5">
        <h2 className="font-display text-lg text-vanille">Une question ?</h2>
        <p className="mt-2 text-sm">
          Écris-nous à{' '}
          <a href="mailto:annonceauto.re@gmail.com" className="text-lagon underline">
            annonceauto.re@gmail.com
          </a>{' '}
          — c&apos;est le seul moyen de nous contacter, et on te répond au plus vite.
        </p>
      </div>
    </div>
  );
}
