'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import BoutonPaypal from '@/components/BoutonPaypal';

const RECHARGES = [
  { id: 'r10', label: '10 €' },
  { id: 'r25', label: '25 €' },
  { id: 'r50', label: '50 €' },
];

export default function MonSolde() {
  const supabase = createClient();
  const router = useRouter();
  const [solde, setSolde] = useState<number | null>(null);
  const [chargement, setChargement] = useState<string | null>(null);

  useEffect(() => {
    chargerSolde();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function chargerSolde() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.push('/connexion');
      return;
    }
    const { data: profil } = await supabase
      .from('profiles')
      .select('solde')
      .eq('id', data.user.id)
      .single();
    setSolde(profil?.solde ?? 0);
  }

  async function recharger(rechargeId: string) {
    setChargement(rechargeId);
    const reponse = await fetch('/api/paiement-recharge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rechargeId }),
    });
    const { url } = await reponse.json();
    if (url) window.location.href = url;
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <h1 className="font-display text-2xl text-vanille">Mon solde</h1>

      <div className="mt-6 rounded-2xl border border-lagon/30 bg-lagon/5 p-6 text-center">
        <p className="text-sm text-vanille/60">Solde disponible</p>
        <p className="mt-1 font-display text-4xl text-lagon">
          {solde === null ? '...' : `${solde.toFixed(2)} €`}
        </p>
      </div>

      <p className="mt-8 text-sm text-vanille/60">
        Recharge ton solde pour payer plus rapidement tes prochaines annonces et boosts,
        sans repasser par le paiement à chaque fois.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {RECHARGES.map((r) => (
          <div key={r.id}>
            <button
              onClick={() => recharger(r.id)}
              disabled={chargement !== null}
              className="w-full rounded-2xl border border-white/10 bg-basalte2 py-6 text-center font-display text-xl text-vanille hover:border-lagon disabled:opacity-50"
            >
              {chargement === r.id ? '...' : r.label}
            </button>
            <BoutonPaypal type="recharge" rechargeId={r.id} onSucces={chargerSolde} />
          </div>
        ))}
      </div>
    </div>
  );
}
