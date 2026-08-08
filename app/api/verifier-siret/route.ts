import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const { siret } = await request.json();
  const siretNettoye = String(siret ?? '').replace(/\s/g, '');

  if (!/^\d{14}$/.test(siretNettoye)) {
    return NextResponse.json({ error: 'Le SIRET doit contenir exactement 14 chiffres.' }, { status: 400 });
  }

  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  }

  // Base officielle et gratuite de l'État français (data.gouv.fr / INSEE) — aucune clé requise.
  let donnees: any;
  try {
    const reponse = await fetch(
      `https://recherche-entreprises.api.gouv.fr/search?q=${siretNettoye}&limite_matching_etablissements=1`
    );
    if (!reponse.ok) throw new Error('Service indisponible');
    donnees = await reponse.json();
  } catch {
    return NextResponse.json(
      { error: "Impossible de vérifier le SIRET pour l'instant (service de l'État indisponible). Réessaie dans quelques minutes." },
      { status: 503 }
    );
  }

  const entreprise = (donnees.results ?? []).find((r: any) =>
    r.siege?.siret === siretNettoye || r.matching_etablissements?.some((e: any) => e.siret === siretNettoye)
  );

  if (!entreprise) {
    return NextResponse.json({ error: "Ce SIRET n'a pas été trouvé dans la base officielle des entreprises." }, { status: 404 });
  }

  const etatSiege = entreprise.siege?.etat_administratif ?? entreprise.etat_administratif;
  const active = etatSiege === 'A';

  if (!active) {
    return NextResponse.json(
      { error: "Cette entreprise n'apparaît pas comme étant en activité dans la base officielle." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  await admin
    .from('profiles')
    .update({
      siret: siretNettoye,
      siret_verifie: true,
      type_vendeur: 'professionnel',
    })
    .eq('id', userData.user.id);

  return NextResponse.json({ ok: true, nom: entreprise.nom_complet ?? entreprise.nom_raison_sociale ?? '' });
}
