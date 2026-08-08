-- ============================================================
-- SCHEMA "RÉUNION AUTO" — à exécuter dans Supabase > SQL Editor
-- ============================================================

-- 1. Profils utilisateurs (lié à l'auth Supabase)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nom_affiche text not null,
  telephone text,
  commune text,
  annonce_gratuite_utilisee boolean not null default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profils visibles par tous"
  on profiles for select using (true);

create policy "Chacun modifie son propre profil"
  on profiles for update using (auth.uid() = id);

create policy "Chacun crée son propre profil"
  on profiles for insert with check (auth.uid() = id);

-- Crée automatiquement un profil à l'inscription
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nom_affiche)
  values (new.id, coalesce(new.raw_user_meta_data->>'nom_affiche', 'Utilisateur'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Annonces
create table listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  titre text not null,
  marque text not null,
  modele text not null,
  annee int not null,
  kilometrage int not null,
  carburant text not null check (carburant in ('essence','diesel','hybride','electrique')),
  boite text not null check (boite in ('manuelle','automatique')),
  prix numeric not null,
  commune text not null,
  description text,
  photos text[] default '{}',       -- chemins storage
  video_path text,                  -- chemin storage de la vidéo courte
  statut text not null default 'en_attente_paiement' check (statut in ('en_attente_paiement','en_ligne','vendu','archive')),
  boost boolean not null default false,
  boost_jusqu_au timestamptz,
  created_at timestamptz default now()
);

alter table listings enable row level security;

create policy "Annonces en ligne visibles par tous"
  on listings for select using (statut = 'en_ligne' or auth.uid() = user_id);

create policy "Un utilisateur connecté crée ses annonces"
  on listings for insert with check (auth.uid() = user_id);

create policy "Le vendeur modifie ses propres annonces"
  on listings for update using (auth.uid() = user_id);

create policy "Le vendeur supprime ses propres annonces"
  on listings for delete using (auth.uid() = user_id);

create index listings_marque_idx on listings (marque);
create index listings_commune_idx on listings (commune);
create index listings_prix_idx on listings (prix);
create index listings_created_idx on listings (created_at desc);

-- ============================================================
-- 3. Stockage (photos + vidéos)
-- À faire manuellement dans Supabase > Storage :
--   - créer un bucket "photos" (public)
--   - créer un bucket "videos" (public)
--   - limite recommandée sur le bucket "videos" : 60 Mo, formats mp4/mov/webm
-- Puis exécuter les policies ci-dessous.
-- ============================================================

create policy "Lecture publique des photos"
  on storage.objects for select using (bucket_id = 'photos');

create policy "Lecture publique des vidéos"
  on storage.objects for select using (bucket_id = 'videos');

create policy "Upload photos par utilisateurs connectés"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');

create policy "Upload vidéos par utilisateurs connectés"
  on storage.objects for insert
  with check (bucket_id = 'videos' and auth.role() = 'authenticated');

create policy "Suppression de ses propres fichiers"
  on storage.objects for delete
  using (auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- MISE À JOUR : portefeuille, durées d'annonce, vues, favoris, signalements
-- ============================================================

-- Portefeuille (solde rechargeable)
alter table profiles add column if not exists solde numeric not null default 0;

-- Durée de vie et expiration des annonces
alter table listings add column if not exists duree_jours int;
alter table listings add column if not exists expires_at timestamptz;
alter table listings add column if not exists vues int not null default 0;

-- Favoris
create table if not exists favoris (
  user_id uuid references profiles(id) on delete cascade not null,
  listing_id uuid references listings(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, listing_id)
);
alter table favoris enable row level security;
create policy "Chacun voit ses propres favoris" on favoris for select using (auth.uid() = user_id);
create policy "Chacun ajoute ses propres favoris" on favoris for insert with check (auth.uid() = user_id);
create policy "Chacun supprime ses propres favoris" on favoris for delete using (auth.uid() = user_id);

-- Signalements d'annonces
create table if not exists signalements (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade not null,
  motif text not null,
  created_at timestamptz default now()
);
alter table signalements enable row level security;
create policy "Tout le monde peut signaler" on signalements for insert with check (true);

-- Historique des recharges de solde (pour traçabilité)
create table if not exists recharges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  montant numeric not null,
  created_at timestamptz default now()
);
alter table recharges enable row level security;
create policy "Chacun voit ses propres recharges" on recharges for select using (auth.uid() = user_id);

-- ============================================================
-- MISE À JOUR : modération automatique des annonces (vérification photo)
-- ============================================================
alter table listings add column if not exists moderation_statut text not null default 'valide'
  check (moderation_statut in ('valide', 'a_verifier', 'rejete'));

-- ============================================================
-- MISE À JOUR : email de contact public sur le profil
-- ============================================================
alter table profiles add column if not exists email_contact text;

-- ============================================================
-- MISE À JOUR : type de vendeur (particulier / professionnel)
-- ============================================================
alter table profiles add column if not exists type_vendeur text not null default 'particulier'
  check (type_vendeur in ('particulier', 'professionnel'));

-- ============================================================
-- MISE À JOUR : comptes professionnels vérifiés (SIRET) + accès illimité
-- ============================================================
alter table profiles add column if not exists siret text;
alter table profiles add column if not exists siret_verifie boolean not null default false;
alter table profiles add column if not exists compte_illimite boolean not null default false;

-- ============================================================
-- MISE À JOUR : notifications internes (annonce validée, etc.)
-- ============================================================
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  message text not null,
  lien text,
  lu boolean not null default false,
  created_at timestamptz default now()
);

