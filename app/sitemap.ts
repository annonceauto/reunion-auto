import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://reunion-auto.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const { data: listings } = await supabase
    .from('listings')
    .select('id, created_at')
    .eq('statut', 'en_ligne')
    .eq('moderation_statut', 'valide');

  const pagesStatiques: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/comment-ca-marche`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/vendre-voiture-reunion`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/cgu`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/mentions-legales`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/politique-confidentialite`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const pagesAnnonces: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
    url: `${BASE_URL}/listing/${l.id}`,
    lastModified: l.created_at ? new Date(l.created_at) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...pagesStatiques, ...pagesAnnonces];
}
