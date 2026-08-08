'use client';

import { useEffect, useRef } from 'react';

export default function CompteurVues({ listingId }: { listingId: string }) {
  const dejaEnvoye = useRef(false);

  useEffect(() => {
    if (dejaEnvoye.current) return;
    dejaEnvoye.current = true;
    fetch('/api/incrementer-vues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId }),
    }).catch(() => {});
  }, [listingId]);

  return null;
}