alter table notifications enable row level security;

create policy "Chacun voit ses propres notifications"
  on notifications for select using (auth.uid() = user_id);

create policy "Chacun marque ses notifications comme lues"
  on notifications for update using (auth.uid() = user_id);

create policy "Admin peut créer des notifications"
  on notifications for insert
  with check ((auth.jwt() ->> 'email') = 'priscilla.coulibaly@gmail.com');

-- ============================================================
-- Demandes ponctuelles : accès illimité / remise à zéro pour deux comptes
-- (ne fait rien si le compte n'existe pas encore)
-- ============================================================
update profiles set compte_illimite = true, annonce_gratuite_utilisee = false
  where id = (select id from auth.users where email = 'greg.dufranne@gmail.com');

update profiles set compte_illimite = false
  where id = (select id from auth.users where email = 'rdufranne5@gmail.com');

-- ============================================================
-- MISE À JOUR : permettre au compte admin de modérer TOUTES les annonces
-- (sans ça, la page /moderation ne pouvait rien voir ni supprimer)
-- ============================================================
create policy "Admin peut tout voir pour la modération"
  on listings for select using ((auth.jwt() ->> 'email') = 'priscilla.coulibaly@gmail.com');

create policy "Admin peut mettre à jour pour la modération"
  on listings for update using ((auth.jwt() ->> 'email') = 'priscilla.coulibaly@gmail.com');

create policy "Admin peut supprimer pour la modération"
  on listings for delete using ((auth.jwt() ->> 'email') = 'priscilla.coulibaly@gmail.com');

-- ============================================================
-- MISE À JOUR : contrôle technique, pièces, type d'annonce par annonce
-- ============================================================
alter table listings add column if not exists controle_technique text
  check (controle_technique in ('moins_6_mois', 'plus_6_mois', 'aucun'));
alter table listings add column if not exists document_ct_path text;
alter table listings add column if not exists pour_pieces boolean not null default false;
alter table listings add column if not exists type_annonce text not null default 'particulier'
  check (type_annonce in ('particulier', 'professionnel'));

create index if not exists listings_pour_pieces_idx on listings (pour_pieces);

-- ============================================================
-- MISE À JOUR : préférence de contact (masquer le téléphone) + boosters gratuits
-- ============================================================
alter table profiles add column if not exists contact_email_uniquement boolean not null default false;
alter table listings add column if not exists raison_verification text;
alter table profiles add column if not exists boosts_gratuits int not null default 0;

update profiles set boosts_gratuits = 10
  where id = (select id from auth.users where email = 'greg.dufranne@gmail.com');

-- Bucket de stockage pour les documents (ex : contrôle technique)
-- À faire manuellement dans Supabase > Storage :
--   - créer un bucket "documents" (public)
-- Puis exécuter les policies ci-dessous.
drop policy if exists "Lecture publique des documents" on storage.objects;
create policy "Lecture publique des documents"
  on storage.objects for select using (bucket_id = 'documents');

drop policy if exists "Upload documents par utilisateurs connectés" on storage.objects;
create policy "Upload documents par utilisateurs connectés"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.role() = 'authenticated');
