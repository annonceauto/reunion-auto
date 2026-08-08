'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ComptePro() {
  const supabase = createClient();
  const router = useRouter();
  const [siret, setSiret] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [reussi, setReussi] = useState<string | null>(null);
  const [dejaVerifie, setDejaVerifie] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/connexion?retour=/compte-professionnel');
        return;
      }
      const { data: profil } = await supabase
        .from('profiles')
        .select('siret_verifie')
        .eq('id', data.user.id)
        .single();
      setDejaVerifie(!!profil?.siret_verifie);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verifier(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    const reponse = await fetch('/api/verifier-siret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siret }),
    });
    const resultat = await reponse.json();

    setChargement(false);
    if (resultat.error) {
      setErreur(resultat.error);
      return;
    }
    setReussi(resultat.nom || 'Ton entreprise');
  }

  if (dejaVerifie || reussi) {
    return (
      <div className="mx-auto max-w-sm px-5 py-16 text-center">
        <h1 className="font-display text-2xl text-vanille">Compte professionnel activé ✓</h1>
        <p className="mt-4 text-sm text-vanille/70">
          {reussi && <>« {reussi} » a été vérifiée comme active dans la base officielle des entreprises. </>}
          Ton compte est maintenant identifié comme professionnel — tes annonces afficheront le badge
          "Professionnel" et seront facturées au tarif pro (7 € les 2 semaines, 10 € le mois).
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-2xl text-vanille">Compte professionnel</h1>
      <p className="mt-2 text-sm text-vanille/60">
        Renseigne ton numéro de SIRET (14 chiffres). On vérifie automatiquement, gratuitement et
        instantanément que ton entreprise est bien enregistrée et en activité dans la base
        officielle de l&apos;État. Une fois validé, ton compte est identifié comme professionnel et tes
        annonces affichent un badge dédié — au tarif professionnel (7 € les 2 semaines, 10 € le mois).
      </p>
      <form onSubmit={verifier} className="mt-6 flex flex-col gap-4">
        <input
          type="text"
          inputMode="numeric"
          placeholder="SIRET (14 chiffres)"
          value={siret}
          onChange={(e) => setSiret(e.target.value)}
          maxLength={14}
          required
          className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
        />
        {erreur && <p className="text-sm text-fournaise">{erreur}</p>}
        <button
          type="submit"
          disabled={chargement}
          className="rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2 disabled:opacity-50"
        >
          {chargement ? 'Vérification...' : 'Vérifier et activer'}
        </button>
      </form>
    </div>
  );
}
