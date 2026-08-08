import { NextResponse } from 'next/server';
import { capturerCommandePaypal } from '@/lib/paypal';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { DUREES_ANNONCE, DUREE_BOOST_JOURS, RECHARGES } from '@/lib/stripe';

export async function POST(request: Request) {
  const { orderId, type, listingId, dureeId, rechargeId } = await request.json();

  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  }

  const resultat = await capturerCommandePaypal(orderId);
  if (resultat.status !== 'COMPLETED') {
    return NextResponse.json({ error: 'Paiement non confirmé par PayPal' }, { status: 400 });
  }

  const admin = createAdminClient();

  if (type === 'annonce' && listingId) {
    const duree = DUREES_ANNONCE.find((d) => d.id === dureeId);
    if (duree) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + duree.jours);
      await admin
        .from('listings')
        .update({ statut: 'en_ligne', duree_jours: duree.jours, expires_at: expiresAt.toISOString() })
        .eq('id', listingId)
        .eq('user_id', userData.user.id);
    }
  } else if (type === 'boost' && listingId) {
    const jusquAu = new Date();
    jusquAu.setDate(jusquAu.getDate() + DUREE_BOOST_JOURS);
    await admin
      .from('listings')
      .update({ boost: true, boost_jusqu_au: jusquAu.toISOString() })
      .eq('id', listingId)
      .eq('user_id', userData.user.id);
  } else if (type === 'recharge' && rechargeId) {
    const recharge = RECHARGES.find((r) => r.id === rechargeId);
    if (recharge) {
      const montant = recharge.montant / 100;
      const { data: profil } = await admin
        .from('profiles')
        .select('solde')
        .eq('id', userData.user.id)
        .single();
      const nouveauSolde = (profil?.solde ?? 0) + montant;
      await admin.from('profiles').update({ solde: nouveauSolde }).eq('id', userData.user.id);
      await admin.from('recharges').insert({ user_id: userData.user.id, montant });
    }
  }

  return NextResponse.json({ ok: true });
}
