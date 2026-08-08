import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Cette route est appelée automatiquement chaque jour par Vercel Cron
// (voir vercel.json). Elle supprime les annonces dont la durée payée
// est dépassée.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const maintenant = new Date().toISOString();

  const { data, error } = await supabase
    .from('listings')
    .select('id, photos, video_path, document_ct_path')
    .lt('expires_at', maintenant)
    .eq('statut', 'en_ligne');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const annonce of data ?? []) {
    if (annonce.photos?.length) await supabase.storage.from('photos').remove(annonce.photos);
    if (annonce.video_path) await supabase.storage.from('videos').remove([annonce.video_path]);
    if (annonce.document_ct_path) await supabase.storage.from('documents').remove([annonce.document_ct_path]);
  }

  const { error: erreurSuppression } = await supabase
    .from('listings')
    .delete()
    .lt('expires_at', maintenant)
    .eq('statut', 'en_ligne');

  if (erreurSuppression) {
    return NextResponse.json({ error: erreurSuppression.message }, { status: 500 });
  }

  return NextResponse.json({ supprimees: data?.length ?? 0 });
}
