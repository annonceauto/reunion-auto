import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import GaleriePhotos from '@/components/GaleriePhotos';
import TelephoneProtege from '@/components/TelephoneProtege';
import FavoriBouton from '@/components/FavoriBouton';
import SignalerBouton from '@/components/SignalerBouton';
import CompteurVues from '@/components/CompteurVues';
import PartagerBouton from '@/components/PartagerBouton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function messageAttente(statut: string, moderationStatut: string) {
  if (statut === 'en_attente_paiement') {
    return {
      titre: 'Ton annonce est en attente de paiement',
      texte:
        "Elle n'est visible que par toi pour l'instant. Termine le paiement depuis \"Mes annonces\" pour la publier.",
    };
  }
  if (moderationStatut === 'a_verifier') {
    return {
      titre: 'Ton annonce est en cours de vérification',
      texte:
        "Elle sera visible publiquement dès qu'un contrôle rapide de notre équipe l'aura validée (généralement sous quelques heures).",
    };
  }
  if (moderationStatut === 'rejete') {
    return {
      titre: 'Ton annonce a été refusée',
      texte:
        "La photo principale ne semblait pas montrer un véhicule. Modifie ton annonce depuis \"Mes annonces\" et réessaie.",
    };
  }
  if (statut === 'vendu') {
    return { titre: 'Cette annonce est marquée comme vendue', texte: "Elle n'est plus visible publiquement." };
  }
  if (statut === 'archive') {
    return { titre: 'Cette annonce est archivée', texte: "Elle n'est plus visible publiquement." };
  }
  return null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: listing } = await supabase
    .from('listings')
    .select('marque, modele, annee, prix, commune')
    .eq('id', params.id)
    .single();

  if (!listing) return { title: 'Annonce introuvable' };

  return {
    title: `${listing.marque} ${listing.modele} ${listing.annee} — ${listing.prix.toLocaleString('fr-FR')} € à ${listing.commune}`,
    description: `${listing.marque} ${listing.modele} ${listing.annee} à vendre à ${listing.commune}, La Réunion. Annonce vérifiée avec photos et vidéo.`,
    alternates: { canonical: `/listing/${params.id}` },
  };
}

