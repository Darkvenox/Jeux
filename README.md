# 🍮 Far Breton — recette interactive

Petite application web (un seul fichier, sans dépendance ni build) pour réussir un far breton
aux pruneaux : ingrédients ajustables et suivi guidé pas à pas.

## Utilisation

Ouvrez `index.html` dans un navigateur. C'est tout — ça marche aussi hors ligne,
depuis un téléphone posé sur le plan de travail.

## Fonctionnalités

**Menu d'accueil**
- écran de départ avec le choix de la version, puis deux entrées :
  « Voir les ingrédients » ou « Démarrer directement le pas à pas »
- retour au menu à tout moment depuis la vue recette (‹ Menu)

**Deux versions**
- **Classique au rhum** — pruneaux macérés au rhum ambré
- **Sans alcool** — pruneaux gonflés au thé noir + eau de fleur d'oranger
- le choix change les ingrédients *et* le texte des étapes concernées ; il est mémorisé

**Nombre de personnes**
- boutons − / + (par pas de 1, et de 0,5 sous 1 personne) et raccourcis 2 / 4 / 6 / 8 / 10 / 12
- toutes les quantités se recalculent instantanément à partir de la base pour 6 personnes

**Proportions modifiables**
- chaque quantité est un champ éditable : tapez ce dont vous disposez réellement
  (« j'ai 750 g de pruneaux ») et **toute la recette + le nombre de personnes se réajustent**
- **arrondis en nombres entiers** pour tout ce qui se pèse (grammes, œufs, cuillères) ;
  seuls les liquides gardent des décimales quand c'est utile (1,5 L de lait, 4,5 cl de rhum)
- bascule automatique ml → L au-delà du litre
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

## Sans JavaScript

Certaines visionneuses (aperçu de fichier sur mobile, pièce jointe dans une messagerie)
affichent le HTML sans exécuter les scripts. La page reste utilisable :

- navigation menu ↔ recette par ancres (`#recipe:target`)
- choix de la version par boutons radio + labels, en CSS pur
- nombre de personnes réglable de 1 à 24 : les boutons − et + sont des labels qui
  cochent la valeur voisine, et les raccourcis 2 à 12 restent disponibles
- quantités pré-calculées pour chaque nombre de personnes, dans les deux versions
- les commandes qui exigent le script (saisie libre d'une quantité, réglage au-delà
  de 24, pas à pas et minuteurs) sont masquées, et un encadré explique comment
  retrouver la version complète

Dès que le script s'exécute, il pose la classe `js` sur `<html>` et reprend la main
sur l'affichage.

Les listes figées sont générées depuis l'application elle-même — la page est ouverte
dans un navigateur et les valeurs affichées sont relevées telles quelles :

```sh
npm i playwright
node tools/build-static.js     # 48 listes, entre STATIC:BEGIN et STATIC:END
```

À relancer après toute modification des ingrédients ou des règles d'arrondi.

## Structure

Tout tient dans `index.html`. La recette est décrite en haut du script, facile à modifier :

```js
const BASE_SERVINGS = 6;          // quantités de référence
const VARIANTS    = [ … ];        // id, icône, nom, description
const INGREDIENTS = [ … ];        // id, quantité, unité, nom, note, fixed/liquid/only
const STEPS       = [ … ];        // titre, texte, ingrédients liés, astuce, minuteur (s)
```

- `fixed: true` → ingrédient non proportionnel (la pincée de sel)
- `liquid: true` → décimales autorisées ; sinon la quantité est arrondie à l'entier
- `only: "sansAlcool"` → ingrédient réservé à une version
- `timer: 600` → minuteur de l'étape, en secondes
- `text` / `tip` acceptent une chaîne, ou un objet `{classique: "…", sansAlcool: "…"}`
  pour un texte propre à chaque version
