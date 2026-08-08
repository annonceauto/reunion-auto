'use client';

import { useState } from 'react';

export default function TelephoneProtege({ telephone }: { telephone: string }) {
  const [visible, setVisible] = useState(false);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="mt-4 inline-block rounded-full bg-fournaise px-6 py-3 text-sm font-semibold text-vanille hover:bg-fournaise/90"
      >
        Afficher le numéro
      </button>
    );
  }

  return (
    <a
      href={`tel:${telephone}`}
      className="mt-4 inline-block rounded-full bg-fournaise px-6 py-3 text-sm font-semibold text-vanille hover:bg-fournaise/90"
    >
      Appeler {telephone}
    </a>
  );
}
