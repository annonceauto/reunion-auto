'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MARQUES, MODELES_PAR_MARQUE } from '@/lib/marques-modeles';
import { trouverCommuneParLocalite, LOCALITES_REUNION } from '@/lib/localites-reunion';
import ChampAutocomplete from './ChampAutocomplete';

const PRIX_MAX_OPTIONS = [3000, 5000, 8000, 12000, 18000, 25000, 40000];

const COMMUNES_HERO = [
  { ville: 'Saint-Denis', cp: '97400' }, { ville: 'Sainte-Marie', cp: '97438' },
  { ville: 'Sainte-Suzanne', cp: '97441' }, { ville: 'Saint-André', cp: '97440' },
  { ville: 'Bras-Panon', cp: '97412' }, { ville: 'Salazie', cp: '97433' },
  { ville: 'Saint-Benoît', cp: '97470' }, { ville: 'La Plaine-des-Palmistes', cp: '97431' },
  { ville: 'Sainte-Rose', cp: '97439' }, { ville: 'Saint-Philippe', cp: '97442' },
  { ville: 'Saint-Joseph', cp: '97480' }, { ville: 'Petite-Île', cp: '97429' },
  { ville: 'Le Tampon', cp: '97430' }, { ville: 'Saint-Pierre', cp: '97410' },
  { ville: 'Entre-Deux', cp: '97414' }, { ville: "L'Étang-Salé", cp: '97427' },
  { ville: 'Les Avirons', cp: '97425' }, { ville: 'Saint-Louis', cp: '97450' },
  { ville: 'Cilaos', cp: '97413' }, { ville: 'Saint-Leu', cp: '97436' },
  { ville: 'Trois-Bassins', cp: '97426' }, { ville: 'Saint-Paul', cp: '97460' },
  { ville: 'La Possession', cp: '97419' }, { ville: 'Le Port', cp: '97420' },
];

export default function HeroRecherche() {
  const router = useRouter();
  const [onglet, setOnglet] = useState<'acheter' | 'vendre'>('acheter');
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [marqueVente, setMarqueVente] = useState('');
  const [modeleVente, setModeleVente] = useState('');
  const [anneeVente, setAnneeVente] = useState('');

  function rechercher(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (marque) params.set('q', modele ? `${marque} ${modele}` : marque);
    if (prixMax) params.set('prixmax', prixMax);

    const saisie = codePostal.trim();
    const matchParenthese = saisie.match(/^(.+?)\s*\((\d{5})\)$/);
    if (matchParenthese) {
      params.set('commune', matchParenthese[1].trim());
    } else if (/^\d+$/.test(saisie)) {
      if (saisie) {
        const communeParCP = COMMUNES_HERO.find((c) => c.cp === saisie);
        if (communeParCP) params.set('commune', communeParCP.ville);
        else params.set('cp', saisie);
      }
    } else if (saisie) {
      const villeTrouvee = COMMUNES_HERO.find((c) => c.ville.toLowerCase() === saisie.toLowerCase());
      const localite = trouverCommuneParLocalite(saisie);
      if (villeTrouvee) {
        params.set('commune', villeTrouvee.ville);
      } else if (localite) {
        params.set('commune', localite.commune);
      } else {
        const qActuel = params.get('q');
        params.set('q', qActuel ? `${qActuel} ${saisie}` : saisie);
      }
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-vanille shadow-2xl shadow-black/40">
      <div className="flex overflow-hidden rounded-t-3xl">
        <button
          onClick={() => setOnglet('acheter')}
          className={`flex-1 py-4 text-center font-display text-lg transition ${
            onglet === 'acheter'
              ? 'border-b-2 border-fournaise text-fournaise'
              : 'border-b-2 border-transparent text-basalte/40'
          }`}
        >
          Acheter
        </button>
        <button
          onClick={() => setOnglet('vendre')}
          className={`flex-1 py-4 text-center font-display text-lg transition ${
            onglet === 'vendre'
              ? 'border-b-2 border-fournaise text-fournaise'
              : 'border-b-2 border-transparent text-basalte/40'
          }`}
        >
          Vendre
        </button>
      </div>

      {onglet === 'acheter' ? (
        <form onSubmit={rechercher} className="flex flex-col gap-3 p-6">
          <div className="grid grid-cols-2 gap-3">
            <ChampAutocomplete
              valeur={marque}
              onChange={(v) => { setMarque(v); setModele(''); }}
              suggestions={MARQUES}
              placeholder="Marque"
              variante="clair"
            />
            <ChampAutocomplete
              valeur={modele}
              onChange={setModele}
              suggestions={MODELES_PAR_MARQUE[marque] ?? Object.values(MODELES_PAR_MARQUE).flat()}
              placeholder="Modèle"
              variante="clair"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={prixMax}
              onChange={(e) => setPrixMax(e.target.value)}
              className="rounded-xl border border-basalte/15 bg-white px-4 py-3 text-basalte"
            >
              <option value="">Prix max</option>
              {PRIX_MAX_OPTIONS.map((p) => (
                <option key={p} value={p}>jusqu&apos;à {p.toLocaleString('fr-FR')} €</option>
              ))}
            </select>
            <ChampAutocomplete
              valeur={codePostal}
              onChange={setCodePostal}
              suggestions={[
                ...COMMUNES_HERO.map((c) => `${c.ville} (${c.cp})`),
                ...LOCALITES_REUNION.map((l) => l.nom),
              ]}
              placeholder="Ville ou code postal"
              variante="clair"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-full bg-fournaise py-4 text-center font-display text-lg text-vanille shadow-lg shadow-fournaise/30 hover:bg-fournaise/90"
          >
            Rechercher
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-3 p-6 text-basalte">
          <p className="text-sm text-basalte/70">
            Dépose ton annonce en quelques minutes : photos, courte vidéo, et tu peux fixer ton
            prix librement. Ta première annonce est gratuite.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <ChampAutocomplete
              valeur={marqueVente}
              onChange={(v) => { setMarqueVente(v); setModeleVente(''); }}
              suggestions={MARQUES}
              placeholder="Marque"
              variante="clair"
            />
            <ChampAutocomplete
              valeur={modeleVente}
              onChange={setModeleVente}
              suggestions={MODELES_PAR_MARQUE[marqueVente] ?? Object.values(MODELES_PAR_MARQUE).flat()}
              placeholder="Modèle"
              variante="clair"
            />
          </div>

          <select
            value={anneeVente}
            onChange={(e) => setAnneeVente(e.target.value)}
            className="rounded-xl border border-basalte/15 bg-white px-4 py-3 text-basalte"
          >
            <option value="">Année</option>
            {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() + 1 - i).map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <ul className="flex flex-col gap-2 text-sm text-basalte/70">
            <li>✓ Publication en quelques minutes</li>
            <li>✓ Vidéo pour rassurer les acheteurs</li>
            <li>✓ Contact direct par téléphone, WhatsApp ou email</li>
          </ul>
          <Link
            href={`/creer-annonce?marque=${encodeURIComponent(marqueVente)}&modele=${encodeURIComponent(modeleVente)}&annee=${encodeURIComponent(anneeVente)}`}
            className="mt-2 rounded-full bg-lagon py-4 text-center font-display text-lg text-basalte shadow-lg shadow-lagon/30 hover:bg-lagon2"
          >
            Déposer mon annonce
          </Link>
        </div>
      )}
    </div>
  );
}
