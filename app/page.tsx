import { createClient } from '@/lib/supabase/server';
import ListingCard from '@/components/ListingCard';
import Filters from '@/components/Filters';
import CarteAcheterVendre from '@/components/CarteAcheterVendre';
import VideoApercu from '@/components/VideoApercu';
import Link from 'next/link';
import { communesDansRayon } from '@/lib/communes-reunion';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home({
  searchParams,
}: {
  searchParams: {
    q?: string; commune?: string; cp?: string; video?: string; tri?: string;
    prixmin?: string; prixmax?: string; kmmax?: string; pieces?: string;
    lat?: string; lng?: string; rayon?: string;
  };
}) {
  const supabase = createClient();

  let query = supabase
    .from('listings')
    .select('*')
    .eq('statut', 'en_ligne')
    .eq('moderation_statut', 'valide');

  if (searchParams.pieces === 'uniquement') {
    query = query.eq('pour_pieces', true);
  } else if (searchParams.pieces !== 'inclure') {
    query = query.eq('pour_pieces', false);
  }

  if (searchParams.q) {
    const motNettoye = searchParams.q.replace(/[%,]/g, '');
    query = query.or(
      `marque.ilike.%${motNettoye}%,modele.ilike.%${motNettoye}%,titre.ilike.%${motNettoye}%,commune.ilike.%${motNettoye}%`
    );
  }
  if (searchParams.lat && searchParams.lng) {
    const communes = communesDansRayon(
      Number(searchParams.lat),
      Number(searchParams.lng),
      Number(searchParams.rayon ?? '25')
    );
    query = query.in('commune', communes.length > 0 ? communes : ['__aucune__']);
  } else if (searchParams.commune) {
    query = query.eq('commune', searchParams.commune);
  }
  if (searchParams.cp) {
    const COMMUNES_CP: Record<string, string> = {
      '97400': 'Saint-Denis', '97438': 'Sainte-Marie', '97441': 'Sainte-Suzanne',
      '97440': 'Saint-André', '97412': 'Bras-Panon', '97433': 'Salazie',
      '97470': 'Saint-Benoît', '97431': 'La Plaine-des-Palmistes', '97439': 'Sainte-Rose',
      '97442': 'Saint-Philippe', '97480': 'Saint-Joseph', '97429': 'Petite-Île',
      '97430': 'Le Tampon', '97410': 'Saint-Pierre', '97414': 'Entre-Deux',
      '97427': "L'Étang-Salé", '97425': 'Les Avirons', '97450': 'Saint-Louis',
      '97413': 'Cilaos', '97436': 'Saint-Leu', '97426': 'Trois-Bassins',
      '97460': 'Saint-Paul', '97419': 'La Possession', '97420': 'Le Port',
    };
    const communeTrouvee = COMMUNES_CP[searchParams.cp];
    if (communeTrouvee) query = query.eq('commune', communeTrouvee);
  }
  if (searchParams.video === 'oui') {
    query = query.not('video_path', 'is', null);
  }
  if (searchParams.video === 'non') {
    query = query.is('video_path', null);
  }
  if (searchParams.prixmin) {
    query = query.gte('prix', Number(searchParams.prixmin));
  }
  if (searchParams.prixmax) {
    query = query.lte('prix', Number(searchParams.prixmax));
  }
  if (searchParams.kmmax) {
    query = query.lte('kilometrage', Number(searchParams.kmmax));
  }

  if (searchParams.tri === 'prix_asc') {
    query = query.order('boost', { ascending: false }).order('prix', { ascending: true });
  } else if (searchParams.tri === 'prix_desc') {
    query = query.order('boost', { ascending: false }).order('prix', { ascending: false });
  } else {
    query = query.order('boost', { ascending: false }).order('created_at', { ascending: false });
  }

  const { data: listings } = await query;
  const { count: nombreUtilisateurs } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  return (
    <div>
      {/* Hero de confiance avec sélecteur Acheter / Vendre */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(31,182,166,0.25), transparent 45%), radial-gradient(circle at 85% 0%, rgba(232,84,42,0.15), transparent 40%)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-14 sm:pb-20 sm:pt-20">
          <div className="text-center">
            <h1 className="mx-auto max-w-2xl font-display text-3xl leading-tight text-vanille sm:text-5xl">
              Achetez ou vendez un véhicule à La Réunion.
              <br />
              <span className="text-lagon">Voyez-le avant de vous déplacer.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-vanille/60 sm:text-lg">
              Chaque annonce peut inclure une courte vidéo tournée par le vendeur : moteur,
              carrosserie, intérieur. Moins de mauvaises surprises, plus de confiance.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-basalte2/80 px-4 py-2 text-vanille/70">
                <span className="text-lagon">✓</span> Annonces vérifiées avant publication
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-basalte2/80 px-4 py-2 text-vanille/70">
                <span className="text-lagon">✓</span> Paiement 100 % sécurisé (Stripe)
              </span>
              {!!nombreUtilisateurs && nombreUtilisateurs > 0 && (
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-basalte2/80 px-4 py-2 text-vanille/70">
                  <span className="text-lagon">👥</span> {nombreUtilisateurs} inscrits sur le site
                </span>
              )}
            </div>

            <div className="mt-6">
              <Link
                href="/comment-ca-marche"
                className="inline-flex items-center gap-2 rounded-full border border-lagon/40 bg-lagon/10 px-5 py-2.5 text-sm font-semibold text-lagon hover:bg-lagon/20"
              >
                💡 Comment ça marche, en 3 étapes →
              </Link>
            </div>
          </div>

          {/* Bloc de mise en avant de la fonctionnalité vidéo */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-lagon/30 bg-basalte2/60">
            <div className="grid sm:grid-cols-2">
              <div className="relative aspect-video sm:aspect-auto sm:min-h-[280px] bg-black">
                <VideoApercu />
              </div>
              <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
                <span className="w-fit rounded-full bg-lagon/20 px-3 py-1 text-xs font-semibold text-lagon">
                  🎥 Notre particularité
                </span>
                <h2 className="font-display text-xl text-vanille sm:text-2xl">
                  Chaque annonce peut inclure une vidéo
                </h2>
                <p className="text-vanille/60">
                  Moteur qui tourne, carrosserie sous tous les angles, intérieur... Le vendeur
                  filme, tu regardes avant de te déplacer.
                </p>
                <Link
                  href="/exemple"
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte shadow-lg shadow-lagon/20 hover:bg-lagon2"
                >
                  🎬 Voir un exemple d&apos;annonce avec vidéo →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <CarteAcheterVendre nombreAnnonces={listings?.length ?? 0} />
          </div>
        </div>
      </section>

      <div id="annonces" className="mx-auto max-w-6xl px-5 py-10">
        {Object.keys(searchParams).length > 0 && (
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1 text-sm text-vanille/50 hover:text-vanille"
          >
            ← Retour au menu principal
          </Link>
        )}
        <details className="mb-8 group">
          <summary className="cursor-pointer list-none text-sm text-vanille/60 underline">
            Plus de critères de recherche
          </summary>
          <div className="mt-4">
            <Filters />
          </div>
        </details>

        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-basalte2 p-10 text-center text-vanille/50">
            Aucune annonce ne correspond à ta recherche pour l'instant.
          </div>
        )}
      </div>
    </div>
  );
}
