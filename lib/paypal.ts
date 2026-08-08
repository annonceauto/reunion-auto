// Aide pour communiquer avec l'API PayPal (mode "live" ou "sandbox" selon les identifiants fournis).
// Nécessite les variables d'environnement PAYPAL_CLIENT_ID et PAYPAL_CLIENT_SECRET
// (à créer gratuitement sur https://developer.paypal.com > My Apps & Credentials).

const PAYPAL_API = process.env.PAYPAL_ENV === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

async function obtenirJetonAcces() {
  const identifiants = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const reponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${identifiants}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const donnees = await reponse.json();
  return donnees.access_token as string;
}

export async function creerCommandePaypal(montantEuros: number, description: string) {
  const jeton = await obtenirJetonAcces();
  const reponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jeton}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        { description, amount: { currency_code: 'EUR', value: montantEuros.toFixed(2) } },
      ],
    }),
  });
  return reponse.json();
}

export async function capturerCommandePaypal(idCommande: string) {
  const jeton = await obtenirJetonAcces();
  const reponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${idCommande}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jeton}`, 'Content-Type': 'application/json' },
  });
  return reponse.json();
}
