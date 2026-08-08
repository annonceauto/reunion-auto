export default function Logo({ taille = 'normal' }: { taille?: 'normal' | 'grand' }) {
  const tailleTexte = taille === 'grand' ? 'text-2xl sm:text-3xl' : 'text-lg';
  const tailleIcone = taille === 'grand' ? 40 : 28;

  return (
    <span className="inline-flex items-center gap-2">
      <svg
        width={tailleIcone}
        height={tailleIcone}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="10" fill="#1FB6A6" />
        <path
          d="M9 24l1.8-6.2A3 3 0 0113.7 15h12.6a3 3 0 012.9 2.3L31 24"
          stroke="#15181A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="7" y="24" width="26" height="6" rx="2.5" stroke="#15181A" strokeWidth="2.2" />
        <circle cx="13" cy="30" r="2" fill="#15181A" />
        <circle cx="27" cy="30" r="2" fill="#15181A" />
        <path d="M16 20.5l2 2.5 6-6" stroke="#15181A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`font-display leading-none tracking-tight text-vanille ${tailleTexte}`}>
        ANNONCE<span className="text-lagon">AUTO</span>
        <span className="text-vanille/40">.RE</span>
      </span>
    </span>
  );
}
