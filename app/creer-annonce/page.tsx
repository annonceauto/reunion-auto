'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import VideoUploader from '@/components/VideoUploader';
import ChampAutocomplete from '@/components/ChampAutocomplete';
import { MARQUES, MODELES_PAR_MARQUE } from '@/lib/marques-modeles';
import { compresserPhoto } from '@/lib/compression-photo';

const VILLES_SIMPLE = [
  'Saint-Denis', 'Sainte-Marie', 'Sainte-Suzanne', 'Saint-André', 'Bras-Panon', 'Salazie',
  'Saint-Benoît', 'La Plaine-des-Palmistes', 'Sainte-Rose', 'Saint-Philippe', 'Saint-Joseph',
  'Petite-Île', 'Le Tampon', 'Saint-Pierre', 'Entre-Deux', "L'Étang-Salé", 'Les Avirons',
  'Saint-Louis', 'Cilaos', 'Saint-Leu', 'Trois-Bassins', 'Saint-Paul', 'La Possession', 'Le Port',
].sort((a, b) => a.localeCompare(b, 'fr'));

const COMMUNES = [
  'Saint-Denis (97400)', 'Sainte-Marie (97438)', 'Sainte-Suzanne (97441)',
  'Saint-André (97440)', 'Bras-Panon (97412)', 'Salazie (97433)',
  'Saint-Benoît (97470)', 'La Plaine-des-Palmistes (97431)', 'Sainte-Rose (97439)',
  'Saint-Philippe (97442)', 'Saint-Joseph (97480)', 'Petite-Île (97429)',
  'Le Tampon (97430)', 'Saint-Pierre (97410)', 'Entre-Deux (97414)',
  "L'Étang-Salé (97427)", 'Les Avirons (97425)', 'Saint-Louis (97450)',
  'Cilaos (97413)', 'Saint-Leu (97436)', 'Trois-Bassins (97426)',
  'Saint-Paul (97460)', 'La Possession (97419)', 'Le Port (97420)',
].sort((a, b) => a.localeCompare(b, 'fr'));

const COMMUNES_PAR_CP: Record<string, string> = {
  '97400': 'Saint-Denis (97400)', '97438': 'Sainte-Marie (97438)', '97441': 'Sainte-Suzanne (97441)',
  '97440': 'Saint-André (97440)', '97412': 'Bras-Panon (97412)', '97433': 'Salazie (97433)',
  '97470': 'Saint-Benoît (97470)', '97431': 'La Plaine-des-Palmistes (97431)', '97439': 'Sainte-Rose (97439)',
  '97442': 'Saint-Philippe (97442)', '97480': 'Saint-Joseph (97480)', '97429': 'Petite-Île (97429)',
  '97430': 'Le Tampon (97430)', '97410': 'Saint-Pierre (97410)', '97414': 'Entre-Deux (97414)',
  '97427': "L'Étang-Salé (97427)", '97425': 'Les Avirons (97425)', '97450': 'Saint-Louis (97450)',
  '97413': 'Cilaos (97413)', '97436': 'Saint-Leu (97436)', '97426': 'Trois-Bassins (97426)',
  '97460': 'Saint-Paul (97460)', '97419': 'La Possession (97419)', '97420': 'Le Port (97420)',
};

const ANNEE_COURANTE = new Date().getFullYear();
const ANNEES = Array.from({ length: ANNEE_COURANTE - 1980 + 1 }, (_, i) => ANNEE_COURANTE - i);

const DUREES = [
  { id: '2semaines', label: '2 semaines', prix: 5 },
  { id: '1mois', label: '1 mois', prix: 8 },
];

const DUREES_PRO = [
  { id: '2semaines', label: '2 semaines', prix: 7 },
  { id: '1mois', label: '1 mois', prix: 10 },
];

const PRIX_BOOST = 3;

// L'adresse ci-dessous ne paie jamais ses propres annonces (compte du site).
const EMAIL_ADMIN = 'priscilla.coulibaly@gmail.com';

