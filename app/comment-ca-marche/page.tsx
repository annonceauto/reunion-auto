import BoutonRetour from '@/components/BoutonRetour';

export default function CommentCaMarche() {
  const etapes = [
    {
      titre: '1. Dépose ton annonce',
      texte: "Renseigne la marque, le modèle, l'année, le prix et ajoute des photos. Ta première annonce est gratuite.",
    },
    {
      titre: '2. Filme ton véhicule',
      texte: "Ajoute une courte vidéo (60 secondes max) : démarrage moteur, carrosserie, intérieur. C'est ce qui rassure le plus les acheteurs.",
    },
    {
      titre: '3. Reçois des appels sérieux',
      texte: "Les acheteurs voient déjà l'état réel du véhicule avant de te contacter : moins de visites pour rien, plus de sérieux.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 text-vanille/80">
      <BoutonRetour />
      <h1 className="font-display text-2xl text-vanille">Comment ça marche</h1>
      <p className="mt-2 text-sm text-vanille/60">
        Vendre un véhicule à La Réunion en toute simplicité, en 3 étapes.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {etapes.map((e) => (
          <div key={e.titre} className="rounded-2xl border border-white/10 bg-basalte2 p-5">
            <h2 className="font-display text-lg text-lagon">{e.titre}</h2>
            <p className="mt-2 text-sm">{e.texte}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-lg text-vanille">Tarifs</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-basalte2 p-5 text-center">
          <p className="font-display text-lg text-vanille">1ère annonce</p>
          <p className="mt-2 font-display text-2xl text-lagon">Gratuite</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-basalte2 p-5 text-center">
          <p className="font-display text-lg text-vanille">2 semaines</p>
          <p className="mt-2 font-display text-2xl text-lagon">5 €</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-basalte2 p-5 text-center">
          <p className="font-display text-lg text-vanille">1 mois</p>
          <p className="mt-2 font-display text-2xl text-lagon">8 €</p>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-vanille/40">
        + option de mise en avant (boost) à 3 € pour remonter en tête des résultats pendant 7 jours.
      </p>
    </div>
  );
}
