'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function GaleriePhotos({ urls, alt }: { urls: string[]; alt: string }) {
  const [ouverte, setOuverte] = useState<number | null>(null);

  useEffect(() => {
    if (ouverte === null) return;
    function surTouche(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') setOuverte((i) => (i! - 1 + urls.length) % urls.length);
      if (e.key === 'ArrowRight') setOuverte((i) => (i! + 1) % urls.length);
      if (e.key === 'Escape') setOuverte(null);
    }
    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, [ouverte, urls.length]);

  return (
    <>
      <div className="mb-8 grid grid-cols-3 gap-3">
        {urls.map((url, i) => (
          <button
            key={url}
            onClick={() => setOuverte(i)}
            className="relative aspect-square overflow-hidden rounded-xl"
          >
            <Image src={url} alt={alt} fill className="object-cover" />
          </button>
        ))}
      </div>

      {ouverte !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOuverte(null)}
        >
          <img
            src={urls[ouverte]}
            alt={alt}
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
          />

          {urls.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOuverte((i) => (i! - 1 + urls.length) % urls.length);
                }}
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-basalte/70 text-2xl text-vanille hover:bg-basalte"
                aria-label="Photo précédente"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOuverte((i) => (i! + 1) % urls.length);
                }}
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-basalte/70 text-2xl text-vanille hover:bg-basalte"
                aria-label="Photo suivante"
              >
                ›
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-basalte/70 px-3 py-1 text-xs text-vanille">
                {ouverte + 1} / {urls.length}
              </div>
            </>
          )}

          <button
            onClick={() => setOuverte(null)}
            className="absolute right-6 top-6 text-3xl text-vanille"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
