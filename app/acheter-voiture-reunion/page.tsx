import type { Metadata } from 'next';
import Link from 'next/link';
import BoutonRetour from '@/components/BoutonRetour';

export const metadata: Metadata = {
  title: 'Acheter sa voiture à La Réunion : le guide complet',
  description:
    "Comment bien acheter une voiture d'occasion à La Réunion : vérifier la vidéo et les photos, contrôler l'historique, éviter les arnaques, et négocier le bon prix.",
};

const sections = [
  {
    titre: '1. Regarder la vidéo avant de te déplacer',
    texte:
      "Sur Annonce Auto.re, les annonces peuvent inclure une courte vidéo du véhicule : carrosserie, intérieur, moteur qui tourne. Regarde-la attentivement avant de contacter le vendeur : elle te donne un vrai aperçu de l'état du véhicule et t'évite un déplacement inutile si quelque chose ne te convient pas.",
  },
  {
    titre: '2. Vérifier la situation administrative du véhicule',
    texte:
      "Avant de te déplacer ou de verser un acompte, vérifie gratuitement que le véhicule n'est ni gagé ni volé sur le site officiel de l'État : histovec.interieur.gouv.fr. Il te suffit de la plaque d'immatriculation, que tu peux demander au vendeur.",
  },
  {
    titre: '3. Examiner le contrôle technique et l\'entretien',
    texte:
      "Demande le contrôle technique (obligatoire s'il a plus de 6 mois) et, si possible, le carnet d'entretien. Un historique d'entretien suivi et un CT sans contre-visite majeure sont de bons signes. N'hésite pas à poser des questions précises sur les réparations récentes.",
  },
  {
    titre: '4. Se déplacer pour un essai',
    texte:
      "Avant de payer, vois le véhicule en vrai, si possible en journée et par temps sec pour bien juger l'état de la carrosserie. Fais un essai routier : freinage, boîte de vitesses, direction, bruits suspects. Vérifie que le kilométrage affiché correspond à l'état général du véhicule.",
  },
  {
    titre: '5. Éviter les arnaques courantes',
    texte:
      "Méfie-toi des prix anormalement bas, des vendeurs injoignables autrement que par message, ou qui refusent tout contact téléphonique. Ne verse jamais d'acompte avant d'avoir vu le véhicule. Privilégie un paiement en main propre ou un virement bancaire vérifié au moment de la remise des clés et de la carte grise.",
  },
  {
    titre: '6. Finaliser la vente en toute sécurité',
    texte:
      "Le jour de la vente, vérifie que le vendeur est bien le propriétaire (carte grise à son nom ou pouvoir), établis un certificat de cession en deux exemplaires, et effectue la déclaration de changement de propriétaire dans les 15 jours sur le site de l'ANTS.",
  },
];

export default function AcheterVoitureReunion() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 text-vanille/80">
      <BoutonRetour />
      <h1 className="font-display text-2xl text-vanille">
        Acheter sa voiture à La Réunion : le guide complet
      </h1>
      <p className="mt-2 text-sm text-vanille/60">
        Les étapes pour bien choisir et acheter ton véhicule d&apos;occasion à La Réunion (974),
        en toute confiance.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {sections.map((s) => (
          <div key={s.titre} className="rounded-2xl border border-white/10 bg-basalte2 p-5">
            <h2 className="font-display text-lg text-lagon">{s.titre}</h2>
            <p className="mt-2 text-sm">{s.texte}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-lagon/30 bg-lagon/5 p-6 text-center">
        <h2 className="font-display text-lg text-vanille">Prêt à trouver ton véhicule ?</h2>
        <p className="mt-2 text-sm text-vanille/70">
          Filtre les annonces avec vidéo pour voir l&apos;état réel du véhicule avant de te
          déplacer.
        </p>
        <Link
          href="/?video=oui"
          className="mt-4 inline-block rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2"
        >
          Voir les annonces avec vidéo
        </Link>
      </div>
    </div>
  );
}
