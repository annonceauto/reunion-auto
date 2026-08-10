export default function Logo({ taille = 'normal' }: { taille?: 'normal' | 'grand' }) {
  const tailleTexte = taille === 'grand' ? 'text-2xl sm:text-3xl' : 'text-lg';
  const tailleIcone = taille === 'grand' ? 40 : 28;

  return (
    <span className="inline-flex items-center gap-2">
      <img
        src="/logo-navbar.png"
        alt="Annonce Auto.re"
        width={tailleIcone}
        height={tailleIcone}
        style={{ width: tailleIcone, height: tailleIcone }}
        className="rounded-md"
      />
      <span className={`font-display leading-none tracking-tight text-vanille ${tailleTexte}`}>
        ANNONCE<span className="text-lagon">AUTO</span>
        <span className="text-vanille/40">.RE</span>
      </span>
    </span>
  );
}
