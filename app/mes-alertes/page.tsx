'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MARQUES, MODELES_PAR_MARQUE } from '@/lib/marques-modeles';
import BoutonRetour from '@/components/BoutonRetour';
import ChampAutocomplete from '@/components/ChampAutocomplete';

const COMMUNES = [
  'Saint-Denis', 'Sainte-Marie', 'Sainte-Suzanne', 'Saint-André', 'Bras-Panon', 'Salazie',
  'Saint-Benoît', 'La Plaine-des-Palmistes', 'Sainte-Rose', 'Saint-Philippe', 'Saint-Joseph',
  'Petite-Île', 'Le Tampon', 'Saint-Pierre', 'Entre-Deux', "L'Étang-Salé", 'Les Avirons',
  'Saint-Louis', 'Cilaos', 'Saint-Leu', 'Trois-Bassins', 'Saint-Paul', 'La Possession', 'Le Port',
];

const LABELS: Record<string, string> = {
  marque: 'Marque',
  modele: 'Modèle',
  commune: 'Commune',
  prixmin: 'Prix min',
  prixmax: 'Prix max',
  kmmax: 'Km max',
  annee: 'Année',
  carburant: 'Carburant',
  boite: 'Boîte',
  q: 'Recherche',
};

function resumeCriteres(criteres: Record<string, string>): string {
  const parts = Object.entries(criteres)
    .filter(([, valeur]) => valeur)
    .map(([cle, valeur]) => `${LABELS[cle] ?? cle} : ${valeur}`);
  return parts.length > 0 ? parts.join(' · ') : 'Toutes les annonces';
}

export default function MesAlertes() {
  const supabase = createClient();
  const router = useRouter();
  const [alertes, setAlertes] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [annees, setAnnees] = useState<number[]>([]);
  const [carburants, setCarburants] = useState<string[]>([]);
  const [boites, setBoites] = useState<string[]>([]);

  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [commune, setCommune] = useState('');
  const [prixmin, setPrixmin] = useState('');
  const [prixmax, setPrixmax] = useState('');
  const [kmmax, setKmmax] = useState('');
  const [annee, setAnnee] = useState('');
  const [carburant, setCarburant] = useState('');
  const [boite, setBoite] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/connexion');
        return;
      }
      setUserId(data.user.id);
      const { data: rows } = await supabase
        .from('alertes')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false });
      setAlertes(rows ?? []);
      setChargement(false);
    });

    supabase
      .from('listings')
      .select('annee, carburant, boite')
      .eq('statut', 'en_ligne')
      .eq('moderation_statut', 'valide')
      .then(({ data }) => {
        if (!data) return;
        setAnnees(Array.from(new Set(data.map((d) => d.annee).filter(Boolean))).sort((a, b) => b - a));
        setCarburants(Array.from(new Set(data.map((d) => d.carburant).filter(Boolean))).sort());
        setBoites(Array.from(new Set(data.map((d) => d.boite).filter(Boolean))).sort());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function creerAlerte(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setEnvoi(true);
    const criteres: Record<string, string> = {};
    if (marque) criteres.marque = marque;
    if (modele) criteres.modele = modele;
    if (commune) criteres.commune = commune;
    if (prixmin) criteres.prixmin = prixmin;
    if (prixmax) criteres.prixmax = prixmax;
    if (kmmax) criteres.kmmax = kmmax;
    if (annee) criteres.annee = annee;
    if (carburant) criteres.carburant = carburant;
    if (boite) criteres.boite = boite;

    const { data } = await supabase
      .from('alertes')
      .insert({ user_id: userId, nom: resumeCriteres(criteres), criteres })
      .select()
      .single();

    if (data) setAlertes((prev) => [data, ...prev]);
    setMarque(''); setModele(''); setCommune(''); setPrixmin(''); setPrixmax('');
    setKmmax(''); setAnnee(''); setCarburant(''); setBoite('');
    setEnvoi(false);
  }

  async function basculerActif(id: string, actif: boolean) {
    await supabase.from('alertes').update({ actif: !actif }).eq('id', id);
    setAlertes((prev) => prev.map((a) => (a.id === id ? { ...a, actif: !actif } : a)));
  }

  async function supprimer(id: string) {
    await supabase.from('alertes').delete().eq('id', id);
    setAlertes((prev) => prev.filter((a) => a.id !== id));
  }

  if (chargement) return <div className="px-5 py-10 text-vanille/50">Chargement...</div>;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <BoutonRetour />
      <h1 className="font-display text-2xl text-vanille">Mes alertes</h1>
      <p className="mt-1 text-sm text-vanille/50">
        Reçois une notification dès qu&apos;une annonce correspond à tes critères.
      </p>

      <form
        onSubmit={creerAlerte}
        className="mt-6 flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-basalte2/80 p-4"
      >
        <div className="w-40">
          <ChampAutocomplete
            valeur={marque}
            onChange={(v) => { setMarque(v); setModele(''); }}
            suggestions={MARQUES}
            placeholder="Marque"
          />
        </div>
        <div className="w-40">
          <ChampAutocomplete
            valeur={modele}
            onChange={setModele}
            suggestions={MODELES_PAR_MARQUE[marque] ?? Object.values(MODELES_PAR_MARQUE).flat()}
            placeholder="Modèle"
          />
        </div>
        <div className="w-40">
          <ChampAutocomplete
            valeur={commune}
            onChange={setCommune}
            suggestions={COMMUNES}
            placeholder="Commune"
          />
        </div>
        <input
          type="number"
          value={prixmin}
          onChange={(e) => setPrixmin(e.target.value)}
          placeholder="Prix min"
          className="w-28 rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
        />
        <input
          type="number"
          value={prixmax}
          onChange={(e) => setPrixmax(e.target.value)}
          placeholder="Prix max"
          className="w-28 rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
        />
        <input
          type="number"
          value={kmmax}
          onChange={(e) => setKmmax(e.target.value)}
          placeholder="Km max"
          className="w-28 rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
        />
        <select
          value={annee}
          onChange={(e) => setAnnee(e.target.value)}
          className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
        >
          <option value="">Année</option>
          {annees.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select
          value={carburant}
          onChange={(e) => setCarburant(e.target.value)}
          className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
        >
          <option value="">Carburant</option>
          {carburants.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={boite}
          onChange={(e) => setBoite(e.target.value)}
          className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
        >
          <option value="">Boîte</option>
          {boites.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>

        <button
          type="submit"
          disabled={envoi}
          className="rounded-full bg-lagon px-6 py-2 text-sm font-semibold text-basalte shadow-md shadow-lagon/20 hover:bg-lagon2 disabled:opacity-50"
        >
          {envoi ? 'Création...' : '🔔 Créer l’alerte'}
        </button>
      </form>

      {alertes.length === 0 ? (
        <p className="mt-8 text-vanille/50">Tu n&apos;as pas encore d&apos;alerte.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {alertes.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-basalte2/80 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm text-vanille">{a.nom || resumeCriteres(a.criteres)}</p>
                <p className="mt-1 text-xs text-vanille/40">
                  {a.actif ? 'Active' : 'Désactivée'} · créée le {new Date(a.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => basculerActif(a.id, a.actif)}
                  className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-xs text-vanille hover:border-lagon"
                >
                  {a.actif ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  onClick={() => supprimer(a.id)}
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
