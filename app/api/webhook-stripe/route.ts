import { NextResponse } from 'next/server';
import { stripe, DUREE_BOOST_JOURS } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Signature invalide: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};
    const supabase = createAdminClient();

    // Publication d'une annonce payante (avec durée choisie, + boost optionnel)
    if (meta.type === 'publication_annonce' && meta.listing_id) {
      const jours = Number(meta.duree_jours ?? 14);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + jours);
      const miseAJour: Record<string, unknown> = {
        statut: 'en_ligne',
        duree_jours: jours,
        expires_at: expiresAt.toISOString(),
      };
      if (meta.boost === 'oui') {
        const boostJusquAu = new Date();
        boostJusquAu.setDate(boostJusquAu.getDate() + DUREE_BOOST_JOURS);
        miseAJour.boost = true;
        miseAJour.boost_jusqu_au = boostJusquAu.toISOString();
      }
      await supabase.from('listings').update(miseAJour).eq('id', meta.listing_id);
    }

    // Mise en avant (boost)
    if (meta.type === 'boost' && meta.listing_id) {
      const jusquAu = new Date();
      jusquAu.setDate(jusquAu.getDate() + DUREE_BOOST_JOURS);
      await supabase
        .from('listings')
        .update({ boost: true, boost_jusqu_au: jusquAu.toISOString() })
        .eq('id', meta.listing_id);
    }

    // Recharge de solde
    if (meta.type === 'recharge' && meta.user_id) {
      const montant = Number(meta.montant ?? 0);
      const { data: profil } = await supabase
        .from('profiles')
        .select('solde')
        .eq('id', meta.user_id)
        .single();
      const nouveauSolde = (profil?.solde ?? 0) + montant;
      await supabase.from('profiles').update({ solde: nouveauSolde }).eq('id', meta.user_id);
      await supabase.from('recharges').insert({ user_id: meta.user_id, montant });
    }
  }

  return NextResponse.json({ received: true });
}