function urlFichier(bucket: string, chemin: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${chemin}`;
}

function libelleCT(valeur?: string | null) {
  if (valeur === 'moins_6_mois') return 'Moins de 6 mois';
  if (valeur === 'plus_6_mois') return 'Plus de 6 mois';
  if (valeur === 'aucun') return 'Aucun';
  return 'Non renseigné';
}

function joursRestants(expiresAt?: string | null) {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function ListingDetail({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: listing } = await supabase
    .from('listings')
    .select('*, profiles!listings_user_id_fkey(nom_affiche, telephone, email_contact, type_vendeur, contact_email_uniquement)')
    .eq('id', params.id)
    .single();

  if (!listing) notFound();

  const { data: userData } = await supabase.auth.getUser();
  const estProprietaire = userData.user?.id === listing.user_id;

  if (estProprietaire) {
    const attente = messageAttente(listing.statut, listing.moderation_statut);
    if (attente) {
      return (
        <div className="mx-auto max-w-xl px-5 py-24 text-center">
          <h1 className="font-display text-2xl text-vanille">{attente.titre}</h1>
          <p className="mt-3 text-vanille/60">{attente.texte}</p>
          <Link
            href="/mes-annonces"
            className="mt-6 inline-block rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2"
          >
            Aller à mes annonces
          </Link>
        </div>
      );
    }
  } else if (listing.statut !== 'en_ligne') {
    // Un visiteur qui n'est pas le propriétaire ne doit jamais voir une annonce non publiée
    notFound();
  }

  const jours = joursRestants(listing.expires_at);
  const urlsPhotos = (listing.photos ?? []).map((p: string) => urlFichier('photos', p));
  const altPhoto = `${listing.marque} ${listing.modele} ${listing.annee} occasion à ${listing.commune}, La Réunion`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${listing.marque} ${listing.modele} ${listing.annee}`,
    brand: listing.marque,
    model: listing.modele,
    vehicleModelDate: String(listing.annee),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: listing.kilometrage,
      unitCode: 'KMT',
    },
    fuelType: listing.carburant,
    vehicleTransmission: listing.boite,
    image: urlsPhotos,
    description: listing.description || altPhoto,
    offers: {
      '@type': 'Offer',
      price: listing.prix,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      areaServed: listing.commune,
      seller: {
        '@type': listing.profiles?.type_vendeur === 'professionnel' ? 'AutoDealer' : 'Person',
        name: listing.profiles?.nom_affiche || 'Vendeur Annonce Auto.re',
      },
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompteurVues listingId={listing.id} />

      {listing.video_path && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black">
          <video
            controls
            preload="metadata"
            className="aspect-video w-full"
            src={urlFichier('videos', listing.video_path)}
          />
        </div>
      )}

      {urlsPhotos.length > 0 && <GaleriePhotos urls={urlsPhotos} alt={altPhoto} />}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-vanille sm:text-3xl">
            {listing.marque} {listing.modele}
            {listing.pour_pieces && (
              <span className="ml-2 rounded-full bg-fournaise/20 px-2 py-0.5 align-middle text-xs text-fournaise">
                Pour pièces
              </span>
            )}
          </h1>
          <p className="mt-1 text-vanille/60">{listing.titre}</p>
        </div>
        <p className="font-display text-3xl text-lagon">
          {listing.prix.toLocaleString('fr-FR')} €
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-vanille/40">
        <span>{(listing.vues ?? 0)} vue{(listing.vues ?? 0) > 1 ? 's' : ''}</span>
        {jours !== null && (
          <span>· {jours > 0 ? `Expire dans ${jours} jour${jours > 1 ? 's' : ''}` : "Expire aujourd'hui"}</span>
        )}
      </div>

      <div className="mt-4">
        <FavoriBouton listingId={listing.id} />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-basalte2 p-5 sm:grid-cols-4">
        {[
          ['Année', listing.annee],
          ['Kilométrage', `${listing.kilometrage.toLocaleString('fr-FR')} km`],
          ['Carburant', listing.carburant],
          ['Boîte', listing.boite],
          ['Contrôle technique', libelleCT(listing.controle_technique)],
        ].map(([label, valeur]) => (
          <div key={label as string}>
            <dt className="text-xs uppercase tracking-wide text-vanille/40">{label}</dt>
            <dd className="mt-1 text-vanille">{valeur}</dd>
          </div>
        ))}
      </dl>

      {listing.document_ct_path && (
        <div className="mt-3">
          <a
            href={urlFichier('documents', listing.document_ct_path)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-lagon underline"
          >
            📄 Voir le document de contrôle technique fourni par le vendeur
          </a>
        </div>
      )}

      <div className="mt-3 rounded-2xl border border-white/10 bg-basalte2/60 p-4 text-sm text-vanille/60">
        Avant de te déplacer, tu peux vérifier gratuitement la situation administrative du
        véhicule (non-gagé, non-volé) sur le site officiel de l&apos;État avec sa plaque
        d&apos;immatriculation :{' '}
        <a
          href="https://histovec.interieur.gouv.fr/histovec/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lagon underline"
        >
          histovec.interieur.gouv.fr
        </a>
        . Annonce Auto.re n&apos;est pas responsable du contenu de ce service externe.
      </div>

      {listing.description && (
        <div className="mt-6">
          <h2 className="font-display text-lg text-vanille">Description</h2>
          <p className="mt-2 whitespace-pre-line text-vanille/70">{listing.description}</p>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-lagon/30 bg-lagon/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg text-vanille">Contacter le vendeur</h2>
          <PartagerBouton titre={`${listing.marque} ${listing.modele}`} />
        </div>
        <p className="mt-1 flex items-center gap-2 text-vanille/70">
          {listing.profiles?.nom_affiche} — {listing.commune}
          {(listing.type_annonce ?? listing.profiles?.type_vendeur) === 'professionnel' && (
            <span className="rounded-full bg-lagon/20 px-2 py-0.5 text-xs text-lagon">✓ Entreprise vérifiée</span>
          )}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {listing.profiles?.telephone && !listing.profiles?.contact_email_uniquement ? (
            <>
              <TelephoneProtege telephone={listing.profiles.telephone} />
              <a
                href={`https://wa.me/262${listing.profiles.telephone.replace(/\D/g, '').replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-lagon/40 px-6 py-3 text-sm font-semibold text-lagon hover:bg-lagon/10"
              >
                💬 WhatsApp
              </a>
            </>
          ) : null}

          {listing.profiles?.email_contact ? (
            <a
              href={`mailto:${listing.profiles.email_contact}?subject=${encodeURIComponent(
                `Intéressé par votre annonce : ${listing.marque} ${listing.modele}`
              )}&body=${encodeURIComponent(
                `Bonjour, votre annonce "${listing.titre}" sur Annonce Auto.re m'intéresse. Est-elle toujours disponible ?`
              )}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-vanille/80 hover:border-lagon"
            >
              ✉️ Envoyer un email
            </a>
          ) : null}
        </div>

        {(!listing.profiles?.telephone || listing.profiles?.contact_email_uniquement) && !listing.profiles?.email_contact && (
          <p className="mt-3 text-sm text-vanille/40">
            Ce vendeur n&apos;a pas encore renseigné de moyen de contact.
          </p>
        )}
      </div>

      <div className="mt-4">
        <SignalerBouton listingId={listing.id} />
      </div>
    </div>
  );
}
