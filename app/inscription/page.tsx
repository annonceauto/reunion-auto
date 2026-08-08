'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { estEmailJetable } from '@/lib/emails-jetables';

function traduireErreur(message: string) {
  if (message.includes('already registered') || message.includes('already exists')) {
    return 'Un compte existe déjà avec cet email. Essaie de te connecter plutôt.';
  }
  if (message.includes('Password should be')) {
    return 'Le mot de passe doit contenir au moins 6 caractères.';
  }
  if (message.includes('Unable to validate email') || message.includes('invalid')) {
    return "Cette adresse email n'est pas valide.";
  }
  return "Une erreur est survenue (" + message + "). Réessaie dans un instant.";
}

export default function Inscription() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [nomAffiche, setNomAffiche] = useState('');
  const [typeCompte, setTypeCompte] = useState<'particulier' | 'professionnel'>('particulier');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [accepteCGU, setAccepteCGU] = useState(false);
  const [compteCree, setCompteCree] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function inscrire(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');

    if (!accepteCGU) {
      setErreur('Merci d\'accepter les CGU et la politique de confidentialité pour continuer.');
      return;
    }

    if (estEmailJetable(email)) {
      setErreur("Les adresses email temporaires/jetables ne sont pas acceptées. Utilise une adresse email classique (Gmail, Outlook, Orange...).");
      return;
    }

    setChargement(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: {
        data: { nom_affiche: nomAffiche },
        emailRedirectTo: `${window.location.origin}/connexion${typeCompte === 'professionnel' ? '?pro=1' : ''}`,
      },
    });

    setChargement(false);

    if (error) {
      setErreur(traduireErreur(error.message));
      return;
    }

    if (!data.session) {
      // Confirmation par email requise avant de pouvoir se connecter
      setCompteCree(true);
      return;
    }

    router.push('/');
  }

  if (compteCree) {
    return (
      <div className="mx-auto max-w-sm px-5 py-16 text-center">
        <h1 className="font-display text-2xl text-vanille">Compte créé 🎉</h1>
        <p className="mt-4 text-sm text-vanille/70">
          Un email de confirmation vient d&apos;être envoyé à <strong>{email}</strong>. Clique sur
          le lien qu&apos;il contient pour activer ton compte, puis reviens te connecter.
        </p>
        {typeCompte === 'professionnel' && (
          <p className="mt-3 text-sm text-lagon">
            Une fois connecté(e), pense à vérifier ton SIRET dans "Mon profil" → "Compte
            professionnel" pour activer le badge Professionnel sur tes annonces.
          </p>
        )}
        <p className="mt-3 text-xs text-vanille/40">
          Tu ne le vois pas ? Vérifie aussi tes spams.
        </p>
        <Link
          href="/connexion"
          className="mt-6 inline-block rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2"
        >
          Aller à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-2xl text-vanille">Créer un compte</h1>
      <form onSubmit={inscrire} className="mt-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nom affiché"
          value={nomAffiche}
          onChange={(e) => setNomAffiche(e.target.value)}
          required
          className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
        />
        <input
          type="email"
          autoComplete="username"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
        />
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Mot de passe (6 caractères min.)"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          minLength={6}
          required
          className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-vanille">Type de compte</label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                typeCompte === 'particulier'
                  ? 'border-lagon bg-lagon/10 text-lagon'
                  : 'border-white/10 bg-basalte2 text-vanille/70'
              }`}
            >
              <input
                type="radio"
                name="type-compte"
                checked={typeCompte === 'particulier'}
                onChange={() => setTypeCompte('particulier')}
                className="h-4 w-4 accent-lagon"
              />
              Particulier
            </label>
            <label
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                typeCompte === 'professionnel'
                  ? 'border-lagon bg-lagon/10 text-lagon'
                  : 'border-white/10 bg-basalte2 text-vanille/70'
              }`}
            >
              <input
                type="radio"
                name="type-compte"
                checked={typeCompte === 'professionnel'}
                onChange={() => setTypeCompte('professionnel')}
                className="h-4 w-4 accent-lagon"
              />
              Professionnel
            </label>
          </div>
          {typeCompte === 'professionnel' && (
            <p className="mt-2 text-xs text-vanille/50">
              Une vérification de ton SIRET te sera demandée après l&apos;inscription pour activer
              le statut professionnel.
            </p>
          )}
        </div>

        <label className="flex items-start gap-3 text-xs text-vanille/60">
          <input
            type="checkbox"
            checked={accepteCGU}
            onChange={(e) => setAccepteCGU(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-lagon"
          />
          <span>
            J&apos;accepte les{' '}
            <Link href="/cgu" target="_blank" className="text-lagon underline">CGU</Link> et la{' '}
            <Link href="/politique-confidentialite" target="_blank" className="text-lagon underline">
              politique de confidentialité
            </Link>
          </span>
        </label>

        {erreur && <p className="text-sm text-fournaise">{erreur}</p>}
        <button
          type="submit"
          disabled={chargement}
          className="rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2 disabled:opacity-50"
        >
          {chargement ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>
    </div>
  );
}
