import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Tarifs en centimes d'euro — modifiables librement ici.
export const PRIX_BOOST = 300; // 3,00 €
export const DUREE_BOOST_JOURS = 7;

// Durées de publication — tarifs particuliers
export const DUREES_ANNONCE = [
  { id: '2semaines', label: '2 semaines', jours: 14, prix: 500 },  // 5,00 €
  { id: '1mois', label: '1 mois', jours: 30, prix: 800 },          // 8,00 €
] as const;

// Durées de publication — tarifs professionnels (plus élevés)
export const DUREES_ANNONCE_PRO = [
  { id: '2semaines', label: '2 semaines', jours: 14, prix: 700 },  // 7,00 €
  { id: '1mois', label: '1 mois', jours: 30, prix: 1000 },         // 10,00 €
] as const;

// Montants proposés pour recharger le portefeuille
export const RECHARGES = [
  { id: 'r10', label: '10 €', montant: 1000 },
  { id: 'r25', label: '25 €', montant: 2500 },
  { id: 'r50', label: '50 €', montant: 5000 },
] as const;
