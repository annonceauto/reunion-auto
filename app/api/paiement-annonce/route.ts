import { NextResponse } from 'next/server';
import { stripe, DUREES_ANNONCE, DUREES_ANNONCE_PRO, PRIX_BOOST, DUREE_BOOST_JOURS } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { listingId, dureeId, boost, pro } = await request.json();
  const listeDurees = pro ? DUREES_ANNONCE_PRO : DUREES_ANNONCE;
  const duree = listeDurees.find((d) => d.id === dureeId);
  if (!duree) {
    return NextResponse.json({ error: 'Durée invalide' }, { status: 400 });
  }

  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('id, titre, user_id')
    .eq('id', listingId)
    .single();

  if (!listing || listing.user_id !== userData.user.id) {
    return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
  }

  const prixTotalCentimes = duree.prix + (boost ? PRIX_BOOST : 0);
  const prixTotalEuros = prixTotalCentimes / 100;

  // 1. On essaie de payer avec le solde du portefeuille
  const { data: profil } = await supabase
    .from('profiles')
    .select('solde')
    .eq('id', userData.user.id)
    .single();

  if ((profil?.solde ?? 0) >= prixTotalEuros) {
    const nouveauSolde = (profil!.solde as number) - prixTotalEuros;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + duree.jours);

    const miseAJour: Record<string, unknown> = {
      statut: 'en_ligne',
      duree_jours: duree.jours,
      expires_at: expiresAt.toISOString(),
    };
    if (boost) {
      const boostJusquAu = new Date();
      boostJusquAu.setDate(boostJusquAu.getDate() + DUREE_BOOST_JOURS);
      miseAJour.boost = true;
      miseAJour.boost_jusqu_au = boostJusquAu.toISOString();
    }

    await supabase.from('profiles').update({ solde: nouveauSolde }).eq('id', userData.user.id);
    await supabase.from('listings').update(miseAJour).eq('id', listingId);

    return NextResponse.json({ payeParSolde: true });
  }

  // 2. Sinon, on passe par Stripe
  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL;

  const lineItems: any[] = [
    {
      price_data: {
        currency: 'eur',
        product_data: { name: `Publication ${duree.label} — ${listing.titre}` },
        unit_amount: duree.prix,
      },
      quantity: 1,
    },
  ];

  if (boost) {
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: { name: `Mise en avant (boost) — ${listing.titre}` },
        unit_amount: PRIX_BOOST,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    metadata: {
      type: 'publication_annonce',
      listing_id: listing.id,
      duree_jours: String(duree.jours),
      boost: boost ? 'oui' : 'non',
    },
    success_url: `${origin}/listing/${listing.id}?paiement=succes`,
    cancel_url: `${origin}/mes-annonces?paiement=annule`,
  });

  return NextResponse.json({ url: session.url });
}
