# Réunion Auto — guide de mise en ligne

Site d'annonces de véhicules avec vidéo courte, pour La Réunion.
Stack : **Next.js** (le site) + **Supabase** (comptes, base de données, stockage photos/vidéos) + **Vercel** (hébergement, gratuit).

Tu n'as rien à coder. Suis les étapes dans l'ordre.

## 1. Créer le projet Supabase (base de données + comptes + stockage)

1. Va sur https://supabase.com → crée un compte gratuit.
2. Clique "New Project", donne-lui un nom (ex : `reunion-auto`), choisis un mot de passe de base de données (note-le), région **Europe** de préférence.
3. Une fois le projet créé, va dans l'onglet **SQL Editor** (menu de gauche).
4. Ouvre le fichier `supabase/schema.sql` de ce dossier, copie tout son contenu, colle-le dans l'éditeur SQL, clique **Run**.
5. Va dans l'onglet **Storage** (menu de gauche) :
   - Crée un bucket nommé exactement `photos`, coche "Public bucket".
   - Crée un bucket nommé exactement `videos`, coche "Public bucket".
6. Va dans **Project Settings > API** : tu y trouveras trois valeurs à garder de côté :
   - `Project URL`
   - `anon public` key
   - `service_role` key (⚠️ ne la partage jamais, ne la mets jamais sur un site public)

## 2. Créer ton compte Stripe (pour encaisser les paiements)

1. Va sur https://stripe.com → crée un compte gratuit (aucun frais tant que tu n'encaisses rien).
2. Renseigne tes informations d'entreprise/auto-entrepreneur (Stripe te guide pas à pas).
3. Une fois dans ton tableau de bord Stripe, va dans **Développeurs > Clés API** : copie la clé **"Clé secrète"** (elle commence par `sk_live_` ou `sk_test_` si tu es encore en mode test).
4. On configurera le "webhook" (la connexion technique entre Stripe et ton site) à l'étape 4, une fois le site en ligne — c'est plus simple à faire à ce moment-là.

## 3. Configurer le site avec toutes tes clés

