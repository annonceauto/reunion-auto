import type { Metadata } from 'next';
import { Archivo_Black, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://reunion-auto.vercel.app'),
  title: {
    default: 'Annonce Auto.re — Annonces de véhicules avec vidéo à La Réunion',
    template: '%s | Annonce Auto.re',
  },
  description:
    "Achetez et vendez des véhicules à La Réunion. Chaque annonce peut inclure une courte vidéo du véhicule pour éviter les mauvaises surprises.",
  keywords: [
    'annonce voiture Réunion', 'vendre voiture 974', 'acheter voiture La Réunion',
    'occasion Réunion', 'voiture occasion 974', 'petites annonces auto Réunion',
  ],
  manifest: '/manifest.json',
  themeColor: '#15181A',
  openGraph: {
    title: 'Annonce Auto.re — Annonces de véhicules avec vidéo à La Réunion',
    description: "Achetez et vendez des véhicules à La Réunion, avec vidéo pour éviter les mauvaises surprises.",
    url: 'https://reunion-auto.vercel.app',
    siteName: 'Annonce Auto.re',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Annonce Auto.re',
    description: "Achetez et vendez des véhicules à La Réunion, avec vidéo.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'kxcETuUM0TwaUUHi6T1L4TBtK8Uo63GOCPZk8IOZaps',
  },
};

const jsonLdOrganisation = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Annonce Auto.re',
  url: 'https://reunion-auto.vercel.app',
  description:
    "Site d'annonces de véhicules d'occasion à La Réunion, avec vidéo vérifiée pour chaque annonce.",
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'La Réunion',
  },
};

const jsonLdSiteWeb = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Annonce Auto.re',
  url: 'https://reunion-auto.vercel.app',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://reunion-auto.vercel.app/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${archivoBlack.variable} ${inter.variable} font-body`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganisation) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSiteWeb) }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
