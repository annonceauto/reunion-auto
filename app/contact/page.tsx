import BoutonRetour from '@/components/BoutonRetour';

const QUESTIONS = [
  {
    q: 'Combien de temps ma vidéo peut-elle durer ?',
    r: '60 secondes maximum, pour un fichier de 60 Mo maximum (mp4, mov ou webm).',
  },
  {
    q: 'Que se passe-t-il quand la durée de mon annonce est dépassée ?',
    r: "L'annonce est automatiquement retirée du site. Tu peux ensuite en déposer une nouvelle.",
  },
  {
    q: "Comment fonctionne le solde ?",
    r: 'Tu peux recharger un solde à l\'avance depuis la page "Mon solde". Il est utilisé en priorité pour payer tes prochaines annonces et boosts.',
  },
  {
    q: 'Comment supprimer une annonce avant sa date d\'expiration ?',
    r: 'Depuis "Mes annonces", tu peux la supprimer ou la marquer comme vendue à tout moment.',
  },
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 text-vanille/80">
      <BoutonRetour />
      <h1 className="font-display text-2xl text-vanille">Contact & FAQ</h1>

      <div className="mt-6 rounded-2xl border border-lagon/30 bg-lagon/5 p-5">
        <h2 className="font-display text-lg text-vanille">Une question, un souci ?</h2>
        <p className="mt-2 text-sm">
          Écris-nous à{' '}
          <a href="mailto:mamabully2705@gmail.com" className="text-lagon underline">
            mamabully2705@gmail.com
          </a>{' '}
          — on te répond au plus vite.
        </p>
      </div>

      <h2 className="mt-8 font-display text-lg text-vanille">Questions fréquentes</h2>
      <div className="mt-4 flex flex-col gap-4">
        {QUESTIONS.map((item) => (
          <div key={item.q} className="rounded-xl border border-white/10 bg-basalte2 p-4">
            <p className="font-semibold text-vanille">{item.q}</p>
            <p className="mt-1 text-sm text-vanille/60">{item.r}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
