import { NextResponse } from 'next/server';
import { creerCommandePaypal } from '@/lib/paypal';
import { createClient } from '@/lib/supabase/server';
import { DUREES_ANNONCE, DUREES_ANNONCE_PRO, PRIX_BOOST, RECHARGES } from '@/lib/stripe';

export async function POST(request: Request) {
  const { type, listingId, dureeId, rechargeId } = await request.json();

  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  }

  let montant = 0;
  let description = '';

  if (type === 'annonce') {
    const { data: profil } = await supabase
      .from('profiles')
      .select('type_vendeur')
      .eq('id', userData.user.id)
      .single();
    const listeDurees = profil?.type_vendeur === 'professionnel' ? DUREES_ANNONCE_PRO : DUREES_ANNONCE;
    const duree = listeDurees.find((d) => d.id === dureeId);
    if (!duree) return NextResponse.json({ error: 'Durée invalide' }, { status: 400 });
    montant = duree.prix / 100;
    description = `Publication d'annonce — ${duree.label}`;
  } else if (type === 'boost') {
    montant = PRIX_BOOST / 100;
    description = 'Mise en avant (boost)';
  } else if (type === 'recharge') {
    const recharge = RECHARGES.find((r) => r.id === rechargeId);
    if (!recharge) return NextResponse.json({ error: 'Montant invalide' }, { status: 400 });
    montant = recharge.montant / 100;
    description = `Recharge de solde — ${recharge.label}`;
  } else {
    return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
  }

  const commande = await creerCommandePaypal(montant, description);
  return NextResponse.json({ id: commande.id, type, listingId, dureeId, rechargeId });
}
