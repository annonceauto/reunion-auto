import BoutonRetour from '@/components/BoutonRetour';

export default function CGU() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 text-vanille/80">
      <BoutonRetour />
      <h1 className="font-display text-2xl text-vanille">Conditions générales d&apos;utilisation</h1>

      <h2 className="mt-6 font-display text-lg text-vanille">1. Objet</h2>
      <p className="mt-2 text-sm">
        Annonce Auto.re est une plateforme permettant de déposer et consulter des annonces de
        véhicules d&apos;occasion à La Réunion, avec la possibilité de joindre une courte vidéo.
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">2. Dépôt d&apos;annonces</h2>
      <p className="mt-2 text-sm">
        La première annonce d&apos;un utilisateur est gratuite. Les annonces suivantes sont
        payantes, avec un choix de durée de publication (2 semaines ou 1 mois). Une option payante
        de mise en avant (boost) est également proposée. Toute annonce est automatiquement retirée
        du site à l&apos;expiration de sa durée de publication.
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">3. Paiement et solde</h2>
      <p className="mt-2 text-sm">
        Les paiements sont traités de manière sécurisée par Stripe. L&apos;utilisateur peut
        également recharger un solde à l&apos;avance pour régler plus rapidement ses prochaines
        annonces. Ce solde n&apos;est pas remboursable, sauf disposition légale contraire.
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">4. Contenu des annonces</h2>
      <p className="mt-2 text-sm">
        L&apos;utilisateur est seul responsable de l&apos;exactitude des informations et du contenu
        (photos, vidéos) qu&apos;il publie. Toute annonce trompeuse, frauduleuse ou ne concernant
        pas un véhicule pourra être supprimée sans préavis.
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">5. Responsabilité</h2>
      <p className="mt-2 text-sm">
        Le site n&apos;intervient pas dans la transaction entre acheteur et vendeur et ne peut être
        tenu responsable des litiges relatifs à la vente d&apos;un véhicule. Chaque vendeur certifie,
        au moment du dépôt de son annonce, que les informations et documents publiés (y compris
        toute pièce jointe telle qu&apos;un justificatif de contrôle technique) sont exacts, qu&apos;il
        dispose du droit de les publier, et qu&apos;il en assume l&apos;entière responsabilité,
        notamment concernant les données personnelles qu&apos;ils pourraient contenir. Annonce
        Auto.re ne vérifie pas l&apos;authenticité des documents fournis par les vendeurs et décline
        toute responsabilité à ce sujet. Le site peut proposer des liens vers des services tiers
        (par exemple le service gratuit de l&apos;État histovec.interieur.gouv.fr pour la situation
        administrative d&apos;un véhicule) : ces services sont indépendants d&apos;Annonce Auto.re, qui
        n&apos;est pas responsable de leur contenu, de leur disponibilité ou des informations qu&apos;ils
        fournissent.
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">6. Données personnelles</h2>
      <p className="mt-2 text-sm">
        Les données collectées (email, téléphone, nom affiché) sont utilisées uniquement pour le
        fonctionnement du site et la mise en relation entre utilisateurs, conformément au RGPD.
      </p>
    </div>
  );
}
