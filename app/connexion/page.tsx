'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function FormulaireConnexion() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [renvoiPossible, setRenvoiPossible] = useState(false);
  const [renvoiEnvoye, setRenvoiEnvoye] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  async function connecter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur('');
    setRenvoiPossible(false);
    setRenvoiEnvoye(false);
    setChargement(true);

    // On relit les champs directement dans le formulaire (et pas seulement l'état React) :
    // avec le remplissage automatique par Face ID / Touch ID sur iPhone, le champ peut être
    // rempli visuellement sans que le site ne l'ait "vu" passer.
    const donnees = new FormData(e.currentTarget);
    const emailFinal = String(donnees.get('email') ?? email).trim();
    const motDePasseFinal = String(donnees.get('motDePasse') ?? motDePasse);

    const { error } = await supabase.auth.signInWithPassword({
      email: emailFinal,
      password: motDePasseFinal,
    });

    setChargement(false);
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setErreur("Ton compte n'est pas encore activé. Vérifie l'email de confirmation qu'on t'a envoyé (et tes spams).");
        setRenvoiPossible(true);
      } else if (error.message.includes('Invalid login credentials')) {
        setErreur('Email ou mot de passe incorrect.');
      } else {
        setErreur(error.message);
      }
      return;
    }
    router.push(searchParams.get('retour') ?? '/');
  }

  async function renvoyerEmail() {
    await supabase.auth.resend({ type: 'signup', email });
    setRenvoiEnvoye(true);
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-2xl text-vanille">Connexion</h1>
      <form onSubmit={connecter} className="mt-6 flex flex-col gap-4">
        <input
          type="email"
          name="email"
          autoComplete="username"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
        />
        <input
          type="password"
          name="motDePasse"
          autoComplete="current-password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
          className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
        />
        <div className="flex items-center justify-between">
          {erreur && <p className="text-sm text-fournaise">{erreur}</p>}
        </div>
        <Link href="/mot-de-passe-oublie" className="text-left text-sm text-vanille/50 underline">
          Mot de passe oublié ?
        </Link>
        {renvoiPossible && !renvoiEnvoye && (
          <button
            type="button"
            onClick={renvoyerEmail}
            className="text-left text-sm text-lagon underline"
          >
            Renvoyer l&apos;email de confirmation
          </button>
        )}
        {renvoiEnvoye && <p className="text-sm text-lagon">Email renvoyé ! Vérifie ta boîte de réception.</p>}
        <button
          type="submit"
          disabled={chargement}
          className="rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2 disabled:opacity-50"
        >
          {chargement ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default function Connexion() {
  return (
    <Suspense fallback={<div className="px-5 py-16 text-vanille/50">Chargement...</div>}>
      <FormulaireConnexion />
    </Suspense>
  );
}
