'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function FavoriBouton({ listingId }: { listingId: string }) {
  const supabase = createClient();
  const [connecte, setConnecte] = useState(false);
  const [enFavori, setEnFavori] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setConnecte(true);
      setUserId(data.user.id);
      const { data: favori } = await supabase
        .from('favoris')
        .select('listing_id')
        .eq('user_id', data.user.id)
        .eq('listing_id', listingId)
        .maybeSingle();
      setEnFavori(!!favori);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function basculer() {
    if (!connecte || !userId) return;
    if (enFavori) {
      await supabase.from('favoris').delete().eq('user_id', userId).eq('listing_id', listingId);
      setEnFavori(false);
    } else {
      await supabase.from('favoris').insert({ user_id: userId, listing_id: listingId });
      setEnFavori(true);
    }
  }

  if (!connecte) return null;

  return (
    <button
      onClick={basculer}
      className={`rounded-full border px-4 py-2 text-sm font-semibold ${
        enFavori
          ? 'border-fournaise bg-fournaise/10 text-fournaise'
          : 'border-white/20 text-vanille/70 hover:border-lagon'
      }`}
    >
      {enFavori ? '♥ Dans mes favoris' : '♡ Ajouter aux favoris'}
    </button>
  );
}
