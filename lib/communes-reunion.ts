// Coordonnées approximatives du centre de chaque commune de La Réunion,
// utilisées pour la recherche par géolocalisation (calcul de distance à vol d'oiseau).

export const COMMUNES_COORDS: { ville: string; cp: string; lat: number; lng: number }[] = [
  { ville: 'Saint-Denis', cp: '97400', lat: -20.8823, lng: 55.4504 },
  { ville: 'Sainte-Marie', cp: '97438', lat: -20.8965, lng: 55.5525 },
  { ville: 'Sainte-Suzanne', cp: '97441', lat: -20.9058, lng: 55.6072 },
  { ville: 'Saint-André', cp: '97440', lat: -20.9633, lng: 55.6497 },
  { ville: 'Bras-Panon', cp: '97412', lat: -21.0058, lng: 55.6631 },
  { ville: 'Salazie', cp: '97433', lat: -21.0269, lng: 55.5262 },
  { ville: 'Saint-Benoît', cp: '97470', lat: -21.0339, lng: 55.7139 },
  { ville: 'La Plaine-des-Palmistes', cp: '97431', lat: -21.1167, lng: 55.6167 },
  { ville: 'Sainte-Rose', cp: '97439', lat: -21.1333, lng: 55.7947 },
  { ville: 'Saint-Philippe', cp: '97442', lat: -21.3583, lng: 55.7667 },
  { ville: 'Saint-Joseph', cp: '97480', lat: -21.3833, lng: 55.6167 },
  { ville: 'Petite-Île', cp: '97429', lat: -21.3667, lng: 55.5667 },
  { ville: 'Le Tampon', cp: '97430', lat: -21.2783, lng: 55.5153 },
  { ville: 'Saint-Pierre', cp: '97410', lat: -21.3393, lng: 55.4781 },
  { ville: 'Entre-Deux', cp: '97414', lat: -21.2833, lng: 55.4833 },
  { ville: "L'Étang-Salé", cp: '97427', lat: -21.2667, lng: 55.3333 },
  { ville: 'Les Avirons', cp: '97425', lat: -21.2333, lng: 55.3333 },
  { ville: 'Saint-Louis', cp: '97450', lat: -21.2833, lng: 55.4 },
  { ville: 'Cilaos', cp: '97413', lat: -21.1367, lng: 55.4714 },
  { ville: 'Saint-Leu', cp: '97436', lat: -21.1667, lng: 55.2833 },
  { ville: 'Trois-Bassins', cp: '97426', lat: -21.1, lng: 55.3 },
  { ville: 'Saint-Paul', cp: '97460', lat: -21.0092, lng: 55.2708 },
  { ville: 'La Possession', cp: '97419', lat: -20.9319, lng: 55.3378 },
  { ville: 'Le Port', cp: '97420', lat: -20.9375, lng: 55.2933 },
];

// Distance à vol d'oiseau entre deux points GPS, en kilomètres (formule de Haversine)
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Renvoie les noms de communes situées à moins de `rayonKm` du point donné
export function communesDansRayon(lat: number, lng: number, rayonKm: number) {
  return COMMUNES_COORDS.filter((c) => distanceKm(lat, lng, c.lat, c.lng) <= rayonKm).map((c) => c.ville);
}

export function slugCommune(ville: string) {
  return ville
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function communeParSlug(slug: string) {
  return COMMUNES_COORDS.find((c) => slugCommune(c.ville) === slug);
}
