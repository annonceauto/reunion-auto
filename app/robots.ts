import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/mon-profil', '/mes-annonces', '/mes-favoris', '/mon-solde', '/moderation', '/creer-annonce'],
      },
    ],
    sitemap: 'https://annonce-auto.re/sitemap.xml',
  };
}
