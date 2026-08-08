import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifierPhotoVehicule } from '@/lib/verification-photo';

export async function POST(request: Request) {
  const { listingId } = await request.json();
  if (!listingId) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

  const supabase = createAdminClient();
  const { data: listing } = await supabase
    .from('listings')
    .select('photos')
    .eq('id', listingId)
    .single();

  // Sans clé Anthropic configurée, on passe directement en vérification manuelle.
  if (!process.env.ANTHROPIC_API_KEY) {
    await supabase.from('listings').update({ moderation_statut: 'a_verifier' }).eq('id', listingId);
    return NextResponse.json({ statut: 'a_verifier' });
  }

  const premierePhoto = listing?.photos?.[0];
  if (!premierePhoto) {
    // Pas de photo : à vérifier manuellement plutôt que de bloquer.
    await supabase.from('listings').update({ moderation_statut: 'a_verifier' }).eq('id', listingId);
    return NextResponse.json({ statut: 'a_verifier' });
  }

  const urlPhoto = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${premierePhoto}`;
  const statut = await verifierPhotoVehicule(urlPhoto);

  if (statut === 'rejete') {
    // On retire l'annonce : elle ne concerne visiblement pas un véhicule.
    await supabase.from('listings').delete().eq('id', listingId);
  } else {
    await supabase.from('listings').update({ moderation_statut: statut }).eq('id', listingId);
  }

  return NextResponse.json({ statut });
}
