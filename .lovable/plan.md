## Où sont tes données aujourd'hui

Dans le `localStorage` du navigateur (clé `qualitynotes.typologies.v2`), via `src/hooks/use-typologies.ts`. C'est du stockage **local à chaque navigateur** : aucune donnée n'est envoyée au serveur. D'où ton test — l'autre personne modifie sa copie locale, invisible pour toi (et perdue si elle vide son cache ou change d'appareil).

## Objectif

Chaque utilisateur a un compte, retrouve ses données sur n'importe quel appareil, et démarre avec la base pré-remplie (17 process / 52 descriptions) — privée et modifiable individuellement.

## Ce qu'on met en place

**1. Lovable Cloud (backend intégré)**
Base de données + authentification, sans compte externe à créer.

**2. Authentification**
- Email / mot de passe
- Connexion Google (SSO) en un clic
- Page `/auth` (connexion + inscription), déconnexion dans le header
- L'app devient privée : sans connexion → redirection vers `/auth`

**3. Base de données (privée par utilisateur)**

```text
typologies
  id, user_id, title, position, created_at

descriptions
  id, typology_id, user_id, kind ('pass'|'fail'), text, position, created_at
```

Sécurité au niveau des lignes (RLS) : chaque utilisateur ne peut lire/écrire **que** ses propres lignes. Aucune donnée partagée, aucun accès croisé possible.

**4. Pré-remplissage automatique**
À la première connexion, les 17 process et 52 descriptions du seed actuel sont copiés dans le compte de l'utilisateur. Ensuite il ajoute / modifie / supprime librement — ça n'affecte personne d'autre.

**5. Migration des données existantes**
À la première connexion, si le navigateur contient déjà des données locales, on propose de les importer dans le compte (sinon on charge le seed). Ça évite de perdre ce que tu as déjà saisi.

**6. Interface**
Aucun changement visuel majeur : même recherche instantanée, mêmes badges Pass/Fail, mêmes boutons Copier / Éditer / Supprimer. Seuls ajouts : écran de connexion, avatar + déconnexion dans le header, et un léger indicateur de sauvegarde.

## Détails techniques

- Activation Lovable Cloud, puis migration SQL créant les 2 tables avec `GRANT` + RLS scopée sur `auth.uid()`.
- Lecture/écriture via server functions authentifiées (`requireSupabaseAuth`), routes protégées sous `src/routes/_authenticated/`.
- Route publique `/` = page d'accueil avec bouton « Se connecter » ; l'app passe sous `/app`.
- `use-typologies.ts` réécrit : TanStack Query (`useQuery` + mutations) au lieu de `localStorage`, avec mise à jour optimiste pour garder la sensation « ultra-rapide ».
- Seeding effectué côté serveur à la première session (fonction serveur idempotente).
- Configuration Google via `supabase--configure_social_auth`.

## Hors périmètre

- Pas de partage / collaboration entre comptes (chaque base reste privée).
- Pas de mode hors-ligne.
- SSO limité à Google (Apple possible ensuite si tu veux).
