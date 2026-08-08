import BoutonRetour from '@/components/BoutonRetour';

export default function MentionsLegales() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 text-vanille/80">
      <BoutonRetour />
      <h1 className="font-display text-2xl text-vanille">Mentions légales</h1>

      <h2 className="mt-6 font-display text-lg text-vanille">Éditeur du site</h2>
      <p className="mt-2 text-sm">
        Le site Annonce Auto.re est édité par une entreprise individuelle (micro-entreprise)
        immatriculée à La Réunion, SIRET n° 530 268 374 00085. Pour toute question, contacte-nous
        via la page Contact.
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">Hébergement</h2>
      <p className="mt-2 text-sm">
        Le site est hébergé par Vercel Inc., et la base de données par Supabase Inc.
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">Propriété intellectuelle</h2>
      <p className="mt-2 text-sm">
        L'ensemble des éléments du site (textes, mise en page, logo) est protégé. Les photos et
        vidéos déposées par les utilisateurs restent leur propriété ; en les publiant, ils
        autorisent leur affichage public sur le site dans le cadre de leur annonce.
      </p>

      <h2 className="mt-6 font-display text-lg text-vanille">Responsabilité</h2>
      <p className="mt-2 text-sm">
        Le site met en relation acheteurs et vendeurs mais n'est pas partie aux transactions
        effectuées entre eux. Il appartient à chaque utilisateur de vérifier l'état du véhicule et
        les documents administratifs avant tout achat.
      </p>
    </div>
  );
}
