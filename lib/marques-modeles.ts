export const MODELES_PAR_MARQUE: Record<string, string[]> = {
  Renault: ['Clio', 'Captur', 'Mégane', 'Twingo', 'Kadjar', 'Scénic', 'Talisman', 'Kangoo', 'Duster'],
  Peugeot: ['208', '308', '2008', '3008', '5008', '108', '508', 'Partner', 'Rifter'],
  Citroën: ['C3', 'C4', 'C1', 'C5 Aircross', 'Berlingo', 'C3 Aircross', 'C4 Picasso'],
  Dacia: ['Duster', 'Sandero', 'Logan', 'Spring', 'Jogger', 'Lodgy'],
  Toyota: ['Yaris', 'Corolla', 'RAV4', 'Aygo', 'C-HR', 'Hilux', 'Land Cruiser', 'Prius'],
  Volkswagen: ['Golf', 'Polo', 'Tiguan', 'Passat', 'T-Roc', 'Up!', 'Touran', 'Caddy'],
  Ford: ['Fiesta', 'Focus', 'Kuga', 'Puma', 'Ranger', 'EcoSport', 'Transit'],
  Nissan: ['Micra', 'Qashqai', 'Juke', 'X-Trail', 'Note', 'Navara'],
  Hyundai: ['i10', 'i20', 'Tucson', 'Kona', 'i30', 'Santa Fe'],
  Kia: ['Picanto', 'Rio', 'Sportage', 'Ceed', 'Niro', 'Sorento'],
  Fiat: ['500', 'Panda', 'Tipo', '500X', 'Punto', 'Doblo'],
  Opel: ['Corsa', 'Astra', 'Crossland', 'Mokka', 'Insignia', 'Combo'],
  BMW: ['Série 1', 'Série 3', 'Série 5', 'X1', 'X3', 'X5', 'Série 2'],
  'Mercedes-Benz': ['Classe A', 'Classe C', 'Classe E', 'GLA', 'GLC', 'Sprinter', 'Vito'],
  Audi: ['A1', 'A3', 'A4', 'Q3', 'Q5', 'A6'],
  Suzuki: ['Swift', 'Vitara', 'Jimny', 'S-Cross', 'Ignis'],
  Mitsubishi: ['Space Star', 'ASX', 'Outlander', 'L200', 'Pajero'],
  Honda: ['Civic', 'Jazz', 'CR-V', 'HR-V'],
  Mazda: ['Mazda 2', 'Mazda 3', 'CX-3', 'CX-5'],
  Seat: ['Ibiza', 'Leon', 'Arona', 'Ateca'],
  Skoda: ['Fabia', 'Octavia', 'Kamiq', 'Karoq'],
  Volvo: ['XC40', 'XC60', 'V40', 'S60'],
  'Land Rover': ['Defender', 'Discovery', 'Range Rover Evoque', 'Range Rover Sport'],
  Jeep: ['Renegade', 'Compass', 'Wrangler', 'Cherokee'],
  Chevrolet: ['Spark', 'Aveo', 'Captiva'],
  Mini: ['Cooper', 'Countryman', 'Clubman'],
  Porsche: ['Cayenne', 'Macan', '911', 'Panamera'],
  Jaguar: ['E-Pace', 'F-Pace', 'XE', 'XF'],
  Smart: ['ForTwo', 'ForFour'],
  'Alfa Romeo': ['Giulietta', 'Giulia', 'Stelvio'],
  Subaru: ['Impreza', 'Forester', 'XV'],
  Lexus: ['CT', 'NX', 'RX'],
  'DS Automobiles': ['DS3', 'DS4', 'DS7'],
};

for (const marque in MODELES_PAR_MARQUE) {
  MODELES_PAR_MARQUE[marque].sort((a, b) => a.localeCompare(b, 'fr'));
}

export const MARQUES = Object.keys(MODELES_PAR_MARQUE)
  .sort((a, b) => a.localeCompare(b, 'fr'))
  .concat('Autre');
