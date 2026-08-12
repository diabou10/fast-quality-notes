# Import intelligent : détection automatique Pass / Fail

Objectif : pouvoir importer un fichier (Excel, CSV/Google Sheets exporté, Word) contenant seulement la typologie et la description — l'application déduit elle-même si chaque description est un **Pass** ou un **Fail**, en s'appuyant sur le training book.

## Ce qui change pour l'utilisateur

1. La colonne « Statut » devient facultative. Si elle est absente ou vide, le statut est déduit du texte.
2. Nouveaux formats acceptés : `.xlsx`, `.xls`, `.csv` (export Google Sheets) et `.docx` (Word).
3. Dans l'aperçu avant import, chaque ligne affiche son statut avec une mention « déduit » quand il n'était pas fourni, et le statut reste modifiable ligne par ligne avant validation.
4. Le modèle Excel téléchargeable est mis à jour : la colonne Statut est indiquée comme optionnelle.

## Règle de détection Pass / Fail

Classement par indices textuels, dans cet ordre :
- Statut explicite fourni dans le fichier → prioritaire, aucune déduction.
- Marqueurs d'échec : « échec », « n'a pas », « omis », « oublié », « manquement », « aurait dû », « il est important de », « il aurait fallu », « non conforme », « sans informer », « ne l'a pas », « défaut de »…
- Marqueurs de réussite : « a procédé », « a informé », « après identification et présentation », « a pris congé », « conforme », « a bien », « a correctement »…
- Formulation prescriptive (conseil au rep) → Fail ; formulation narrative d'actions accomplies → Pass.
- Aucun indice net → Pass par défaut, la ligne est marquée « à vérifier » dans l'aperçu.

En parallèle, la typologie détectée via le training book (`detectTypologyFromText`) sert de renfort : si le titre du fichier est vide, la typologie détectée est proposée.

## Détails techniques

- `src/lib/excel-typologies.ts` :
  - extraire la classification dans `inferKind(text): { kind, inferred, confidence }` avec les listes de marqueurs ci-dessus (normalisation sans accents, déjà présente).
  - `ImportRow` gagne `inferred?: boolean`.
  - `parseTypologiesFile` : `kind` explicite si colonne présente, sinon `inferKind`.
  - nouveau `parseDocxFile` via `mammoth` (extraction texte) : lignes « Typologie : description », titres de paragraphes gras/H1 traités comme typologie courante, paragraphes/puces suivants comme descriptions ; fallback sur `detectTypologyFromText` si aucun titre.
  - dispatch par extension dans `parseTypologiesFile`.
  - `downloadTypologiesTemplate` : mention « Statut (optionnel) » + ligne d'exemple sans statut.
- `src/routes/_authenticated/app.tsx` (`ImportDialog`) : `accept=".xlsx,.xls,.csv,.docx"`, texte de la zone de dépôt mis à jour, badges Pass/Fail cliquables dans l'aperçu pour corriger un statut déduit, compteur « X statuts déduits ».
- Dépendance à ajouter : `mammoth` (lecture .docx côté navigateur).
- Aucun changement de base de données ni de fonctions serveur : l'import existant reçoit toujours `{ title, kind, text }`.
