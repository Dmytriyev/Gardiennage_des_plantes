# Charte graphique — Gardiennage des plantes

> Version 1.0 · 26/10/2026
> Source de vérité technique : [`front/src/index.css`](../front/src/index.css) (bloc `@theme`). En cas d'écart, c'est le code qui fait foi et cette charte qui doit être mise à jour.

---

## 1. Identité

| Élément | Valeur |
|---|---|
| Nom | Gardiennage des plantes |
| Accroche | « Partagez, donnez, faites grandir la vie ! » |
| Mission | Donner des plantes, faire garder les siennes, garder celles des voisins |
| Personnalité | Chaleureuse · accueillante · écologique · simple |
| Ton | Vouvoiement, phrases courtes, bienveillant, jamais technique |

## 2. Logo

Deux feuilles (vert foncé et vert clair) qui sortent d'une main en coupe (jaune) : *on donne, on prend soin*.

| Fichier | Usage |
|---|---|
| [`front/src/components/Logo.jsx`](../front/src/components/Logo.jsx) | Logo dans l'interface (SVG) |
| [`front/public/favicon.svg`](../front/public/favicon.svg) | Icône d'onglet |

**Règles**
- Taille minimale : 24 px. Zone de protection : ¼ de la largeur du logo sur chaque côté.
- Toujours accompagné du nom sur deux lignes : « Gardiennage / des plantes ».
- Sur fond foncé : placer le logo dans une pastille `creme` (cf. pied de page).
- Interdit : déformer, changer les couleurs, ajouter une ombre, poser sur une photo chargée.

## 3. Couleurs

| Jeton | Hex | Rôle | Classe Tailwind |
|---|---|---|---|
| `foret` | `#1E4D33` | Couleur principale : titres, boutons, pied de page | `bg-foret` `text-foret` |
| `feuille` | `#2F7D4A` | Liens, survols, badge **Don** | `text-feuille` |
| `pousse` | `#7CC26A` | Décor uniquement (feuilles, pointillés) | `fill-pousse` |
| `menthe` | `#EAF4E4` | Fond de section | `bg-menthe` |
| `creme` | `#FFFBF3` | Fond de page | `bg-creme` |
| `soleil` | `#F7B928` | Accent : surlignage, numéros d'étapes, focus | `bg-soleil` |
| `soleil-clair` | `#FFF1C9` | Halo, avatars | `bg-soleil-clair` |
| `agrume` | `#B54E0C` | Badge **Demande**, icône de lieu | `bg-agrume` |
| `agrume-clair` | `#FDEBDB` | Fond d'icône Demande | `bg-agrume-clair` |
| `ciel` | `#DCF0FB` | Fond de section, fond d'icône Offre | `bg-ciel` |
| `ciel-fonce` | `#1B6A9E` | Badge **Offre** | `bg-ciel-fonce` |
| `encre` | `#1C2A21` | Texte principal | `text-encre` |
| `mousse` | `#55665A` | Texte secondaire | `text-mousse` |

**Répartition conseillée** : 60 % neutres (creme, blanc), 30 % verts, 10 % accents (soleil, agrume, ciel).

### Code couleur des annonces

Défini une seule fois dans [`front/src/_helpers/annonceTypes.js`](../front/src/_helpers/annonceTypes.js). Ne jamais le recoder ailleurs.

| Type | Badge | Fond doux | Icône |
|---|---|---|---|
| Don | `feuille` + texte blanc | `menthe` | Cadeau |
| Demande de gardiennage | `agrume` + texte blanc | `agrume-clair` | Valise |
| Offre de gardiennage | `ciel-fonce` + texte blanc | `ciel` | Cœur |

### Contrastes (WCAG 2.1)

| Texte / fond | Ratio | Niveau |
|---|---|---|
| encre / creme | 14,5 | AAA |
| blanc / foret | 9,7 | AAA |
| foret / creme | 9,4 | AAA |
| mousse / creme | 5,9 | AA |
| blanc / ciel-fonce | 5,8 | AA |
| foret / soleil | 5,5 | AA |
| blanc / agrume | 5,2 | AA |
| blanc / feuille | 5,1 | AA |
| **soleil / creme** | **1,7** | **Interdit** |

