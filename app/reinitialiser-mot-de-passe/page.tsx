'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ReinitialiserMotDePasse() {
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [reussi, setReussi] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    const { error } = await supabase.auth.updateUser({ password: motDePasse });

    setChargement(false);
    if (error) {
      setErreur(error.message);
      return;
    }
    setReussi(true);
    setTimeout(() => router.push('/'), 2000);
  }

  if (reussi) {
    return (
      <div className="mx-auto max-w-sm px-5 py-16 text-center">
        <h1 className="font-display text-2xl text-vanille">Mot de passe mis à jour ✓</h1>
        <p className="mt-4 text-sm text-vanille/70">Redirection...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-2xl text-vanille">Choisir un nouveau mot de passe</h1>
      <form onSubmit={enregistrer} className="mt-6 flex flex-col gap-4">
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Nouveau mot de passe (6 caractères min.)"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          minLength={6}
          required
          className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
        />
        {erreur && <p className="text-sm text-fournaise">{erreur}</p>}
        <button
          type="submit"
          disabled={chargement}
          className="rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2 disabled:opacity-50"
        >
          {chargement ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
