import { NextResponse } from 'next/server';
import { envoyerEmail } from '@/lib/email';

const EMAIL_ADMIN = 'priscilla.coulibaly@gmail.com';

export async function POST(request: Request) {
  const { marque, modele, listingId } = await request.json();

  await envoyerEmail(
    EMAIL_ADMIN,
    'Nouvelle annonce à valider sur Annonce Auto.re',
    `Une nouvelle annonce (${marque} ${modele}) attend ta validation.\n\nValide-la ici : https://reunion-auto.vercel.app/moderation\n\n(Réf. annonce : ${listingId})`
  );

  return NextResponse.json({ ok: true });
}
