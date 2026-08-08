'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function MonProfil() {
  const supabase = createClient();
  const router = useRouter();
  const [nomAffiche, setNomAffiche] = useState('');
  const [telephone, setTelephone] = useState('');
  const [emailContact, setEmailContact] = useState('');
  const [typeVendeur, setTypeVendeur] = useState('particulier');
  const [contactEmailUniquement, setContactEmailUniquement] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/connexion');
        return;
      }
      const { data: profil } = await supabase
        .from('profiles')
        .select('nom_affiche, telephone, email_contact, type_vendeur, contact_email_uniquement')
        .eq('id', data.user.id)
        .single();
      setNomAffiche(profil?.nom_affiche ?? '');
      setTelephone(profil?.telephone ?? '');
      setEmailContact(profil?.email_contact ?? '');
      setTypeVendeur(profil?.type_vendeur ?? 'particulier');
      setContactEmailUniquement(!!profil?.contact_email_uniquement);
      setChargement(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnregistrement(true);
    setMessage('');
    setErreur('');

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    if (telephone.trim()) {
      const { data: autresComptes } = await supabase
        .from('profiles')
        .select('id')
        .eq('telephone', telephone.trim())
        .neq('id', userData.user.id)
        .limit(1);

      if (autresComptes && autresComptes.length > 0) {
        setErreur(
          "Ce numéro de téléphone est déjà associé à un autre compte sur le site. Un même numéro ne peut être utilisé que sur un seul compte."
        );
        setEnregistrement(false);
        return;
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        nom_affiche: nomAffiche,
        telephone,
        email_contact: emailContact,
        contact_email_uniquement: contactEmailUniquement,
      })
      .eq('id', userData.user.id);

    setEnregistrement(false);
    setMessage(error ? "Une erreur est survenue, réessaie." : 'Profil mis à jour !');
  }

  if (chargement) return <div className="px-5 py-10 text-vanille/50">Chargement...</div>;

  return (
    <div className="mx-auto max-w-md px-5 py-10">
      <h1 className="font-display text-2xl text-vanille">Mon profil</h1>
      <p className="mt-1 text-vanille/60">
        Ces informations permettent aux acheteurs de te contacter directement sur tes annonces.
      </p>

      <form onSubmit={enregistrer} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-vanille">Nom affiché</label>
          <input
            value={nomAffiche}
            onChange={(e) => setNomAffiche(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-vanille">Téléphone (appel + WhatsApp)</label>
          <input
            type="tel"
            placeholder="0692 00 00 00"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
          />
          <label className="mt-2 flex items-center gap-2 text-xs text-vanille/60">
            <input
              type="checkbox"
              checked={contactEmailUniquement}
              onChange={(e) => setContactEmailUniquement(e.target.checked)}
              className="h-4 w-4 accent-lagon"
            />
            Masquer mon numéro sur mes annonces — n&apos;être contacté(e) que par email
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-vanille">Email de contact (facultatif)</label>
          <input
            type="email"
            placeholder="tonadresse@email.com"
            value={emailContact}
            onChange={(e) => setEmailContact(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-vanille">Type de vendeur</label>
          <div className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-sm text-vanille/70 capitalize">
            {typeVendeur === 'professionnel' ? '🏢 Professionnel (✓ Entreprise vérifiée)' : 'Particulier'}
          </div>
        </div>

        <a
          href="/compte-professionnel"
          className="rounded-xl border border-lagon/30 bg-lagon/5 px-4 py-3 text-sm text-lagon hover:bg-lagon/10"
        >
          🏢 Professionnel de l&apos;automobile ? Fais vérifier ton SIRET pour obtenir le badge
          "Entreprise vérifiée" →
        </a>

        {erreur && (
          <div className="rounded-xl border border-fournaise/30 bg-fournaise/5 px-4 py-3 text-sm text-fournaise">
            {erreur} Un cas particulier légitime (ex : numéro partagé en famille) ?{' '}
            <a href="/contact" className="underline">Contacte-nous</a>.
          </div>
        )}

        {message && <p className="text-sm text-lagon">{message}</p>}

        <button
          type="submit"
          disabled={enregistrement}
          className="rounded-full bg-lagon px-6 py-3 text-sm font-semibold text-basalte hover:bg-lagon2 disabled:opacity-50"
        >
          {enregistrement ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
