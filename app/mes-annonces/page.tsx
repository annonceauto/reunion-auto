'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ListingCard from '@/components/ListingCard';
import BoutonPaypal from '@/components/BoutonPaypal';
import Notifications from '@/components/Notifications';
import { DUREE_BOOST_JOURS } from '@/lib/stripe';

export default function MesAnnonces() {
  const supabase = createClient();
  const router = useRouter();
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);

  async function charger() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push('/connexion');
      return;
    }
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });
    setAnnonces(data ?? []);
    setChargement(false);
  }

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function marquerVendu(id: string) {
    await supabase.from('listings').update({ statut: 'vendu' }).eq('id', id);
    charger();
  }

  async function supprimer(id: string) {
    if (!confirm('Supprimer définitivement cette annonce ?')) return;
    const annonce = annonces.find((a) => a.id === id);
    if (annonce) {
      if (annonce.photos?.length) await supabase.storage.from('photos').remove(annonce.photos);
      if (annonce.video_path) await supabase.storage.from('videos').remove([annonce.video_path]);
      if (annonce.document_ct_path) await supabase.storage.from('documents').remove([annonce.document_ct_path]);
    }
    await supabase.from('listings').delete().eq('id', id);
    charger();
  }

  async function payerAnnonce(id: string, dureeJours: number | null) {
    const dureeId = dureeJours === 30 ? '1mois' : '2semaines';
    const reponse = await fetch('/api/paiement-annonce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: id, dureeId }),
    });
    const resultat = await reponse.json();
    if (resultat.payeParSolde) {
      charger();
      return;
    }
    if (resultat.url) window.location.href = resultat.url;
  }

  async function booster(id: string) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: profil } = await supabase
      .from('profiles')
      .select('boosts_gratuits')
      .eq('id', userData.user.id)
      .single();

    if ((profil?.boosts_gratuits ?? 0) > 0) {
      const jusquAu = new Date();
      jusquAu.setDate(jusquAu.getDate() + DUREE_BOOST_JOURS);
      await supabase.from('listings').update({ boost: true, boost_jusqu_au: jusquAu.toISOString() }).eq('id', id);
      await supabase
        .from('profiles')
        .update({ boosts_gratuits: (profil?.boosts_gratuits ?? 1) - 1 })
        .eq('id', userData.user.id);
      charger();
      return;
    }

    const reponse = await fetch('/api/paiement-boost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: id }),
    });
    const { url } = await reponse.json();
    if (url) window.location.href = url;
  }

  if (chargement) return <div className="px-5 py-10 text-vanille/50">Chargement...</div>;

  const vuesCumulees = annonces.reduce((total, a) => total + (a.vues ?? 0), 0);
  const nombreVendues = annonces.filter((a) => a.statut === 'vendu').length;
  const nombreEnLigne = annonces.filter((a) => a.statut === 'en_ligne').length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-2xl text-vanille">Mes annonces</h1>

      <div className="mt-6">
        <Notifications />
      </div>

      {annonces.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-basalte2 p-4 text-center">
            <p className="font-display text-2xl text-lagon">{nombreEnLigne}</p>
            <p className="text-xs text-vanille/50">En ligne</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-basalte2 p-4 text-center">
            <p className="font-display text-2xl text-lagon">{vuesCumulees}</p>
            <p className="text-xs text-vanille/50">Vues cumulées</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-basalte2 p-4 text-center">
            <p className="font-display text-2xl text-lagon">{nombreVendues}</p>
            <p className="text-xs text-vanille/50">Vendues</p>
          </div>
        </div>
      )}

      {annonces.length === 0 ? (
        <p className="mt-6 text-vanille/50">Tu n'as pas encore déposé d'annonce.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {annonces.map((a) => (
            <div key={a.id}>
              <ListingCard listing={a} />

              {a.statut === 'en_attente_paiement' && (
                <>
                  <button
                    onClick={() => payerAnnonce(a.id, a.duree_jours)}
                    className="mt-2 w-full rounded-full bg-fournaise px-3 py-2 text-xs font-semibold text-vanille hover:bg-fournaise/90"
                  >
                    Payer {a.duree_jours === 30 ? '8 €' : '5 €'} pour publier ({a.duree_jours === 30 ? '1 mois' : '2 semaines'})
                  </button>
                  <BoutonPaypal
                    type="annonce"
                    listingId={a.id}
                    dureeId={a.duree_jours === 30 ? '1mois' : '2semaines'}
                    onSucces={charger}
                  />
                </>
              )}

              <div className="mt-2 flex gap-2">
                {a.statut === 'en_ligne' && (
                  <>
                    <button
                      onClick={() => marquerVendu(a.id)}
                      className="flex-1 rounded-full border border-lagon/40 px-3 py-2 text-xs text-lagon hover:bg-lagon/10"
                    >
                      Marquer vendu
                    </button>
                    {!a.boost && (
                      <div className="flex-1">
                        <button
                          onClick={() => booster(a.id)}
                          className="w-full rounded-full border border-fournaise/40 px-3 py-2 text-xs text-fournaise hover:bg-fournaise/10"
                        >
                          Booster (3 €)
                        </button>
                        <BoutonPaypal type="boost" listingId={a.id} onSucces={charger} />
                      </div>
                    )}
                  </>
                )}
                <button
                  onClick={() => supprimer(a.id)}
                  className="flex-1 rounded-full border border-white/20 px-3 py-2 text-xs text-vanille/60 hover:bg-white/5"
                >
                  Supprimer
                </button>
              </div>

              {a.statut === 'vendu' && (
                <p className="mt-1 text-center text-xs uppercase tracking-wide text-vanille/40">Vendu</p>
              )}
              {a.statut === 'en_attente_paiement' && (
                <p className="mt-1 text-center text-xs uppercase tracking-wide text-fournaise/70">En attente de paiement</p>
              )}
              {a.statut !== 'en_attente_paiement' && a.moderation_statut === 'a_verifier' && (
                <p className="mt-1 text-center text-xs uppercase tracking-wide text-fournaise/70">
                  En attente de confirmation par l&apos;équipe
                </p>
              )}
              {a.boost && (
                <p className="mt-1 text-center text-xs uppercase tracking-wide text-lagon">🚀 Boostée</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
