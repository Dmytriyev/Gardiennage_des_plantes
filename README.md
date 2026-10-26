<p align="center">
  <img src="front/public/favicon.svg" alt="Logo Gardiennage des plantes" width="72" />
</p>

<h1 align="center">Gardiennage des plantes</h1>

<p align="center"><strong>Partagez, donnez, faites grandir la vie&nbsp;!</strong><br />
Plateforme gratuite d'annonces entre voisins pour donner des plantes, les faire garder ou garder celles des autres.</p>

<p align="center">
  <img src="Document/images/apercu-accueil.jpg" alt="Aperçu de la page d'accueil" width="820" />
</p>

---

## Fonctionnalités

| Type d'annonce | Pour qui |
|---|---|
| 🟢 **Don** | Vous offrez des fleurs ou de petits arbres dont vous n'avez plus besoin |
| 🟠 **Demande de gardiennage** | Vous partez et cherchez quelqu'un pour arroser vos plantes |
| 🔵 **Offre de gardiennage** | Vous proposez de garder les plantes de vos voisins |

- Inscription et connexion sécurisées (bcrypt + JWT)
- Publication d'annonces classées par catégories
- Commentaires sur chaque annonce
- Espace d'administration (utilisateurs, catégories)
- Interface responsive en français, conçue pour l'accessibilité (objectif WCAG 2.1 AA)

## Stack technique

| Front | Back |
|---|---|
| React 19 · React Router 7 · Vite 8 | Node.js · Express 5 |
| Tailwind CSS 4 · Flowbite 4 | MongoDB · Mongoose 9 |
| Axios · jwt-decode | Joi · bcrypt · jsonwebtoken |

## Structure du projet

```
Gardiennage_des_plantes/
├── api/                  # API REST Express
│   ├── controllers/      # Logique métier
│   ├── db/               # Connexion MongoDB
│   ├── middlewares/      # Jeton JWT (auth) et rôle administrateur (admin)
│   ├── models/           # Schémas Mongoose (User, Article, Commentary, Category)
│   ├── routes/           # Définition des routes
│   ├── tests/            # Tests unitaires, d'intégration et de sécurité
│   ├── utils/            # Gestion des erreurs, contrôle auteur/admin
│   ├── validations/      # Schémas Joi et messages en français
│   ├── app.js            # Application Express (sécurité, routes, erreurs)
│   └── server.js         # Point d'entrée (base de données + écoute)
├── front/                # Application React
│   ├── public/images/    # Photos
│   ├── src/
│   │   ├── _helpers/     # Gardes de routes, code couleur, utilitaires
│   │   ├── _services/    # Appels à l'API (Axios)
│   │   ├── components/   # Header, Footer, AnnonceCard, Logo, Icons
│   │   └── pages/        # Pages regroupées par domaine
│   └── tests/            # Tests du front (Vitest)
├── tests/                # Tests d'orthographe et de typographie
├── Document/             # Cahier des charges et charte graphique
├── cspell.json           # Dictionnaire du correcteur orthographique
└── tests.sh              # Lance tous les tests
```

## Installation

**Prérequis** : [Node.js](https://nodejs.org) 20.19 ou plus · [MongoDB](https://www.mongodb.com) (local ou Atlas)

```bash
git clone https://github.com/Dmytriyev/Gardiennage_des_plantes.git
cd Gardiennage_des_plantes
npm install               # outils de test (correcteur orthographique)
```

### 1. API

```bash
cd api
npm install
cp .env.example .env
```

Renseigner `.env` :

| Variable | Exemple | Rôle |
|---|---|---|
| `PORT` | `3000` | Port de l'API (le front appelle `http://localhost:3000`) |
| `DB_URI` | `mongodb://localhost:27017/gardiennage` | Adresse de la base MongoDB |
| `SECRET_KEY` | *chaîne aléatoire longue* | Clé de signature des jetons JWT |
| `CORS_ORIGIN` | `http://localhost:5173` | Adresse du front autorisée à appeler l'API |

```bash
npm run dev               # http://localhost:3000
```

**Premier administrateur** : par sécurité, personne ne peut choisir le rôle admin à l'inscription. Inscrivez-vous sur le site, puis passez `isAdmin` à `true` sur votre compte directement dans MongoDB (Compass ou `mongosh`). Un administrateur peut ensuite nommer les autres depuis l'API.

### 2. Front

Dans un second terminal :

```bash
cd front
npm install
npm run dev               # http://localhost:5173
```

> Par défaut, le front appelle l'API sur `http://localhost:3000`. Pour changer cette adresse, copiez `front/.env.example` en `front/.env` et modifiez `VITE_API_URL`. Si le front ne tourne pas sur le port 5173, adaptez `CORS_ORIGIN` dans `api/.env`.

## Scripts

| Dossier | Commande | Action |
|---|---|---|
| `api/` | `npm run dev` | Lance l'API avec rechargement automatique (nodemon) |
| `api/` | `npm start` | Lance l'API sans rechargement |
| `front/` | `npm run dev` | Lance le serveur de développement Vite |
| `front/` | `npm run build` | Génère la version de production dans `front/dist/` |
| `front/` | `npm run preview` | Prévisualise la version de production |
| `front/` | `npm run lint` | Analyse le code avec ESLint |

## Tests

Un seul script, réutilisable, lance tous les tests. Aucune base MongoDB n'est nécessaire : les tests utilisent une base jetable en mémoire.

```bash
./tests.sh                # tous les tests (≈ 20 s)
./tests.sh unitaires      # fonctions isolées (API + front)
./tests.sh integration    # parcours complets (API + front)
./tests.sh securite       # attaques : accès interdits, JWT falsifié, injection, XSS, force brute…
./tests.sh orthographe    # dictionnaire français + typographie (espaces insécables, accents, vocabulaire)
./tests.sh qualite        # ESLint + compilation du front
```

| Catégorie | Tests |
|---|---|
| Unitaires | 47 |
| Intégration | 57 |
| Sécurité | 43 |
| Orthographe | 19 + 82 fichiers vérifiés par cspell |

Le script affiche un résumé et renvoie le code `1` si une étape échoue. Détail : [Cahier des charges, section 12](Document/Cahier_des_charges.md#12-tests-automatisés).

## Documentation

- 📋 [Cahier des charges](Document/Cahier_des_charges.md) : exigences, règles de gestion, modèle de données, API, planning
- 🎨 [Charte graphique](Document/Charte_graphique.md) : logo, couleurs, typographie, composants, accessibilité

## Feuille de route

- [x] Authentification, gestion des annonces et des commentaires, page d'accueil
- [x] Sécurisation des routes (droits auteur et administrateur)
- [x] Tests automatisés : unitaires, intégration, sécurité, orthographe
- [ ] Annonces complètes : type, ville, photo, statut, filtres et recherche
- [ ] Espace membre et tableau de bord d'administration
- [ ] Mise en production

Détail et état d'avancement : [Cahier des charges, sections 9 et 10](Document/Cahier_des_charges.md#9-écarts-constatés-dans-le-code-existant-audit-du-26102026).

## Crédits

Photos : [Unsplash](https://unsplash.com/license) (licence libre) · Icônes inspirées de [Lucide](https://lucide.dev) · Polices : [Nunito](https://fonts.google.com/specimen/Nunito) et [Caveat](https://fonts.google.com/specimen/Caveat)

---

<p align="center">Développé par <a href="https://github.com/Dmytriyev">Dmytriyev</a> · Fait avec soin, entre voisins 🌱</p>
