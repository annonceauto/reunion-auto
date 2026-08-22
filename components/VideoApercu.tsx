'use client';

import { useEffect, useState } from 'react';

const SRC = 'https://videos.pexels.com/video-files/20693191/20693191-sd_640_360_25fps.mp4';

export default function VideoApercu() {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;
    let urlCree: string | null = null;

    fetch(SRC)
      .then((r) => r.blob())
      .then((blob) => {
        if (annule) return;
        urlCree = URL.createObjectURL(blob);
        setBlobUrl(urlCree);
      })
      .catch(() => {});

    return () => {
      annule = true;
      if (urlCree) URL.revokeObjectURL(urlCree);
    };
  }, []);

  if (!blobUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-vanille/30">
        Chargement de l&apos;aperçu…
      </div>
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
      className="absolute inset-0 h-full w-full object-cover"
      src={blobUrl}
    />
  );
}
