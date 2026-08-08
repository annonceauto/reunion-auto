import { NextResponse } from 'next/server';
import { stripe, PRIX_BOOST } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { listingId } = await request.json();
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

  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: { name: `Mise en avant (boost) — ${listing.titre}` },
          unit_amount: PRIX_BOOST,
        },
        quantity: 1,
      },
    ],
    metadata: { type: 'boost', listing_id: listing.id },
    success_url: `${origin}/listing/${listing.id}?paiement=succes`,
    cancel_url: `${origin}/mes-annonces?paiement=annule`,
  });

  return NextResponse.json({ url: session.url });
}
