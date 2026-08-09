'use client';

import { useRef, useState } from 'react';

const TAILLE_MAX_MO_DEFAUT = 60;
const DUREE_MAX_S_DEFAUT = 60;

export default function VideoUploader({
  onFichierValide,
  label = 'Vidéo courte du véhicule (recommandé)',
  description,
  dureeMaxS = DUREE_MAX_S_DEFAUT,
  tailleMaxMo = TAILLE_MAX_MO_DEFAUT,
}: {
  onFichierValide: (fichier: File | null) => void;
  label?: string;
  description?: string;
  dureeMaxS?: number;
  tailleMaxMo?: number;
}) {
  const [erreur, setErreur] = useState('');
  const [nomFichier, setNomFichier] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function verifierEtCharger(fichier: File) {
    setErreur('');

    if (fichier.size > tailleMaxMo * 1024 * 1024) {
      setErreur(`Vidéo trop lourde (max ${tailleMaxMo} Mo). Filme en qualité standard plutôt qu'en 4K.`);
      onFichierValide(null);
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > dureeMaxS) {
        setErreur(`Vidéo trop longue (max ${dureeMaxS} secondes). Garde le meilleur passage.`);
        onFichierValide(null);
      } else {
        setNomFichier(fichier.name);
        onFichierValide(fichier);
      }
    };
    video.src = URL.createObjectURL(fichier);
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-vanille">
        {label}
      </label>
      <p className="mb-3 text-xs text-vanille/50">
        {description ?? `${dureeMaxS} secondes max, ${tailleMaxMo} Mo max.`}
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-xl border border-dashed border-white/20 bg-basalte2 px-4 py-6 text-center text-sm text-vanille/60 hover:border-lagon"
      >
        {nomFichier || 'Choisir un fichier vidéo (mp4, mov, webm)'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        onChange={(e) => {
          const fichier = e.target.files?.[0];
          if (fichier) verifierEtCharger(fichier);
        }}
        className="hidden"
      />

      {erreur && <p className="mt-2 text-sm text-fournaise">{erreur}</p>}
    </div>
  );
}
