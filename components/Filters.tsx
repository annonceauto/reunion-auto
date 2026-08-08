'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MARQUES, MODELES_PAR_MARQUE } from '@/lib/marques-modeles';
import { trouverCommuneParLocalite, LOCALITES_REUNION } from '@/lib/localites-reunion';
import ChampAutocomplete from './ChampAutocomplete';

const RAYONS_KM = [5, 10, 25, 50, 100];

const COMMUNES = [
  { ville: 'Saint-Denis', cp: '97400' },
  { ville: 'Sainte-Marie', cp: '97438' },
  { ville: 'Sainte-Suzanne', cp: '97441' },
  { ville: 'Saint-André', cp: '97440' },
  { ville: 'Bras-Panon', cp: '97412' },
  { ville: 'Salazie', cp: '97433' },
  { ville: 'Saint-Benoît', cp: '97470' },
  { ville: 'La Plaine-des-Palmistes', cp: '97431' },
  { ville: 'Sainte-Rose', cp: '97439' },
  { ville: 'Saint-Philippe', cp: '97442' },
  { ville: 'Saint-Joseph', cp: '97480' },
  { ville: 'Petite-Île', cp: '97429' },
  { ville: 'Le Tampon', cp: '97430' },
  { ville: 'Saint-Pierre', cp: '97410' },
  { ville: 'Entre-Deux', cp: '97414' },
  { ville: "L'Étang-Salé", cp: '97427' },
  { ville: 'Les Avirons', cp: '97425' },
  { ville: 'Saint-Louis', cp: '97450' },
  { ville: 'Cilaos', cp: '97413' },
  { ville: 'Saint-Leu', cp: '97436' },
  { ville: 'Trois-Bassins', cp: '97426' },
  { ville: 'Saint-Paul', cp: '97460' },
  { ville: 'La Possession', cp: '97419' },
  { ville: 'Le Port', cp: '97420' },
];

