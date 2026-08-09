'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import BoutonRetour from '@/components/BoutonRetour';

const LABELS: Record<string, string> = {
  q: 'Recherche',
  commune: 'Commune',
  prixmin: 'Prix min',
  prixmax: 'Prix max',
  kmmax: 'Km max',
  annee: 'Année',
  carburant: 'Carburant',
  boite: 'Boîte',
  pieces: 'Pièces',
  video: 'Vidéo',
  tri: 'Tri',
  rayon: 'Rayon',
};

const CLES_IGNOREES = new Set(['lat', 'lng', 'rayon', 'tri']);

function resumeCriteres(criteres: Record<string, string>): string {
  const parts = Object.entries(criteres)
    .filter(([cle, valeur]) => valeur && !CLES_IGNOREES.has(cle))
    .map(([cle, valeur]) => `${LABELS[cle] ?? cle} : ${valeur}`);
  return parts.length > 0 ? parts.join(' · ') : 'Toutes les annonces';
}

export default function MesRecherches() {
  const supabase = createClient();
  const router = useRouter();
  const [recherches, setRecherches] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);
  const [messageAlerte, setMessageAlerte] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/connexion');
        return;
      }
      const { data: rows } = await supabase
        .from('recherches')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
        .limit(30);
      setRecherches(rows ?? []);
      setChargement(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function relancer(criteres: Record<string, string>) {
    const params = new URLSearchParams(criteres);
    router.push(`/?${params.toString()}`);
  }

  async function supprimer(id: string) {
    await supabase.from('recherches').delete().eq('id', id);
    setRecherches((prev) => prev.filter((r) => r.id !== id));
  }

  async function creerAlerte(criteres: Record<string, string>) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from('alertes').insert({
      user_id: data.user.id,
      nom: resumeCriteres(criteres),
      criteres,
    });
    setMessageAlerte('Alerte créée à partir de cette recherche.');
    setTimeout(() => setMessageAlerte(null), 4000);
  }

  if (chargement) return <div className="px-5 py-10 text-vanille/50">Chargement...</div>;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <BoutonRetour />
      <h1 className="font-display text-2xl text-vanille">Mes recherches</h1>
      <p className="mt-1 text-sm text-vanille/50">
        L&apos;historique de tes dernières recherches. Relance-les ou transforme-les en alerte.
      </p>

      {messageAlerte && (
        <p className="mt-4 rounded-xl border border-lagon/40 bg-lagon/10 px-4 py-2 text-sm text-lagon">
          {messageAlerte}
        </p>
      )}

      {recherches.length === 0 ? (
        <p className="mt-8 text-vanille/50">
          Tu n&apos;as pas encore de recherche enregistrée. Lance une recherche depuis la page d&apos;accueil.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {recherches.map((r) => (
            <div
              key={r.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-basalte2/80 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm text-vanille">{resumeCriteres(r.criteres)}</p>
                <p className="mt-1 text-xs text-vanille/40">
                  {new Date(r.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => relancer(r.criteres)}
                  className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-xs text-vanille hover:border-lagon"
                >
                  Relancer
                </button>
                <button
                  onClick={() => creerAlerte(r.criteres)}
                  className="rounded-full border border-lagon/40 bg-lagon/10 px-4 py-2 text-xs text-lagon hover:bg-lagon/20"
                >
                  🔔 Créer une alerte
                </button>
                <button
                  onClick={() => supprimer(r.id)}
                  className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-xs text-vanille/50 hover:text-fournaise"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
