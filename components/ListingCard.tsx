import Link from 'next/link';
import Image from 'next/image';

type Listing = {
  id: string;
  titre: string;
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number;
  prix: number;
  commune: string;
  photos: string[];
  video_path: string | null;
  boost?: boolean;
  expires_at?: string | null;
  pour_pieces?: boolean;
  type_annonce?: string | null;
};

function urlPhoto(chemin: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${chemin}`;
}

function joursRestants(expiresAt?: string | null) {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  const jours = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return jours;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const photoPrincipale = listing.photos?.[0];
  const jours = joursRestants(listing.expires_at);

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-basalte2 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-lagon/50 hover:shadow-xl hover:shadow-lagon/10"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
        {photoPrincipale ? (
          <Image
            src={urlPhoto(photoPrincipale)}
            alt={listing.titre}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-vanille/30">
            Pas de photo
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {listing.type_annonce === 'professionnel' && (
            <span className="flex items-center gap-1 rounded-full bg-lagon px-2.5 py-1 text-xs font-semibold text-basalte">
              ✓ Entreprise vérifiée
            </span>
          )}
          {listing.boost && (
            <span className="flex items-center gap-1 rounded-full bg-fournaise px-2.5 py-1 text-xs font-semibold text-vanille">
              🚀 Boosté
            </span>
          )}
          {listing.video_path && (
            <span className="flex items-center gap-1 rounded-full bg-basalte/90 px-2.5 py-1 text-xs font-semibold text-lagon">
              ▶ Vidéo
            </span>
          )}
          {listing.pour_pieces && (
            <span className="flex items-center gap-1 rounded-full bg-fournaise/90 px-2.5 py-1 text-xs font-semibold text-vanille">
              🔧 Pour pièces
            </span>
          )}
        </div>

        {jours !== null && (
          <span className="absolute right-3 top-3 rounded-full bg-basalte/90 px-2.5 py-1 text-xs font-semibold text-vanille/70">
            {jours > 0 ? `Expire dans ${jours} j` : "Expire aujourd'hui"}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="font-display text-base leading-tight text-vanille">
          {listing.marque} {listing.modele}
        </p>
        <p className="mt-1 text-sm text-vanille/60">
          {listing.annee} · {listing.kilometrage.toLocaleString('fr-FR')} km · {listing.commune}
        </p>
        <p className="mt-3 font-display text-lg text-lagon">
          {listing.prix.toLocaleString('fr-FR')} €
        </p>
      </div>
    </Link>
  );
}
