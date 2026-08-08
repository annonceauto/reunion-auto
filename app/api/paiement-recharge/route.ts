import { NextResponse } from 'next/server';
import { stripe, RECHARGES } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { rechargeId } = await request.json();
  const recharge = RECHARGES.find((r) => r.id === rechargeId);
  if (!recharge) {
    return NextResponse.json({ error: 'Montant invalide' }, { status: 400 });
  }

  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  }

  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: { name: `Recharge de solde — ${recharge.label}` },
          unit_amount: recharge.montant,
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'recharge',
      user_id: userData.user.id,
      montant: String(recharge.montant / 100),
    },
    success_url: `${origin}/mon-solde?paiement=succes`,
    cancel_url: `${origin}/mon-solde?paiement=annule`,
  });

  return NextResponse.json({ url: session.url });
}
