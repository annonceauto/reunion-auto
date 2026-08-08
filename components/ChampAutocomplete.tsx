'use client';

import { useEffect, useRef, useState } from 'react';

export default function ChampAutocomplete({
  valeur,
  onChange,
  suggestions,
  placeholder,
  variante = 'sombre',
  className = '',
}: {
  valeur: string;
  onChange: (v: string) => void;
  suggestions: string[];
  placeholder?: string;
  variante?: 'sombre' | 'clair';
  className?: string;
}) {
  const [ouvert, setOuvert] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function surClicExterieur(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOuvert(false);
    }
    document.addEventListener('mousedown', surClicExterieur);
    return () => document.removeEventListener('mousedown', surClicExterieur);
  }, []);

  const texteSaisi = valeur.trim().toLowerCase();
  const filtres = (
    texteSaisi
      ? suggestions.filter((s) => s.toLowerCase().includes(texteSaisi))
      : suggestions
  ).slice(0, 8);

  const styleInput =
    variante === 'clair'
      ? 'w-full rounded-xl border border-basalte/15 bg-white px-4 py-3 text-basalte placeholder:text-basalte/40'
      : 'w-full rounded-full border border-white/10 bg-basalte px-4 py-2 text-sm text-vanille placeholder:text-vanille/40 focus:border-lagon';

  const styleListe =
    variante === 'clair'
      ? 'absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-basalte/15 bg-white shadow-xl'
      : 'absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-white/10 bg-basalte2 shadow-xl';

  const styleOption =
    variante === 'clair'
      ? 'block w-full px-4 py-2 text-left text-sm text-basalte hover:bg-lagon/10'
      : 'block w-full px-4 py-2 text-left text-sm text-vanille hover:bg-lagon/10';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <input
        type="text"
        value={valeur}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOuvert(true);
        }}
        onFocus={() => setOuvert(true)}
        className={styleInput}
      />
      {ouvert && filtres.length > 0 && (
        <ul className={styleListe}>
          {filtres.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(s);
                  setOuvert(false);
                }}
                className={styleOption}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
