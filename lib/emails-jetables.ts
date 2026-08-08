// Domaines d'emails "jetables" / temporaires les plus utilisés pour créer de faux comptes.
// Liste non exhaustive mais couvre les services les plus connus et les plus utilisés.

export const DOMAINES_JETABLES = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.info', 'guerrillamail.biz',
  '10minutemail.com', '10minutemail.net', 'tempmail.com', 'temp-mail.org',
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'trashmail.com', 'throwawaymail.com',
  'getnada.com', 'mohmal.com', 'sharklasers.com', 'dispostable.com', 'maildrop.cc',
  'fakeinbox.com', 'mailnesia.com', 'mintemail.com', 'moakt.com', 'emailondeck.com',
  'tempinbox.com', 'spamgourmet.com', 'mytemp.email', 'temp-mail.io', 'inboxkitten.com',
  '33mail.com', 'crazymailing.com', 'mailcatch.com', 'tempr.email', 'burnermail.io',
  'discard.email', 'mail-temp.com', 'tempail.com', 'emailfake.com', 'fakemail.net',
]);

export function estEmailJetable(email: string) {
  const domaine = email.split('@')[1]?.toLowerCase().trim();
  return !!domaine && DOMAINES_JETABLES.has(domaine);
}