> ⚠️ Le jaune `soleil` ne s'utilise **jamais** comme couleur de texte sur fond clair. Il sert de fond ou de surlignage.

## 4. Typographie

Polices Google Fonts, chargées dans [`front/index.html`](../front/index.html).

| Police | Graisses | Usage |
|---|---|---|
| **Nunito** | 400 · 600 · 700 · 800 | Tout le site (titres et texte) |
| *Caveat* | 600 | Notes manuscrites décoratives : 1 par section au maximum |

| Niveau | Mobile → Desktop | Graisse | Couleur |
|---|---|---|---|
| H1 | 36 → 60 px (`text-4xl` → `lg:text-6xl`) | 800 | foret |
| H2 | 30 → 36 px (`text-3xl` → `sm:text-4xl`) | 800 | foret |
| H3 | 18 – 20 px (`text-lg` / `text-xl`) | 800 | encre |
| Texte courant | 16 – 18 px | 400 | mousse |
| Petit texte, badges | 12 – 14 px | 600 – 700 | — |

**Typographie française** : espace insécable (`&nbsp;` en JSX, ` ` en JS) avant `! ? : ;` et `%` (« 100 % »).

## 5. Iconographie et illustrations

- Icônes au trait, épaisseur 2 px, coins arrondis, style Lucide : [`front/src/components/Icons.jsx`](../front/src/components/Icons.jsx).
- Couleur héritée du texte (`currentColor`). Tailles : 16 px (méta), 20 px (boutons), 28 px (cartes).
- Icône seule = `aria-hidden="true"` + texte lisible ou `sr-only` à côté.
- Décors (soleil, feuilles, vague) : formes simples en SVG, couleurs de la palette uniquement.

## 6. Photographie

- Lumière naturelle, plantes réelles, tons chauds. Pas de visage identifiable sans accord écrit.
- Formats : **4:5** (bannière d'accueil), **4:3** (cartes d'annonce).
- Poids : JPEG qualité 80, ≤ 200 Ko, largeur ≤ 1000 px. Dossier : [`front/public/images/`](../front/public/images/).
- Source : photos des membres, ou banques libres de droits ([Unsplash](https://unsplash.com/license)).

## 7. Composants

| Composant | Spécification |
|---|---|
| Bouton principal | `btn btn-primary` : fond foret, texte blanc, forme pilule ; survol feuille |
| Bouton secondaire | `btn btn-outline` : bordure 2 px foret ; survol fond foret |
| Grand bouton | ajouter `btn-lg` (bannière, appel à l'action) |
| Focus clavier | contour 2 px `soleil`, décalé de 2 px (sur tous les boutons) |
| Carte d'annonce | [`AnnonceCard.jsx`](../front/src/components/AnnonceCard.jsx) : fond blanc, rayon 24 px, image 4:3, badge du type en haut à gauche |
| Badge | pilule, 12 px gras, couleurs du code annonce |

**Rayons** : 9999 px (boutons, badges) · 24 px (cartes) · 40 px (image de la bannière).
**Ombres** : légère (`shadow-sm`) au repos, marquée (`shadow-xl`) au survol.

## 8. Mise en page

- Conteneur : 1152 px max (`max-w-6xl`), marges latérales 16 px (`px-4`).
- Espacement vertical des sections : 80 px (`py-20`).
- Points de rupture : 640 px (`sm`) · 768 px (`md`) · 1024 px (`lg`). Conception *mobile first*, testée dès 360 px.
- Grille des annonces : 1 colonne (mobile) → 2 (`sm`) → 4 (`lg`).
- Alternance des fonds : creme → menthe → creme → blanc → ciel → foret (pied de page).

## 9. Rédaction

| Faire | Éviter |
|---|---|
| Boutons à l'infinitif ou à l'impératif : « Créer une annonce » | « Valider », « OK », « Cliquez ici » |
| « Vous partez en vacances ? » | Jargon technique, anglicismes |
| Une idée par phrase | Paragraphes de plus de 3 lignes |
| Ville seulement, jamais l'adresse exacte | Données personnelles dans une annonce |
