'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function BoutonPaypal({
  type,
  listingId,
  dureeId,
  rechargeId,
  onSucces,
}: {
  type: 'annonce' | 'boost' | 'recharge';
  listingId?: string;
  dureeId?: string;
  rechargeId?: string;
  onSucces: () => void;
}) {
  const conteneur = useRef<HTMLDivElement>(null);
  const dejaAffiche = useRef(false);

  useEffect(() => {
    if (dejaAffiche.current) return;

    function afficherBoutons() {
      if (!window.paypal || !conteneur.current || dejaAffiche.current) return;
      dejaAffiche.current = true;

      window.paypal
        .Buttons({
          style: { layout: 'horizontal', height: 40, tagline: false },
          createOrder: async () => {
            const reponse = await fetch('/api/paypal/creer-commande', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type, listingId, dureeId, rechargeId }),
            });
            const donnees = await reponse.json();
            return donnees.id;
          },
          onApprove: async (data: { orderID: string }) => {
            await fetch('/api/paypal/capturer-commande', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderID, type, listingId, dureeId, rechargeId }),
            });
            onSucces();
          },
        })
        .render(conteneur.current);
    }

    if (window.paypal) {
      afficherBoutons();
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) return; // PayPal non configuré : le bouton ne s'affiche simplement pas

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
    script.onload = afficherBoutons;
    document.body.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) return null;

  return <div ref={conteneur} className="mt-2" />;
}
