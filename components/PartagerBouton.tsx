'use client';

export default function PartagerBouton({ titre }: { titre: string }) {
  async function partager() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: titre, url });
        return;
      } catch {
        // annulé par l'utilisateur, on ne fait rien
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Lien copié !');
    }
  }

  return (
    <button
      onClick={partager}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-vanille/70 hover:border-lagon"
    >
      ↗ Partager
    </button>
  );
}
