'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MARQUES } from '@/lib/marques-modeles';

export default function CarteAcheterVendre({ nombreAnnonces }: { nombreAnnonces: number }) {
  const router = useRouter();
  const [onglet, setOnglet] = useState<'acheter' | 'vendre'>('acheter');
  const [marque, setMarque] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [codePostal, setCodePostal] = useState('');

  function rechercher(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (marque) params.set('q', marque);
    if (prixMax) params.set('prixmax', prixMax);
    if (codePostal) params.set('cp', codePostal);
    router.push(`/?${params.toString()}#annonces`);
  }

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-basalte2 shadow-2xl shadow-black/40">
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setOnglet('acheter')}
          className={`flex-1 py-4 text-center font-display text-sm sm:text-base ${
            onglet === 'acheter' ? 'border-b-2 border-lagon text-lagon' : 'text-vanille/50'
          }`}
        >
          Acheter
        </button>
        <button
          onClick={() => setOnglet('vendre')}
          className={`flex-1 py-4 text-center font-display text-sm sm:text-base ${
            onglet === 'vendre' ? 'border-b-2 border-fournaise text-fournaise' : 'text-vanille/50'
          }`}
        >
          Vendre
        </button>
      </div>

      {onglet === 'acheter' ? (
        <form onSubmit={rechercher} className="flex flex-col gap-3 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="carte-marque" className="sr-only">Marque</label>
              <select
                id="carte-marque"
                value={marque}
                onChange={(e) => setMarque(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-basalte px-4 py-3 text-sm text-vanille"
              >
                <option value="">Marque</option>
                {MARQUES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="carte-prix-max" className="sr-only">Prix max</label>
              <select
                id="carte-prix-max"
                value={prixMax}
                onChange={(e) => setPrixMax(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-basalte px-4 py-3 text-sm text-vanille"
              >
                <option value="">Prix max</option>
                {[3000, 5000, 8000, 12000, 20000, 30000].map((p) => (
                  <option key={p} value={p}>{p.toLocaleString('fr-FR')} €</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="carte-code-postal" className="sr-only">Code postal</label>
            <input
              id="carte-code-postal"
              type="text"
              inputMode="numeric"
              placeholder="Code postal (ex : 97410)"
              value={codePostal}
              onChange={(e) => setCodePostal(e.target.value)}
              maxLength={5}
              className="w-full rounded-xl border border-white/10 bg-basalte px-4 py-3 text-sm text-vanille placeholder:text-vanille/40"
            />
          </div>
          <button
            type="submit"
            className="mt-1 rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte shadow-md shadow-lagon/20 hover:bg-lagon2"
          >
            Rechercher {nombreAnnonces > 0 && `(${nombreAnnonces})`}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-3 p-5 text-center">
          <p className="text-vanille/70">
            Dépose ton annonce en quelques minutes, avec photos et vidéo. Ta première annonce est
            gratuite.
          </p>
          <Link
            href="/creer-annonce"
            className="mt-1 w-full rounded-full bg-fournaise px-6 py-3 text-sm font-semibold text-vanille shadow-md shadow-fournaise/20 hover:bg-fournaise/90"
          >
            Déposer mon annonce
          </Link>
          <Link href="/comment-ca-marche" className="text-xs text-vanille/50 underline">
            Voir comment ça marche
          </Link>
        </div>
      )}
    </div>
  );
}
