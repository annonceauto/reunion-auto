import BoutonRetour from '@/components/BoutonRetour';

export default function PolitiqueConfidentialite() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 text-vanille/80">
      <BoutonRetour />
      <h1 className="font-display text-2xl text-vanille">Politique de confidentialité</h1>

      <h2 className="mt-6 font-display text-lg text-vanille">Quelles données sont collectées</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        <li>Nom affiché, adresse email et mot de passe (chiffré) lors de la création de compte</li>
        <li>Numéro de téléphone, si renseigné par l&apos;utilisateur pour être contacté</li>
        <li>Photos et vidéos déposées dans le cadre d&apos;une annonce</li>
        <li>Historique des paiements et du solde (via Stripe, qui ne transmet jamais le numéro de carte complet au site)</li>
        <li>Statistiques de navigation basiques (nombre de vues d&apos;une annonce)</li>
      </ul>

      <h2 className="mt-6 font-display text-lg text-vanille">Pourquoi ces données</h2>
      <p className="mt-2 text-sm">
        Ces informations servent uniquement au fonctionnement du site : créer et sécuriser ton
        compte, publier tes annonces, permettre aux acheteurs de te contacter, et traiter tes
        paiements. Aucune donnée n&apos;est vendue à des tiers.
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">Combien de temps sont-elles conservées</h2>
      <p className="mt-2 text-sm">
        Les données liées à un compte sont conservées tant que le compte existe. Les annonces
        expirées sont automatiquement supprimées avec leurs photos et vidéos associées.
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">Qui héberge ces données</h2>
      <p className="mt-2 text-sm">
        La base de données et les fichiers (photos, vidéos) sont hébergés par Supabase Inc. Le
        site lui-même est hébergé par Vercel Inc. Les paiements sont traités par Stripe Inc., qui
        est certifié PCI-DSS (norme de sécurité bancaire).
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">Tes droits</h2>
      <p className="mt-2 text-sm">
        Conformément au RGPD, tu peux à tout moment demander l&apos;accès, la rectification ou la
        suppression de tes données personnelles, en écrivant à{' '}
        <a href="mailto:annonceauto.re@gmail.com" className="text-lagon underline">
          annonceauto.re@gmail.com
        </a>
        . Tu peux aussi supprimer toi-même tes annonces depuis &quot;Mes annonces&quot;.
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">Cookies</h2>
      <p className="mt-2 text-sm">
        Le site utilise uniquement des cookies techniques nécessaires à la connexion (session
        utilisateur), sans cookie publicitaire ni traceur tiers.
      </p>
    </div>
  );
}
