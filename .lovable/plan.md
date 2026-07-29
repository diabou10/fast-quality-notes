## Objectif

Étendre l'app actuelle avec :
1. La base de typologies issue du PDF (14 catégories, chacune avec 1 à 3 variantes de description).
2. La possibilité d'ajouter / modifier / supprimer des typologies et leurs descriptions.
3. Recherche instantanée + bouton Copier (déjà en place, à adapter au nouveau modèle).

## Modèle de données

Nouveau schéma : une typologie = un titre (ex. "Refund") + une liste de variantes de description (car le PDF en fournit plusieurs par catégorie).

```ts
type Typology = {
  id: string;
  title: string;         // ex: "Refund", "Recover PIN"
  category?: string;     // optionnel (Pass/Fail/Note), non requis
  descriptions: string[]; // 1..n variantes
};
```

Chaque variante affiche son propre bouton "Copier".

## Persistance

Stockage local via `localStorage` (clé `qualitynotes.typologies.v1`) :
- ultra-rapide, aucun backend, aucune auth
- au 1er chargement, on seed avec les données du PDF
- CRUD purement client

Pas de Lovable Cloud pour rester "simple et ultra-rapide" (usage mono-utilisateur). Si tu veux synchroniser entre appareils plus tard, on activera Cloud.

## Données seed (extraites du PDF)

Refund, Recover PIN, Reset PIN, Forget QR, Device Restriction, Lost Phone, Security Challenge, Vault, B2W, Minor Request, Turn, Terminate Account, Rebalance, SMS Code — avec les descriptions exactes du fichier (le bloc "Refund" contient aussi les 3 notes complémentaires trouvées en bas du PDF : "La rep n'a pas effectué le remboursement…", etc., ajoutées comme variantes supplémentaires).

## UI (une seule page, `src/routes/index.tsx`)

```
┌──────────────────────────────────────────┐
│  Typologies                [+ Ajouter]   │
│  ┌────────────────────────────────────┐  │
│  │ 🔍 Rechercher…            14 rés.  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌── Refund ────────── ✏️ 🗑️ ─────────┐ │
│  │ • Ce client souhaite annuler…  📋 │ │
│  │ • La cliente souhaitait annuler📋 │ │
│  │ • Cette cliente a effectué…    📋 │ │
│  │ [+ Ajouter une variante]           │ │
│  └────────────────────────────────────┘ │
│  ┌── Recover PIN ─────── ✏️ 🗑️ ──────┐ │
│  │ …                                  │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

Interactions :
- **Recherche** : match sur titre + toutes les variantes. Si un mot matche seulement certaines variantes, seules celles-ci sont affichées dans la carte (les autres masquées).
- **Copier** : bouton par variante, feedback "Copié" 1,4 s (déjà en place).
- **Ajouter typologie** : dialog (shadcn `Dialog`) avec champ Titre + 1 champ Description (multi-ligne). Bouton "+ variante" dans le dialog.
- **Éditer typologie** : même dialog pré-rempli ; permet de renommer, éditer / supprimer chaque variante, ajouter une variante.
- **Supprimer typologie** : confirmation inline (AlertDialog).
- **Ajouter variante rapide** depuis la carte : bouton discret en bas de carte ouvre le dialog d'édition sur la variante vide.

## Détails techniques

- Composants shadcn utilisés : `Dialog`, `AlertDialog`, `Button`, `Input`, `Textarea`, `Badge`. Ceux qui manquent seront ajoutés (fichiers `src/components/ui/*.tsx` déjà présents pour la plupart ; on créera ceux qui manquent au moment de l'implémentation).
- Nouveau hook `src/hooks/use-typologies.ts` : charge depuis localStorage (seed si vide), expose `typologies`, `addTypology`, `updateTypology`, `deleteTypology`, `addDescription`, `updateDescription`, `deleteDescription`. Persiste à chaque changement.
- Données seed dans `src/data/typologies-seed.ts` (texte exact du PDF, apostrophes typographiques nettoyées).
- `id` généré via `crypto.randomUUID()`.
- Recherche : `useMemo` insensible aux accents (`.normalize('NFD').replace(/\p{Diacritic}/gu, '')`) pour matcher "reference" / "référence".
- Métadonnées `head()` de la route inchangées.

## Étapes d'implémentation

1. Créer `src/data/typologies-seed.ts` avec les 14 typologies extraites du PDF.
2. Créer `src/hooks/use-typologies.ts` (CRUD + localStorage + seed).
3. Ajouter les composants shadcn manquants (`dialog`, `alert-dialog`, `textarea` si absents).
4. Réécrire `src/routes/index.tsx` : header + barre de recherche + liste des cartes + dialogs d'ajout/édition + confirmations de suppression. Conserver le style épuré actuel (tokens `bg-card`, `border-border`, `text-foreground`, etc.).
5. Vérifier le rendu (recherche, copier, add/edit/delete, refresh conserve les modifs).

## Hors périmètre

- Pas de synchro multi-appareils / multi-utilisateurs (localStorage seulement).
- Pas d'import/export JSON (peut être ajouté ensuite si besoin).
- Pas de catégories Pass/Fail (le PDF ne les utilise pas explicitement — remplacé par variantes multiples).
