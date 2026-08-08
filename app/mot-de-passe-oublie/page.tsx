'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [chargement, setChargement] = useState(false);
  const supabase = createClient();

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setChargement(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
    });
    setChargement(false);
    setEnvoye(true);
  }

  if (envoye) {
    return (
      <div className="mx-auto max-w-sm px-5 py-16 text-center">
        <h1 className="font-display text-2xl text-vanille">Email envoyé 📩</h1>
        <p className="mt-4 text-sm text-vanille/70">
          Si un compte existe avec l&apos;adresse <strong>{email}</strong>, un lien pour créer un
          nouveau mot de passe vient de lui être envoyé. Pense à vérifier tes spams.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-2xl text-vanille">Mot de passe oublié</h1>
      <p className="mt-2 text-sm text-vanille/60">
        Indique ton email, on t&apos;envoie un lien pour en choisir un nouveau.
      </p>
      <form onSubmit={envoyer} className="mt-6 flex flex-col gap-4">
        <input
          type="email"
          autoComplete="username"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
        />
        <button
          type="submit"
          disabled={chargement}
          className="rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2 disabled:opacity-50"
        >
          {chargement ? 'Envoi...' : 'Recevoir le lien'}
        </button>
      </form>
    </div>
  );
}
