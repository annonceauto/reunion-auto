// Quartiers et lieux-dits très connus à La Réunion, qui ne sont pas des communes à part
// entière mais que les gens cherchent naturellement (ex : "Saint-Gilles" au lieu de "Saint-Paul").

export const LOCALITES_REUNION: { nom: string; commune: string }[] = [
  { nom: 'Saint-Gilles-les-Bains', commune: 'Saint-Paul' },
  { nom: 'Saint-Gilles', commune: 'Saint-Paul' },
  { nom: "L'Ermitage", commune: 'Saint-Paul' },
  { nom: 'Boucan Canot', commune: 'Saint-Paul' },
  { nom: 'La Saline-les-Bains', commune: 'Saint-Paul' },
  { nom: 'La Saline', commune: 'Saint-Paul' },
  { nom: 'Le Guillaume', commune: 'Saint-Paul' },
  { nom: 'Plateau Caillou', commune: 'Saint-Paul' },
  { nom: 'La Possession', commune: 'La Possession' },
  { nom: 'Sainte-Clotilde', commune: 'Saint-Denis' },
  { nom: 'La Montagne', commune: 'Saint-Denis' },
  { nom: 'Bellepierre', commune: 'Saint-Denis' },
  { nom: 'Le Chaudron', commune: 'Saint-Denis' },
  { nom: 'La Bretagne', commune: 'Saint-Denis' },
  { nom: 'Terre Sainte', commune: 'Saint-Pierre' },
  { nom: 'Ravine des Cabris', commune: 'Saint-Pierre' },
  { nom: 'Bois d\'Olive', commune: 'Saint-Pierre' },
  { nom: '14e km', commune: 'Saint-Pierre' },
  { nom: 'Bérive', commune: 'Le Tampon' },
  { nom: 'Trois-Mares', commune: 'Le Tampon' },
  { nom: 'Bras-Fusil', commune: 'Saint-Benoît' },
  { nom: 'Sainte-Anne', commune: 'Saint-Benoît' },
  { nom: 'Grand Bois', commune: 'Saint-Pierre' },
  { nom: 'Ligne Paradis', commune: 'Saint-Pierre' },
  { nom: 'Basse Terre', commune: 'Saint-Paul' },
  { nom: 'Étang-Salé-les-Bains', commune: "L'Étang-Salé" },
];

export function trouverCommuneParLocalite(saisie: string) {
  const s = saisie.trim().toLowerCase();
  return LOCALITES_REUNION.find((l) => l.nom.toLowerCase() === s);
}
