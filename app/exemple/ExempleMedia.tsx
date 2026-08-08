'use client';

import { useState, useEffect, useRef } from 'react';

const CLIPS = [
  { label: 'Extérieur', src: 'https://videos.pexels.com/video-files/4281225/4281225-sd_640_360_24fps.mp4' },
  { label: 'Moteur', src: 'https://videos.pexels.com/video-files/20693191/20693191-sd_640_360_25fps.mp4' },
  { label: 'Intérieur', src: 'https://videos.pexels.com/video-files/35666229/15114729_640_360_25fps.mp4' },
];

const PHOTOS = [
  { src: 'https://images.pexels.com/photos/27138970/pexels-photo-27138970.jpeg', alt: 'Renault Clio 4 - extérieur' },
  { src: 'https://images.pexels.com/photos/241190/pexels-photo-241190.jpeg', alt: 'Renault Clio 4 - intérieur' },
  { src: 'https://images.pexels.com/photos/37177077/pexels-photo-37177077.jpeg', alt: 'Renault Clio 4 - moteur' },
];

export default function ExempleMedia() {
  const [indexClip, setIndexClip] = useState(0);
  const [ouverte, setOuverte] = useState<number | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let annule = false;
    let urlCree: string | null = null;
    setChargement(true);
    setBlobUrl(null);

    fetch(CLIPS[indexClip].src)
      .then((r) => r.blob())
      .then((blob) => {
        if (annule) return;
        urlCree = URL.createObjectURL(blob);
        setBlobUrl(urlCree);
        setChargement(false);
      })
      .catch(() => setChargement(false));

    return () => {
      annule = true;
      if (urlCree) URL.revokeObjectURL(urlCree);
    };
  }, [indexClip]);

  function clipSuivant() {
    setIndexClip((i) => (i + 1) % CLIPS.length);
  }

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div className="relative aspect-video w-full">
          {chargement && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-vanille/40">
              Chargement de la vidéo…
            </div>
          )}
          {blobUrl && (
            <video
              ref={videoRef}
              key={blobUrl}
              controls
              autoPlay
              muted
              playsInline
              className="h-full w-full"
              src={blobUrl}
              onEnded={clipSuivant}
            />
          )}
        </div>
      </div>
      <div className="mb-8 -mt-3 flex flex-wrap items-center gap-2 text-xs text-vanille/40">
        <span>Vidéo du vendeur (exemple) :</span>
        {CLIPS.map((c, i) => (
          <button
            key={c.label}
            onClick={() => setIndexClip(i)}
            className={`rounded-full border px-3 py-1 ${
              i === indexClip ? 'border-lagon text-lagon' : 'border-white/10 text-vanille/50'
            }`}
          >
            {i + 1}/3 {c.label}
          </button>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3">
        {PHOTOS.map((p, i) => (
          <button
            key={p.src}
            onClick={() => setOuverte(i)}
            className="relative aspect-square overflow-hidden rounded-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {ouverte !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOuverte(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PHOTOS[ouverte].src}
            alt={PHOTOS[ouverte].alt}
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOuverte((i) => (i! - 1 + PHOTOS.length) % PHOTOS.length);
            }}
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-basalte/70 text-2xl text-vanille hover:bg-basalte"
            aria-label="Photo précédente"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOuverte((i) => (i! + 1) % PHOTOS.length);
            }}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-basalte/70 text-2xl text-vanille hover:bg-basalte"
            aria-label="Photo suivante"
          >
            ›
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-basalte/70 px-3 py-1 text-xs text-vanille">
            {ouverte + 1} / {PHOTOS.length}
          </div>
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
