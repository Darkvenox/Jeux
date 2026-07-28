# 🍮 Far Breton — recette interactive

Petite application web (un seul fichier, sans dépendance ni build) pour réussir un far breton
aux pruneaux : ingrédients ajustables et suivi guidé pas à pas.

## Utilisation

Ouvrez `index.html` dans un navigateur. C'est tout — ça marche aussi hors ligne,
depuis un téléphone posé sur le plan de travail.

## Fonctionnalités

**Nombre de personnes**
- boutons − / + (par pas de 1, et de 0,5 sous 1 personne) et raccourcis 2 / 4 / 6 / 8 / 10 / 12
- toutes les quantités se recalculent instantanément à partir de la base pour 6 personnes

**Proportions modifiables**
- chaque quantité est un champ éditable : tapez ce dont vous disposez réellement
  (« j'ai 750 g de pruneaux ») et **toute la recette + le nombre de personnes se réajustent**
- arrondis « de cuisine » (au 10 g près sur les grosses quantités, au demi-œuf près),
  bascule automatique g → kg et ml → L
- cases à cocher pour la liste de courses / la mise en place
- le réglage est mémorisé (localStorage)

**Mode suivi pas à pas**
- 8 étapes en plein écran, une par écran, avec barre de progression
- les quantités de l'étape en cours, déjà mises à l'échelle, sont rappelées sous le texte
- minuteurs intégrés (trempage 10 min, cuisson 45 min, repos 30 min) avec pause,
  remise à zéro, signal sonore et vibration en fin de compte à rebours
- navigation clavier (← → , Échap) et maintien de l'écran allumé (Wake Lock) pendant le suivi

**Présentation**
- thème clair / sombre automatique, mise en page responsive (mobile en premier)

## Structure

Tout tient dans `index.html`. La recette est décrite en haut du script, facile à modifier :

```js
const BASE_SERVINGS = 6;          // quantités de référence
const INGREDIENTS = [ … ];        // id, quantité, unité, nom, note, fixed/step
const STEPS       = [ … ];        // titre, texte, ingrédients liés, astuce, minuteur (s)
```

- `fixed: true` → ingrédient non proportionnel (la pincée de sel)
- `step: 0.5` → arrondi imposé (œufs, cuillères)
- `timer: 600` → minuteur de l'étape, en secondes
