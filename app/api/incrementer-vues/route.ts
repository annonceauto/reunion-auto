import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const { listingId } = await request.json();
  if (!listingId) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

  const supabase = createAdminClient();
  const { data: listing } = await supabase
    .from('listings')
    .select('vues')
    .eq('id', listingId)
    .single();

  await supabase
    .from('listings')
    .update({ vues: (listing?.vues ?? 0) + 1 })
    .eq('id', listingId);

  return NextResponse.json({ ok: true });
}
