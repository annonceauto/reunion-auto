// Vérifie via l'API Claude (Anthropic) qu'une photo montre bien un véhicule.
// Nécessite la variable d'environnement ANTHROPIC_API_KEY.

type ResultatVerification = 'valide' | 'a_verifier' | 'rejete';

export async function verifierPhotoVehicule(urlPhoto: string): Promise<ResultatVerification> {
  try {
    const reponseImage = await fetch(urlPhoto);
    if (!reponseImage.ok) return 'a_verifier';
    const buffer = await reponseImage.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const typeContenu = reponseImage.headers.get('content-type') || 'image/jpeg';

    const reponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 20,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: typeContenu, data: base64 },
              },
              {
                type: 'text',
                text: 'Cette photo montre-t-elle clairement un véhicule à moteur (voiture, moto, camion, utilitaire) destiné à la vente ? Réponds uniquement par un seul mot : OUI, NON ou INCERTAIN.',
              },
            ],
          },
        ],
      }),
    });

    if (!reponse.ok) return 'a_verifier';

    const donnees = await reponse.json();
    const texte = (donnees.content?.[0]?.text ?? '').trim().toUpperCase();

    if (texte.startsWith('OUI')) return 'valide';
    if (texte.startsWith('NON')) return 'rejete';
    return 'a_verifier';
  } catch {
    // En cas d'erreur technique (API indisponible...), on ne bloque jamais
    // la publication : on marque simplement l'annonce à vérifier manuellement.
    return 'a_verifier';
  }
}
