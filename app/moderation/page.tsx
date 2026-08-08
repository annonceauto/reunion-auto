'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

// Remplace par ton adresse email : seule cette personne pourra accéder
// à la page de modération.
const EMAIL_ADMIN = 'priscilla.coulibaly@gmail.com';

function urlPhoto(chemin: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${chemin}`;
}

export default function Moderation() {
  const supabase = createClient();
  const router = useRouter();
  const [autorise, setAutorise] = useState(false);
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);

  async function charger() {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('moderation_statut', 'a_verifier')
      .order('created_at', { ascending: true });
    setAnnonces(data ?? []);
    setChargement(false);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user || data.user.email !== EMAIL_ADMIN) {
        router.push('/');
        return;
      }
      setAutorise(true);
      charger();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function valider(id: string) {
    const annonce = annonces.find((a) => a.id === id);
    await supabase.from('listings').update({ moderation_statut: 'valide' }).eq('id', id);
    if (annonce) {
      await supabase.from('notifications').insert({
        user_id: annonce.user_id,
        message: `Ton annonce "${annonce.marque} ${annonce.modele}" a été validée et est maintenant en ligne 🎉`,
        lien: `/listing/${id}`,
      });
    }
    charger();
  }

  async function rejeter(id: string) {
    await supabase.from('listings').delete().eq('id', id);
    charger();
  }

  if (!autorise || chargement) return <div className="px-5 py-10 text-vanille/50">Chargement...</div>;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="font-display text-2xl text-vanille">Modération des annonces</h1>
      <p className="mt-1 text-vanille/60">
        Annonces à vérifier manuellement (l&apos;IA n&apos;a pas pu confirmer qu&apos;il s&apos;agit d&apos;un véhicule).
      </p>

      {annonces.length === 0 ? (
        <p className="mt-6 text-vanille/50">Rien à vérifier pour l&apos;instant 🎉</p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {annonces.map((a) => (
            <div key={a.id} className="flex gap-4 rounded-2xl border border-white/10 bg-basalte2 p-4">
              {a.photos?.[0] && (
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
                  <Image src={urlPhoto(a.photos[0])} alt={a.titre} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-display text-vanille">{a.marque} {a.modele}</p>
                <p className="text-sm text-vanille/60">{a.titre}</p>
                {a.raison_verification === 'telephone_duplique' && (
                  <p className="mt-1 inline-block rounded-full bg-fournaise/20 px-2 py-0.5 text-xs text-fournaise">
                    ⚠️ Numéro de téléphone déjà utilisé par un autre compte particulier
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => valider(a.id)}
                    className="rounded-full bg-lagon px-4 py-2 text-xs font-semibold text-basalte hover:bg-lagon2"
                  >
                    ✓ Valider
                  </button>
                  <button
                    onClick={() => rejeter(a.id)}
                    className="rounded-full border border-fournaise/40 px-4 py-2 text-xs text-fournaise hover:bg-fournaise/10"
                  >
                    ✕ Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