const MAX_PHOTOS_SANS_VIDEO = 8;
const MAX_PHOTOS_AVEC_VIDEO = 4;

const OPTIONS_CT = [
  { id: 'moins_6_mois', label: 'Contrôle technique de moins de 6 mois' },
  { id: 'plus_6_mois', label: 'Contrôle technique de plus de 6 mois' },
  { id: 'aucun', label: 'Sans contrôle technique' },
] as const;

function FormulaireCreerAnnonce() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [form, setForm] = useState({
    titre: '', marque: searchParams.get('marque') || MARQUES[0], modele: searchParams.get('modele') || '',
    annee: searchParams.get('annee') || String(ANNEE_COURANTE), kilometrage: '',
    carburant: 'essence', boite: 'manuelle', prix: '', commune: COMMUNES[0], description: '',
  });
  const [communeSaisie, setCommuneSaisie] = useState('');
  const [duree, setDuree] = useState(DUREES[0].id);
  const [boostSouhaite, setBoostSouhaite] = useState(false);
  const [modeDepot, setModeDepot] = useState<'sans_video' | 'avec_video'>('sans_video');
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [controleTechnique, setControleTechnique] = useState('');
  const [documentCT, setDocumentCT] = useState<File | null>(null);
  const [pourPieces, setPourPieces] = useState(false);
  const [typeVendeurCompte, setTypeVendeurCompte] = useState<'particulier' | 'professionnel'>('particulier');
  const [telephoneCompte, setTelephoneCompte] = useState('');
  const [certifieExact, setCertifieExact] = useState(false);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [estGratuite, setEstGratuite] = useState<boolean | null>(null);
  const [compteIllimite, setCompteIllimite] = useState(false);
  const [solde, setSolde] = useState(0);

  const dureesActuelles = typeVendeurCompte === 'professionnel' ? DUREES_PRO : DUREES;

  const maxPhotos = modeDepot === 'avec_video' ? MAX_PHOTOS_AVEC_VIDEO : MAX_PHOTOS_SANS_VIDEO;

  function changerModeDepot(mode: 'sans_video' | 'avec_video') {
    setModeDepot(mode);
    if (mode === 'avec_video') {
      setPhotos((p) => p.slice(0, MAX_PHOTOS_AVEC_VIDEO));
    } else {
      setVideo(null);
    }
  }

  function choisirPhotos(fichiers: File[]) {
    if (fichiers.length > maxPhotos) {
      setErreur(`Maximum ${maxPhotos} photos en mode "${modeDepot === 'avec_video' ? 'avec vidéo' : 'sans vidéo'}". Les ${fichiers.length - maxPhotos} photo(s) en trop n'ont pas été ajoutées.`);
    } else {
      setErreur('');
    }
    setPhotos(fichiers.slice(0, maxPhotos));
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/connexion?retour=/creer-annonce');
        return;
      }
      if (data.user.email === EMAIL_ADMIN) {
        setEstGratuite(true);
        return;
      }
      const { data: profil } = await supabase
        .from('profiles')
        .select('annonce_gratuite_utilisee, solde, compte_illimite, type_vendeur, telephone')
        .eq('id', data.user.id)
        .single();
      setCompteIllimite(!!profil?.compte_illimite);
      setTypeVendeurCompte(profil?.type_vendeur === 'professionnel' ? 'professionnel' : 'particulier');
      setTelephoneCompte(profil?.telephone ?? '');
      const estPro = profil?.type_vendeur === 'professionnel';
      setEstGratuite(profil?.compte_illimite ? true : estPro ? false : !profil?.annonce_gratuite_utilisee);
      setSolde(profil?.solde ?? 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function champ(nom: string, valeur: string) {
    setForm((f) => ({ ...f, [nom]: valeur }));
  }

  function saisirCommune(valeur: string) {
    setCommuneSaisie(valeur);
    if (/^\d+$/.test(valeur.trim())) {
      const communeParCP = COMMUNES_PAR_CP[valeur.trim()];
      if (communeParCP) champ('commune', communeParCP);
      return;
    }
    const trouvee = COMMUNES.find(
      (c) => communeSansCP(c).toLowerCase() === valeur.trim().toLowerCase()
    );
    if (trouvee) champ('commune', trouvee);
  }

  const communeSansCP = (c: string) => c.replace(/\s*\(\d{5}\)$/, '');

  async function publier(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setErreur('Connecte-toi avant de déposer une annonce.');
      return;
    }

    setEnvoi(true);
    const userId = userData.user.id;
    const modeleFinal = form.modele.trim();

    if (!modeleFinal) {
      setErreur('Indique le modèle du véhicule.');
      setEnvoi(false);
      return;
    }

    if (!controleTechnique) {
      setErreur('Précise la situation du contrôle technique.');
      setEnvoi(false);
      return;
    }

    if (!telephoneCompte.trim()) {
            setErreur("Merci de renseigner un numéro de téléphone : c'est le seul moyen pour un acheteur intéressé de te contacter.");
            setEnvoi(false);
            return;
    }
    
    if (!certifieExact) {
      setErreur("Merci de cocher la case de certification en bas du formulaire avant de publier.");
      setEnvoi(false);
      return;
    }

    if (photos.length === 0) {
      setErreur('Ajoute au moins une photo du véhicule.');
      setEnvoi(false);
      return;
    }

    try {
      const { data: profil } = await supabase
        .from('profiles')
        .select('annonce_gratuite_utilisee, compte_illimite, type_vendeur, telephone')
        .eq('id', userId)
        .single();

            if (profil?.telephone !== telephoneCompte.trim()) {
                      await supabase.from('profiles').update({ telephone: telephoneCompte.trim() }).eq('id', userId);
            }

      const compteIllimiteActuel = userData.user.email === EMAIL_ADMIN || !!profil?.compte_illimite;
      const estPro = profil?.type_vendeur === 'professionnel';
      const estGratuiteActuelle = compteIllimiteActuel || (estPro ? false : !profil?.annonce_gratuite_utilisee);

      // Protection anti-spam : pas plus de 5 annonces déposées par jour (sauf compte admin / illimité)
      if (!compteIllimiteActuel) {
        const depuis24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count } = await supabase
          .from('listings')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', depuis24h);

        if ((count ?? 0) >= 5) {
          setErreur('Tu as atteint la limite de 5 annonces déposées en 24h. Réessaie demain.');
          setEnvoi(false);
          return;
        }
      }

      // Anti-triche : un compte particulier ne peut pas avoir plus de 2 annonces en ligne
      // en même temps (au-delà, il s'agit très probablement d'un professionnel déguisé).
      let flagTelephoneDuplique = false;
      if (!compteIllimiteActuel && !estPro) {
        const { count: nombreActives } = await supabase
          .from('listings')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('statut', 'en_ligne');

        if ((nombreActives ?? 0) >= 2) {
          setErreur(
            "Un compte particulier est limité à 2 annonces en ligne à la fois. Si tu vends plusieurs véhicules régulièrement, crée un compte professionnel (menu \"Mon profil\")."
          );
          setEnvoi(false);
          return;
        }

        // Anti-triche : même numéro de téléphone utilisé par un autre compte particulier
        if (profil?.telephone) {
          const { data: autresComptes } = await supabase
            .from('profiles')
            .select('id')
            .eq('telephone', profil.telephone)
            .neq('id', userId)
            .limit(1);
          if (autresComptes && autresComptes.length > 0) {
            flagTelephoneDuplique = true;
          }
        }
      }

      const cheminsPhotos: string[] = [];
      for (const [i, photoOriginale] of photos.entries()) {
        const photo = await compresserPhoto(photoOriginale);
        const chemin = `${userId}/${Date.now()}-${i}-${photo.name}`;
        const { error } = await supabase.storage.from('photos').upload(chemin, photo);
        if (error) throw error;
        cheminsPhotos.push(chemin);
      }

      let cheminVideo: string | null = null;
      if (video) {
        cheminVideo = `${userId}/${Date.now()}-${video.name}`;
        const { error } = await supabase.storage.from('videos').upload(cheminVideo, video);
        if (error) throw error;
      }

      let cheminDocumentCT: string | null = null;
      if (documentCT) {
        cheminDocumentCT = `${userId}/${Date.now()}-ct-${documentCT.name}`;
        const { error } = await supabase.storage.from('documents').upload(cheminDocumentCT, documentCT);
        if (error) throw error;
      }

      const dureeInfo = dureesActuelles.find((d) => d.id === duree)!;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (dureeInfo.id === '1mois' ? 30 : 14));

      const { data: nouvelleAnnonce, error: erreurInsertion } = await supabase
        .from('listings')
        .insert({
          user_id: userId,
          titre: form.titre,
          marque: form.marque,
          modele: modeleFinal,
          annee: Number(form.annee),
          kilometrage: Number(form.kilometrage),
          carburant: form.carburant,
          boite: form.boite,
          prix: Number(form.prix),
          commune: communeSansCP(form.commune),
          description: form.description,
          photos: cheminsPhotos,
          video_path: cheminVideo,
          controle_technique: controleTechnique,
          document_ct_path: cheminDocumentCT,
          pour_pieces: pourPieces,
          type_annonce: typeVendeurCompte,
          statut: estGratuiteActuelle ? 'en_ligne' : 'en_attente_paiement',
          duree_jours: dureeInfo.id === '1mois' ? 30 : 14,
          expires_at: estGratuiteActuelle ? expiresAt.toISOString() : null,
          raison_verification: flagTelephoneDuplique ? 'telephone_duplique' : null,
        })
        .select()
        .single();

      if (erreurInsertion) throw erreurInsertion;

      // Vérification automatique par IA : la photo doit bien montrer un véhicule
      const reponseVerif = await fetch('/api/verifier-annonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: nouvelleAnnonce.id }),
      });
      const { statut: statutVerif } = await reponseVerif.json();

      if (statutVerif === 'rejete') {
        setErreur(
          "La photo principale ne semble pas montrer un véhicule. Ce site est réservé aux annonces de véhicules — vérifie tes photos et réessaie."
        );
        setEnvoi(false);
        return;
      }

      let statutVerifFinal = statutVerif;
      if (flagTelephoneDuplique && statutVerif === 'valide') {
        await supabase
          .from('listings')
          .update({ moderation_statut: 'a_verifier' })
          .eq('id', nouvelleAnnonce.id);
        statutVerifFinal = 'a_verifier';
      }

      if (estGratuiteActuelle) {
        if (!estPro) {
          await supabase
            .from('profiles')
            .update({ annonce_gratuite_utilisee: true })
            .eq('id', userId);
        }

        if (boostSouhaite) {
          const reponseBoost = await fetch('/api/paiement-boost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listingId: nouvelleAnnonce.id }),
          });
          const resultatBoost = await reponseBoost.json();
          if (resultatBoost.url) {
            window.location.href = resultatBoost.url;
            return;
          }
        }

        if (statutVerifFinal === 'a_verifier') {
          setErreur(
            "Ton annonce a bien été créée, mais elle sera visible publiquement dès qu'un contrôle rapide de notre équipe l'aura validée (généralement sous quelques heures)."
          );
          fetch('/api/notifier-moderation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ marque: form.marque, modele: modeleFinal, listingId: nouvelleAnnonce.id }),
          }).catch(() => {});
        }

        router.push(`/listing/${nouvelleAnnonce.id}`);
        return;
      }

      const reponse = await fetch('/api/paiement-annonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: nouvelleAnnonce.id, dureeId: duree, boost: boostSouhaite, pro: estPro }),
      });
      const resultat = await reponse.json();
      if (resultat.error) throw new Error(resultat.error);

      if (resultat.payeParSolde) {
        router.push(`/listing/${nouvelleAnnonce.id}`);
        return;
      }

      if (!resultat.url) {
        setErreur(
          "Ton annonce a été créée, mais le paiement n'a pas pu démarrer. Retrouve-la dans \"Mes annonces\" pour réessayer de payer."
        );
        setEnvoi(false);
        return;
      }

      window.location.href = resultat.url;
    } catch (err: any) {
      setErreur(err.message ?? "Une erreur est survenue, réessaie.");
    } finally {
      setEnvoi(false);
    }
  }

  const prixDuree = estGratuite === false ? dureesActuelles.find((d) => d.id === duree)?.prix ?? 0 : 0;
  const prixTotal = prixDuree + (boostSouhaite ? PRIX_BOOST : 0);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="font-display text-2xl text-vanille">Déposer une annonce</h1>
      <p className="mt-1 text-vanille/60">
        Plus ton annonce est complète (et filmée), plus vite tu trouveras un acheteur sérieux.
      </p>
      <p className="mt-1 text-xs text-vanille/40">* Champs obligatoires — les autres sont facultatifs.</p>

      {estGratuite !== null && (
        <div className={`mt-6 rounded-xl border px-4 py-3 text-sm ${estGratuite ? 'border-lagon/30 bg-lagon/5 text-lagon' : 'border-fournaise/30 bg-fournaise/5 text-fournaise'}`}>
          {compteIllimite
            ? '🏢 Compte à accès illimité : dépôt gratuit, sans limite quotidienne.'
            : typeVendeurCompte === 'professionnel'
              ? `🏢 Compte professionnel : tarif pro applicable (7 € les 2 semaines, 10 € le mois). Solde disponible : ${solde.toFixed(2)} €.`
              : estGratuite
                ? "C'est ta première annonce : elle est gratuite et sera publiée immédiatement."
                : `Ta première annonce gratuite a déjà été utilisée. Solde disponible : ${solde.toFixed(2)} €.`}
        </div>
      )}

      <form onSubmit={publier} className="mt-8 flex flex-col gap-5">
        <input
          placeholder="Titre de l'annonce * (ex : Clio 4 entretien suivi, 1ère main)"
          value={form.titre}
          onChange={(e) => champ('titre', e.target.value)}
          required
          className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
        />

        <div className="grid grid-cols-2 gap-4">
          <ChampAutocomplete
            valeur={form.marque}
            onChange={(v) => champ('marque', v)}
            suggestions={MARQUES}
            placeholder="Marque *"
          />
          <ChampAutocomplete
            valeur={form.modele}
            onChange={(v) => champ('modele', v)}
            suggestions={MODELES_PAR_MARQUE[form.marque] ?? Object.values(MODELES_PAR_MARQUE).flat()}
            placeholder="Modèle *"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select value={form.annee} onChange={(e) => champ('annee', e.target.value)}
            className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille">
            {ANNEES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <input type="number" placeholder="Kilométrage *" value={form.kilometrage} onChange={(e) => champ('kilometrage', e.target.value)} required
            className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select value={form.carburant} onChange={(e) => champ('carburant', e.target.value)}
            className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille">
            <option value="essence">Essence</option>
            <option value="diesel">Diesel</option>
            <option value="hybride">Hybride</option>
            <option value="electrique">Électrique</option>
          </select>
          <select value={form.boite} onChange={(e) => champ('boite', e.target.value)}
            className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille">
            <option value="manuelle">Manuelle</option>
            <option value="automatique">Automatique</option>
          </select>
        </div>

        <input type="number" placeholder="Prix (€) *" value={form.prix} onChange={(e) => champ('prix', e.target.value)} required
          className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon" />

        <div>
          <label className="mb-2 block text-sm font-medium text-vanille">Commune *</label>
          <div className="grid grid-cols-2 gap-4">
          <div>
            <ChampAutocomplete
              valeur={communeSaisie}
              onChange={saisirCommune}
              suggestions={VILLES_SIMPLE}
              placeholder="Ville ou code postal (ex : Le Port, 97410...)"
            />
            {COMMUNES_PAR_CP[communeSaisie.trim()] && (
              <p className="mt-1 pl-2 text-xs text-lagon">
                → {communeSansCP(COMMUNES_PAR_CP[communeSaisie.trim()])} sélectionnée
              </p>
            )}
          </div>
            <select value={form.commune} onChange={(e) => { champ('commune', e.target.value); setCommuneSaisie(''); }}
              className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille">
              {COMMUNES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

                <div>
                          <label className="mb-2 block text-sm font-medium text-vanille">Téléphone de contact *</label>
                          <p className="mb-2 text-xs text-vanille/50">
                                      Obligatoire : c'est le seul moyen pour un acheteur intéressé de te contacter directement.
                          </p>
                          <input
                                        type="tel"
                                        placeholder="Ex : 0692 12 34 56"
                                        value={telephoneCompte}
                                        onChange={(e) => setTelephoneCompte(e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
                                      />
                </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-vanille">Description *</label>
          <p className="mb-2 text-xs text-vanille/50">
            Décris le véhicule avec tes mots : état général, entretien, options, raison de la vente...
          </p>
          <textarea
            placeholder="Ex : Véhicule bien entretenu, révisions à jour, pneus neufs, climatisation..."
            value={form.description}
            onChange={(e) => champ('description', e.target.value)}
            rows={5}
            required
            className="w-full rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-vanille placeholder:text-vanille/40 focus:border-lagon"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-vanille">Photos et vidéo * (au moins 1 photo)</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => changerModeDepot('sans_video')}
              className={`rounded-xl border px-4 py-3 text-left text-sm ${
                modeDepot === 'sans_video'
                  ? 'border-lagon bg-lagon/10 text-lagon'
                  : 'border-white/10 bg-basalte2 text-vanille/70'
              }`}
            >
              <span className="block font-semibold">Sans vidéo</span>
              <span className="block text-xs opacity-80">Jusqu&apos;à {MAX_PHOTOS_SANS_VIDEO} photos</span>
            </button>
            <button
              type="button"
              onClick={() => changerModeDepot('avec_video')}
              className={`rounded-xl border px-4 py-3 text-left text-sm ${
                modeDepot === 'avec_video'
                  ? 'border-lagon bg-lagon/10 text-lagon'
                  : 'border-white/10 bg-basalte2 text-vanille/70'
              }`}
            >
              <span className="block font-semibold">Avec vidéo 🎥</span>
              <span className="block text-xs opacity-80">Limité à {MAX_PHOTOS_AVEC_VIDEO} photos (fichiers plus légers)</span>
            </button>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-vanille">
              Photos ({photos.length}/{maxPhotos})
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => choisirPhotos(Array.from(e.target.files ?? []))}
              className="w-full rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-sm text-vanille/70"
            />
            {photos.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {photos.map((photo, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos((p) => p.filter((_, index) => index !== i))}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-basalte/90 text-xs text-vanille"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {modeDepot === 'avec_video' && (
            <div className="mt-4">
              <VideoUploader onFichierValide={setVideo} />
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-vanille">Contrôle technique *</label>
          <div className="flex flex-col gap-2">
            {OPTIONS_CT.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                  controleTechnique === option.id
                    ? 'border-lagon bg-lagon/10 text-lagon'
                    : 'border-white/10 bg-basalte2 text-vanille/80'
                }`}
              >
                <input
                  type="radio"
                  name="controle-technique"
                  checked={controleTechnique === option.id}
                  onChange={() => setControleTechnique(option.id)}
                  className="h-4 w-4 accent-lagon"
                />
                {option.label}
              </label>
            ))}
          </div>

          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium text-vanille">
              Photo du contrôle technique (facultatif)
            </label>
            <p className="mb-2 text-xs text-fournaise/90">
              ⚠️ Cache ou masque bien ton nom, ton adresse et l&apos;immatriculation avant de
              prendre la photo : seules les infos sur l&apos;état du véhicule doivent être
              visibles. Tu es seul(e) responsable des informations que contient ce document.
            </p>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setDocumentCT(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-white/10 bg-basalte2 px-4 py-3 text-sm text-vanille/70"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-basalte2 px-4 py-3">
          <input
            type="checkbox"
            checked={pourPieces}
            onChange={(e) => setPourPieces(e.target.checked)}
            className="h-4 w-4 accent-fournaise"
          />
          <span className="text-sm text-vanille">
            🔧 Véhicule vendu uniquement pour pièces (non roulant / accidenté)
          </span>
        </label>

        <div className="rounded-xl border border-white/10 bg-basalte2 px-4 py-3">
          <p className="text-sm font-medium text-vanille">Type de compte</p>
          <p className="mt-1 text-sm text-vanille/70">
            {typeVendeurCompte === 'professionnel' ? (
              <>🏢 Professionnel — cette annonce sera publiée avec le badge "Professionnel".</>
            ) : (
              <>
                Particulier — pour vendre régulièrement plusieurs véhicules, passe en compte
                professionnel depuis "Mon profil".
              </>
            )}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-vanille">
            Durée de publication
            {estGratuite === true &&
              (compteIllimite ? ' (compte à accès illimité)' : ' (offerte pour cette 1ère annonce)')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {dureesActuelles.map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setDuree(d.id)}
                className={`rounded-xl border px-4 py-3 text-sm ${
                  duree === d.id
                    ? 'border-lagon bg-lagon/10 text-lagon'
                    : 'border-white/10 bg-basalte2 text-vanille/70'
                }`}
              >
                {d.label} {estGratuite === false && `— ${d.prix} €`}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-basalte2 px-4 py-3">
          <input
            type="checkbox"
            checked={boostSouhaite}
            onChange={(e) => setBoostSouhaite(e.target.checked)}
            className="h-4 w-4 accent-fournaise"
          />
          <span className="text-sm text-vanille">
            🚀 Booster mon annonce dès sa publication (+{PRIX_BOOST} €, remonte en tête pendant 7 jours)
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-basalte2 px-4 py-3">
          <input
            type="checkbox"
            checked={certifieExact}
            onChange={(e) => setCertifieExact(e.target.checked)}
            required
            className="mt-0.5 h-4 w-4 accent-lagon"
          />
          <span className="text-sm text-vanille">
            Je certifie que les informations et documents de cette annonce sont exacts, que j&apos;ai
            le droit de les publier, et j&apos;assume l&apos;entière responsabilité de leur contenu.
            {typeVendeurCompte === 'particulier' && (
              <> Je certifie être un particulier vendant mon propre véhicule, et non un professionnel
              de l&apos;automobile.</>
            )}{' '}
            Annonce Auto.re n&apos;intervient pas dans la transaction et ne peut être tenu
            responsable des informations fournies par le vendeur.
          </span>
        </label>

        {erreur && <p className="text-sm text-fournaise">{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="rounded-full bg-fournaise px-6 py-3 text-sm font-semibold text-vanille shadow-lg shadow-fournaise/20 hover:bg-fournaise/90 disabled:opacity-50"
        >
          {envoi
            ? 'Publication en cours...'
            : prixTotal > 0
              ? `Publier l'annonce (${prixTotal} €)`
              : "Publier l'annonce"}
        </button>
      </form>
    </div>
  );
}

export default function CreerAnnonce() {
  return (
    <Suspense fallback={<div className="px-5 py-10 text-vanille/50">Chargement...</div>}>
      <FormulaireCreerAnnonce />
    </Suspense>
  );
}
