'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ListingCard from '@/components/ListingCard';

export default function MesFavoris() {
  const supabase = createClient();
  const router = useRouter();
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/connexion');
        return;
      }
      const { data: favoris } = await supabase
        .from('favoris')
        .select('listing_id')
        .eq('user_id', data.user.id);

      const ids = (favoris ?? []).map((f) => f.listing_id);
      if (ids.length === 0) {
        setChargement(false);
        return;
      }

      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .in('id', ids)
        .eq('statut', 'en_ligne');

      setAnnonces(listings ?? []);
      setChargement(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (chargement) return <div className="px-5 py-10 text-vanille/50">Chargement...</div>;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-2xl text-vanille">Mes favoris</h1>

      {annonces.length === 0 ? (
        <p className="mt-6 text-vanille/50">Tu n&apos;as pas encore d&apos;annonce en favori.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {annonces.map((a) => (
            <ListingCard key={a.id} listing={a} />
          ))}
        </div>
      )}
    </div>
  );
}
