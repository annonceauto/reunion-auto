'use client';

import { useRouter } from 'next/navigation';

export default function BoutonRetour() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="mb-4 flex items-center gap-1 text-sm text-vanille/50 hover:text-vanille"
    >
      ← Retour
    </button>
  );
}
