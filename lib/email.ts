// Envoi d'email via Resend (https://resend.com) — gratuit jusqu'à 3000 emails/mois.
// Nécessite la variable d'environnement RESEND_API_KEY sur Vercel.
// Si elle n'est pas configurée, la fonction ne fait rien silencieusement (pas d'erreur bloquante).

export async function envoyerEmail(destinataire: string, sujet: string, texte: string) {
  const cle = process.env.RESEND_API_KEY;
  if (!cle) return; // Pas configuré : on n'envoie rien, mais on ne casse rien non plus.

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cle}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? 'Annonce Auto.re <onboarding@resend.dev>',
        to: destinataire,
        subject: sujet,
        text: texte,
      }),
    });
  } catch {
    // On ne bloque jamais le reste du site si l'envoi d'email échoue.
  }
}