1. Dans ce dossier, renomme le fichier `.env.local.example` en `.env.local`.
2. Ouvre-le et remplace les valeurs par les tiennes :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxx...
   STRIPE_SECRET_KEY=sk_live_xxxxxxx...
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxx...   (on le récupère à l'étape 4)
   NEXT_PUBLIC_SITE_URL=https://reunion-auto.vercel.app   (ton adresse une fois en ligne)
   ```

## 4. Tester en local (optionnel, si tu as Node.js installé)

```bash
npm install
npm run dev
```
Ouvre http://localhost:3000

## 5. Mettre le site en ligne gratuitement avec Vercel

1. Crée un compte sur https://vercel.com (tu peux te connecter avec GitHub).
2. Mets ce dossier de code sur GitHub (crée un nouveau dépôt, dépose les fichiers) — Vercel peut aussi t'accompagner pour ça directement depuis son interface "Import Project".
3. Dans Vercel, clique "Add New Project", sélectionne ton dépôt GitHub `reunion-auto`.
4. Avant de cliquer "Deploy", ouvre la section **Environment Variables** et ajoute les deux mêmes valeurs que dans `.env.local` :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique **Deploy**. Après 1-2 minutes, ton site est en ligne avec une adresse du type `reunion-auto.vercel.app`.
6. Tu pourras ensuite relier un nom de domaine personnalisé (ex : `reunionauto.re`) depuis Vercel > Settings > Domains.

## 6. Brancher Stripe à ton site (webhook)

Cette étape permet à Stripe de prévenir automatiquement ton site quand un paiement est réussi, pour publier l'annonce ou activer le boost tout seul.

1. Une fois ton site en ligne (étape 5 terminée), retourne dans ton tableau de bord Stripe.
2. Va dans **Développeurs > Webhooks > Ajouter un endpoint**.
3. Dans "URL du endpoint", mets : `https://TON-ADRESSE-VERCEL.vercel.app/api/webhook-stripe`
4. Dans "Événements à écouter", sélectionne : `checkout.session.completed`
5. Clique "Ajouter un endpoint". Stripe t'affiche alors une **"Signing secret"** (elle commence par `whsec_`) : copie-la.
6. Retourne dans Vercel > ton projet > Settings > Environment Variables, et mets à jour `STRIPE_WEBHOOK_SECRET` avec cette valeur, puis redéploie (Vercel > Deployments > les 3 petits points > Redeploy).

## Vérification automatique des annonces par IA

Chaque annonce est vérifiée automatiquement après son dépôt pour s'assurer que la photo montre
bien un véhicule.

1. Crée un compte sur https://console.anthropic.com si tu n'en as pas déjà un.
2. Va dans **API Keys**, crée une nouvelle clé, copie-la.
3. Ajoute-la dans Vercel > Environment Variables : `ANTHROPIC_API_KEY`.
4. **Important** : ouvre le fichier `app/moderation/page.tsx` et remplace la ligne
   `const EMAIL_ADMIN = 'priscilla.coulibaly@gmail.com';` par ton adresse email de connexion au
   site, si ce n'est pas déjà la bonne. C'est cette adresse qui aura seule accès à la page
   `/moderation`, où tu pourras valider ou supprimer les annonces que l'IA n'a pas pu trancher
   avec certitude.

## Fonctionnalités pas encore incluses (pour plus tard)

Certaines idées demandent des services externes supplémentaires assez lourds à mettre en place —
elles ne sont pas encore codées, pour ne pas complexifier le site inutilement tant que tu n'en as
pas besoin :
- **Rappel automatique par email avant l'expiration d'une annonce** : nécessite de connecter un
  service d'envoi d'emails (comme Resend), avec un nouveau compte à créer.
- **Carte interactive** montrant les véhicules par commune : nécessite une clé d'API cartographie
  (Google Maps ou Mapbox), payante au-delà d'un certain usage.
- **Système d'avis/notation** entre acheteurs et vendeurs : faisable, mais demande une réflexion
  sur la mise en page avant de le construire proprement.

Dis-moi quand tu voudras qu'on les ajoute.

## Mise à jour de la base de données (nouvelles fonctionnalités)

Si tu avais déjà exécuté le script SQL une première fois, retourne dans Supabase > SQL Editor
et exécute uniquement la nouvelle section ajoutée à la fin de `supabase/schema.sql` (portefeuille,
durées d'annonce, favoris, signalements) — elle est conçue pour ne rien casser si tu la relances
même sur une base déjà existante.

## Suppression automatique des annonces expirées

Une tâche automatique (Vercel Cron) s'exécute chaque nuit pour supprimer les annonces dont la
durée payée est dépassée.

1. Ajoute une nouvelle variable d'environnement dans Vercel : `CRON_SECRET`, avec une phrase secrète
   longue et aléatoire de ton choix (par exemple générée sur https://1password.com/password-generator).
2. Le fichier `vercel.json` fourni active automatiquement cette tâche une fois déployé — rien d'autre
   à faire de ton côté.

## Comment fonctionne l'argent sur ton site

- **1ère annonce d'un utilisateur** : gratuite, publiée immédiatement (durée choisie : 2 semaines ou 1 mois).
- **Annonces suivantes** : 5 € pour 2 semaines, ou 8 € pour 1 mois (modifiable dans `lib/stripe.ts`).
- **Portefeuille (solde)** : chaque utilisateur peut recharger un solde à l'avance (10 €, 25 € ou 50 €) depuis "Mon solde". Ce solde est utilisé en priorité pour payer les annonces suivantes et les boosts.
- **Mise en avant / boost** : 3 € (modifiable dans `lib/stripe.ts`), remonte l'annonce en premier sur la page d'accueil pendant 7 jours.
- **Suppression automatique** : chaque annonce affiche un décompte ("Expire dans X jours") et disparaît automatiquement du site une fois sa durée payée dépassée.
- L'argent des paiements arrive directement sur ton compte Stripe, qui le reverse ensuite sur ton compte bancaire.

## Ce qui est déjà fonctionnel

- Inscription / connexion par email
- Dépôt d'annonce avec menus déroulants (marque, carburant, boîte, commune) et photos + une courte vidéo (limitée à 60 s / 60 Mo)
- Fiche annonce avec lecteur vidéo intégré
- Recherche par marque/modèle, filtre par commune, filtre "avec vidéo"
- Paiement Stripe pour les annonces au-delà de la première, et pour le boost
- Annonces boostées affichées en premier
- Gestion de ses propres annonces (payer, booster, marquer vendu, supprimer)

## Pistes d'amélioration futures

- Messagerie interne acheteur/vendeur (pour éviter de partager son numéro directement)
- Modération des annonces avant publication
- Compression automatique des vidéos côté serveur
- Factures automatiques pour chaque paiement
