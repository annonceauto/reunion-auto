import type { Metadata } from 'next';
import Link from 'next/link';
import BoutonRetour from '@/components/BoutonRetour';

export const metadata: Metadata = {
  title: 'Vendre sa voiture à La Réunion : le guide complet',
  description:
    "Comment vendre sa voiture d'occasion à La Réunion rapidement et en toute sécurité : prix, documents, arnaques à éviter, et pourquoi ajouter une vidéo à ton annonce.",
};

const sections = [
  {
    titre: '1. Fixer le bon prix',
    texte:
      "Compare ton véhicule à des annonces similaires (même marque, modèle, année et kilométrage) déjà en ligne à La Réunion. Un prix trop élevé fait fuir les acheteurs sérieux, un prix trop bas fait perdre de l'argent inutilement. Prends aussi en compte l'état général, le contrôle technique et l'historique d'entretien.",
  },
  {
    titre: '2. Préparer les documents',
    texte:
      "Avant de publier, rassemble la carte grise, le contrôle technique (obligatoire s'il a plus de 6 mois), le carnet d'entretien si tu l'as, et un certificat de non-gage à établir au moment de la vente. Un dossier complet rassure l'acheteur et accélère la transaction.",
  },
  {
    titre: '3. Prendre de bonnes photos, et filmer le véhicule',
    texte:
      "Des photos nettes, prises en extérieur et sous plusieurs angles (avant, arrière, profil, intérieur, compteur) augmentent fortement les contacts sérieux. Ajouter une courte vidéo va encore plus loin : l'acheteur entend le moteur tourner et voit l'état réel de la carrosserie avant même de se déplacer. C'est exactement ce que permet le badge \"Vidéo vérifiée\" sur Annonce Auto.re.",
  },
  {
    titre: '4. Éviter les arnaques courantes',
    texte:
      "Méfie-toi des acheteurs pressés qui proposent de payer par chèque de banque avant même d'avoir vu le véhicule, ou qui envoient un montant supérieur au prix convenu en demandant de rembourser la différence. Privilégie un paiement en main propre ou un virement bancaire vérifié, et ne donne jamais tes documents originaux avant d'avoir reçu le paiement complet.",
  },
  {
    titre: '5. Vérifier la situation administrative du véhicule',
    texte:
      "Avant de conclure une vente, tu peux inviter l'acheteur à vérifier gratuitement que le véhicule n'est ni gagé ni volé, sur le site officiel de l'État : histovec.interieur.gouv.fr. Cette transparence renforce la confiance et accélère la décision d'achat.",
  },
  {
    titre: '6. Publier une annonce complète',
    texte:
      "Une annonce avec un titre clair (marque, modèle, année), un prix réaliste, une description honnête des défauts éventuels, plusieurs photos et une vidéo obtient beaucoup plus de contacts qu'une annonce minimale. La première annonce est gratuite sur Annonce Auto.re.",
  },
];

export default function VendreVoitureReunion() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 text-vanille/80">
      <BoutonRetour />
      <h1 className="font-display text-2xl text-vanille">
        Vendre sa voiture à La Réunion : le guide complet
      </h1>
      <p className="mt-2 text-sm text-vanille/60">
        Les étapes pour vendre ton véhicule d&apos;occasion rapidement, au bon prix, et en toute
        sécurité à La Réunion (974).
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
        <h2 className="font-display text-lg text-vanille">Prêt à publier ton annonce ?</h2>
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
    </div>
  );
}
