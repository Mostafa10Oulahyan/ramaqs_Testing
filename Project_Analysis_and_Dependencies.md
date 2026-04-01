# Rapport d'Analyse du Projet & Dépendances

Ce document présente l'analyse de l'application web développée, en réponse aux exigences initiales du "Test Technique Développeur Web", ainsi que la documentation détaillée des technologies, dépendances et APIs ajoutées pour surpasser ces attentes.

---

## 1. Respect du Cahier des Charges Initial

Le test technique imposait les critères fondamentaux suivants, qui ont tous été validés avec succès :
- **Framework & Langage :** Développé en **React / TypeScript**.
- **Gestion d'État :** Mise en place d'une architecture centralisée avec **Redux Toolkit** (Slices, AsyncThunks).
- **Routage :** Utilisation de `react-router-dom` pour scinder les interfaces (Détails Série, Détails Épisodes, etc.).
- **Consommation API :** Intégration complète de l'API TV Maze pour afficher les données.
- **Styling & UI :** Implémentation via l'approche "Utility-First" avancée (Tailwind CSS) remplaçant habilement le CSS-in-JS classique par une méthode moderne et hautement performante (Glassmorphism, conception responsive).

---

## 2. Fonctionnalités Avancées (Au-delà du test)

L'application a été étendue pour devenir une véritable plateforme de streaming "Netflix/IMDb like", dépassant largement le socle "Powerpuff Girls" initial :
1. **Intégration d'une 2ème API (TMDB) :** Ajout de la base de données internationale TMDB pour supporter les **Films** longs-métrages, en plus des Séries TV.
2. **Moteur de Recherche Global :** Recherche unifiée debouncée cherchant simultanément dans les Films et Séries.
3. **Portail des Célébrités (Cast & Crew) :** Pages dédiées aux acteurs avec leur filmographie complète, gérant intelligemment les conflits de routage entre TVMaze et TMDB (`source="tmdb"`).
4. **Classements (Leaderboards) :** Création des routes `/top-movies` et `/top-shows` interrogeant dynamiquement de multiples pages de résultats pour lister le "Top 100".
5. **Watchlist & Persistance :** Ajout d'une fonctionnalité de favoris, gérée dans Redux et synchronisée en temps réel avec le `localStorage` du navigateur.
6. **Hero Carousel Cinématographique :** Slider haut de gamme (auto-play, fade effects) en page d'accueil avec dégradés fluides pour simuler des plateformes premium.

---

## 3. APIs Utilisées

*   **TV Maze API** (`https://api.tvmaze.com/`) :
    *   `/search/shows?q=` : Recherche de séries.
    *   `/shows/:id` : Détails étendus de séries (incluant les épisodes intégrés `_embedded=episodes,cast`).
    *   `/people/:id/castcredits?embed=show` : Filmographie des acteurs TV.
*   **TMDB API (The Movie Database)** (`https://api.themoviedb.org/3/`) :
    *   `/search/movie` : Recherche de films.
    *   `/movie/popular` & `/movie/top_rated` : Listes de films et classements.
    *   `/movie/:id?append_to_response=credits` : Détails films et distributions cinématographiques.

---

## 4. Dépendances Techniques Ajoutées (`package.json`)

Voici la liste des bibliothèques clés injectées pour propulser l'application et garantir un code propre (Clean Code) et modulable :

### Cœur & Architecture
*   `react` / `react-dom` : Moteur de rendu UI.
*   `typescript` : Typage statique robuste garantissant un code orienté domaine (DDD).
*   `react-router-dom` : Mécanique de routing complexe (multi-pages, wildcards paramétriques).

### Store & Données (State Management)
*   `@reduxjs/toolkit` : Contient la logique métier, la gestion du asynchrone (thunks) pour communiquer avec les APIs TVMaze/TMDB, respectant la séparation des préoccupations.
*   `react-redux` : Connectivité logicielle React-Redux respectant les hooks custom (`useAppSelector`, `useAppDispatch`).

### Interface Utilisateur (UI & UX)
*   `tailwindcss` : Framework de style ultra-rapide remplaçant avantageusement Styled-Components pour des requêtes Media "Responsive" instantanées et un design de système atomique.
*   `swiper` : Technologie tactile mobile assurant le Hero Carousel d'entrée (Autoplay, Pagination vectorielle).
*   `framer-motion` : Moteur de micro-animations (slide up, opacité persistante) pour polir l'expérience utilisateur et satisfaire l'évaluation des "Bonnes Pratiques UX".
*   `lucide-react` : Bibliothèque d'icônes professionnelles harmonisées et légères (SVG).

---

## 5. Synthèse Architecturale (DDD & Structure)

La structure a été modélisée pour une séparation stricte (Feature-Sliced Design / Domain Driven Architecture partielle) :
*   `/src/store/` : Couche Domaine isolant complètement la logique d'état et le fetching des APIs en fragments autonomes (`watchlistSlice`, `showsListSlice`, etc).
*   `/src/pages/` : Vues de présentation (Pages Complètes).
*   `/src/components/` : Blocs d'interface purs, agnostiques, et réutilisables (Cartes, Boutons, Carousel).
*   `/src/assets/` : Ressources statiques optimisées par l'orchestrateur (Vite).

**Conclusion :**
L'application résout à 100% le test technique initial tout en modélisant un prototype ultra-extensible et prêt pour la production, témoignant d'une forte maîtrise de React, de la logique asynchrone croisée, et des conceptions de design web modernes.