const PRIX_MIN_OPTIONS = [1000, 3000, 5000, 8000, 12000, 18000, 25000];
const PRIX_MAX_OPTIONS = [3000, 5000, 8000, 12000, 18000, 25000, 40000, 60000];
const KM_MAX_OPTIONS = [10000, 30000, 50000, 80000, 100000, 150000, 200000];

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();
  const [marque, setMarque] = useState(() => {
    const q = params.get('q') ?? '';
    return MARQUES.find((m) => q.startsWith(m)) ?? '';
  });
  const [modele, setModele] = useState(() => {
    const q = params.get('q') ?? '';
    const m = MARQUES.find((mq) => q.startsWith(mq));
    return m ? q.slice(m.length).trim() : '';
  });
  const [villeSaisie, setVilleSaisie] = useState(() => {
    const cpInitial = params.get('cp');
    if (cpInitial) return COMMUNES.find((c) => c.cp === cpInitial)?.ville ?? cpInitial;
    return params.get('commune') ?? '';
  });

  const matchParenthese = villeSaisie.trim().match(/^(.+?)\s*\((\d{5})\)$/);
  const localiteCorrespondante = trouverCommuneParLocalite(villeSaisie);
  const communeCorrespondante = matchParenthese
    ? COMMUNES.find((c) => c.cp === matchParenthese[2])
    : localiteCorrespondante
      ? COMMUNES.find((c) => c.ville === localiteCorrespondante.commune)
      : COMMUNES.find(
          (c) => c.cp === villeSaisie.trim() || c.ville.toLowerCase() === villeSaisie.trim().toLowerCase()
        );

  const [rayon, setRayon] = useState(params.get('rayon') ?? '25');
  const [localisation, setLocalisation] = useState('');

  function autourDeMoi() {
    setLocalisation('Recherche de ta position...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = new URLSearchParams(params.toString());
        next.set('lat', String(position.coords.latitude));
        next.set('lng', String(position.coords.longitude));
        next.set('rayon', rayon);
        next.delete('commune');
        next.delete('cp');
        setVilleSaisie('');
        setLocalisation('');
        router.push(`/?${next.toString()}`);
      },
      () => {
        setLocalisation("Impossible d'accéder à ta position. Vérifie que la géolocalisation est autorisée pour ce site.");
      }
    );
  }

  const geolocalisationActive = params.get('lat') && params.get('lng');

  function retirerGeolocalisation() {
    const next = new URLSearchParams(params.toString());
    next.delete('lat');
    next.delete('lng');
    next.delete('rayon');
    router.push(`/?${next.toString()}`);
  }

  function lancerRecherche(e?: React.FormEvent) {
    e?.preventDefault();
    const next = new URLSearchParams(params.toString());
    const q = [marque, modele].filter(Boolean).join(' ').trim();
    if (q) next.set('q', q);
    else next.delete('q');
    next.delete('cp');
    if (communeCorrespondante) next.set('commune', communeCorrespondante.ville);
    else next.delete('commune');
    router.push(`/?${next.toString()}`);
  }

  function majFiltre(cle: string, valeur: string) {
    const next = new URLSearchParams(params.toString());
    if (valeur) next.set(cle, valeur);
    else next.delete(cle);
    router.push(`/?${next.toString()}`);
  }

  return (
    <form
      onSubmit={lancerRecherche}
      className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-basalte2/80 p-4 shadow-lg shadow-black/20 backdrop-blur"
    >
      <div className="w-40">
        <ChampAutocomplete
          valeur={marque}
          onChange={(v) => { setMarque(v); setModele(''); }}
          suggestions={MARQUES}
          placeholder="Toutes les marques"
        />
      </div>

      <div className="w-40">
        <ChampAutocomplete
          valeur={modele}
          onChange={setModele}
          suggestions={MODELES_PAR_MARQUE[marque] ?? Object.values(MODELES_PAR_MARQUE).flat()}
          placeholder="Tous les modèles"
        />
      </div>

      <div className="w-40">
        <ChampAutocomplete
          valeur={villeSaisie}
          onChange={setVilleSaisie}
          suggestions={[
            ...COMMUNES.map((c) => `${c.ville} (${c.cp})`),
            ...LOCALITES_REUNION.map((l) => l.nom),
          ]}
          placeholder="Ville ou code postal"
        />
        {communeCorrespondante && (
          <p className="mt-1 pl-2 text-xs text-lagon">→ {communeCorrespondante.ville} ({communeCorrespondante.cp})</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {geolocalisationActive ? (
          <button
            type="button"
            onClick={retirerGeolocalisation}
            className="rounded-full border border-lagon/40 bg-lagon/10 px-4 py-2 text-sm text-lagon"
          >
            📍 Autour de moi ({params.get('rayon')} km) ✕
          </button>
        ) : (
          <>
            <select
              value={rayon}
              onChange={(e) => setRayon(e.target.value)}
              className="rounded-full border border-white/10 bg-basalte px-3 py-2 text-sm text-vanille"
            >
              {RAYONS_KM.map((r) => <option key={r} value={r}>{r} km</option>)}
            </select>
            <button
              type="button"
              onClick={autourDeMoi}
              className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille hover:border-lagon"
            >
              📍 Autour de moi
            </button>
          </>
        )}
      </div>
      {localisation && <p className="w-full text-xs text-vanille/50">{localisation}</p>}

      <select
        defaultValue={params.get('prixmin') ?? ''}
        onChange={(e) => majFiltre('prixmin', e.target.value)}
        className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
      >
        <option value="">Prix min</option>
        {PRIX_MIN_OPTIONS.map((p) => (
          <option key={p} value={p}>à partir de {p.toLocaleString('fr-FR')} €</option>
        ))}
      </select>
      <select
        defaultValue={params.get('prixmax') ?? ''}
        onChange={(e) => majFiltre('prixmax', e.target.value)}
        className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
      >
        <option value="">Prix max</option>
        {PRIX_MAX_OPTIONS.map((p) => (
          <option key={p} value={p}>jusqu&apos;à {p.toLocaleString('fr-FR')} €</option>
        ))}
      </select>
      <select
        defaultValue={params.get('kmmax') ?? ''}
        onChange={(e) => majFiltre('kmmax', e.target.value)}
        className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
      >
        <option value="">Km max</option>
        {KM_MAX_OPTIONS.map((k) => (
          <option key={k} value={k}>jusqu&apos;à {k.toLocaleString('fr-FR')} km</option>
        ))}
      </select>

      <select
        defaultValue={params.get('pieces') ?? ''}
        onChange={(e) => majFiltre('pieces', e.target.value)}
        className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
      >
        <option value="">Véhicules complets uniquement</option>
        <option value="inclure">Inclure les véhicules pour pièces</option>
        <option value="uniquement">Pour pièces uniquement</option>
      </select>

      <select
        defaultValue={params.get('video') ?? ''}
        onChange={(e) => majFiltre('video', e.target.value)}
        className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
      >
        <option value="">Toutes les annonces</option>
        <option value="oui">Avec vidéo uniquement</option>
        <option value="non">Sans vidéo uniquement</option>
      </select>

      <select
        defaultValue={params.get('tri') ?? ''}
        onChange={(e) => majFiltre('tri', e.target.value)}
        className="rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille"
      >
        <option value="">Plus récentes d&apos;abord</option>
        <option value="prix_asc">Prix croissant</option>
        <option value="prix_desc">Prix décroissant</option>
      </select>

      <button
        type="submit"
        className="rounded-full bg-lagon px-6 py-2 text-sm font-semibold text-basalte shadow-md shadow-lagon/20 hover:bg-lagon2"
      >
        Rechercher
      </button>
    </form>
  );
}
