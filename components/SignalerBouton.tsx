'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignalerBouton({ listingId }: { listingId: string }) {
  const supabase = createClient();
  const [ouvert, setOuvert] = useState(false);
  const [motif, setMotif] = useState('');
  const [envoye, setEnvoye] = useState(false);

  async function envoyer() {
    if (!motif.trim()) return;
    await supabase.from('signalements').insert({ listing_id: listingId, motif });
    setEnvoye(true);
  }

  if (envoye) {
    return <p className="text-sm text-vanille/50">Merci, ton signalement a bien été envoyé.</p>;
  }

  if (!ouvert) {
    return (
      <button
        onClick={() => setOuvert(true)}
        className="text-sm text-vanille/40 underline hover:text-vanille/70"
      >
        Signaler cette annonce
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-basalte2 p-4">
      <textarea
        placeholder="Décris rapidement le problème (annonce suspecte, véhicule déjà vendu, arnaque...)"
        value={motif}
        onChange={(e) => setMotif(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-white/10 bg-basalte px-3 py-2 text-sm text-vanille placeholder:text-vanille/40"
      />
      <button
        onClick={envoyer}
        className="mt-2 rounded-full bg-fournaise px-4 py-2 text-xs font-semibold text-vanille hover:bg-fournaise/90"
      >
        Envoyer le signalement
      </button>
    </div>
  );
}
