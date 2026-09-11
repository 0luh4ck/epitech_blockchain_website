# EPITECH BLOCKCHAIN CLUB WEBSITE
`< CAHIER DES CHARGES FONCTIONNEL ET TECHNIQUE />`

**Club Blockchain Epitech Bénin**
**Référence :** REF/CBC/EPITECH-BJ/2026-001
**Version :** 1.0
**Date :** 31 août 2026

---

### Interlocuteurs / Rôles identifiés dans le code

| Prénom / Nom | Rôle dans le Bureau Exécutif | Email institutionnel |
|---|---|---|
| Samuel SOGLOHOUN | Coordinateur du Bureau Exécutif (Admin) | samuel.soglohoun@epitech.eu |
| Brouhane BONI GOMINA | Président (Admin) | brouhane.boni-gomina@epitech.eu |
| Moktar VODOUNNON | Lead du Pôle Tech | moktar.vodounnon@epitech.eu |
| Imane PHILIPPE | Lead du Pôle Communication | imane.philippe@epitech.eu |
| Christian ABIALA | Chargé du Pôle Pédagogie | christian.abiala@epitech.eu |
| Christopher GUIDIBI | Chargé du Pôle Événements & Partenariats | christopher.guidibi@epitech.eu |
| Estelle GOSSOU | Secrétaire | estelle.gossou@epitech.eu |
| Divine AZANMASSO | Trésorière | divine.azanmasso@epitech.eu |
| Eunice GOSSOU BAH | Lead Pôle Ressources Humaines | eunice.gossou-bah@epitech.eu |
| Jimmy BACHABI | Adjoint Pôle Ressources Humaines | jimmy.bachabi@epitech.eu |
| Farid ADOI | Conseiller Pôle Tech & Pédagogie | farid.adoi@epitech.eu |

---

## 1. Contexte institutionnel / Projet

### 1.1 Présentation générale

Le **Club Blockchain d'Epitech Bénin** est une organisation estudiantine née de la collaboration tripartite entre **Epitech Bénin**, **Future Studio** et l'**Africa Blockchain Institute**. Sa vocation est de promouvoir l'innovation Web3, la blockchain et les technologies décentralisées auprès des étudiants de l'école d'informatique et d'innovation technologique d'Epitech Bénin.

Le présent document décrit la plateforme web officielle développée pour centraliser l'ensemble des ressources du club : gestion des membres, organisation des activités pédagogiques et événementielles, pilotage de l'adhésion, évaluation des connaissances via examens en ligne, et gestion des partenariats institutionnels.

### 1.2 Objectifs principaux

- **Digitaliser** la gestion des membres et du cycle d'adhésion (demande → validation → onboarding).
- **Centraliser** les activités du club (séminaires, conférences, ateliers, réunions, examens).
- **Évaluer** les connaissances blockchain des membres via un module d'examens intégré.
- **Valoriser** les partenaires institutionnels et communiquer sur la vie du club.
- **Outiller** le Bureau Exécutif avec un espace d'administration dédié pour la gestion opérationnelle.

### 1.3 Valeur ajoutée

La plateforme supprime les processus manuels (formulaires papier, emails de suivi) et offre un espace unique, sécurisé et accessible 24h/24, aussi bien au grand public qu'aux membres actifs. Elle constitue la vitrine numérique du club et un outil de pilotage interne pour le Bureau Exécutif.

---

## 2. Description du service attendu

### 2.1 Périmètre fonctionnel

La plateforme est structurée autour de **quatre espaces fonctionnels** correspondant aux rôles utilisateurs identifiés dans le code source.

---

#### Espace 1 — Visiteur Public (non authentifié)

Accès en lecture seule aux contenus publics du club, sans authentification requise.

- **Page d'accueil (Home)** : Présentation du club, statistiques dynamiques en temps réel (nombre de membres actifs, activités à venir, examens disponibles, certifications délivrées), section d'annonce et appel à l'adhésion.
- **À propos (About)** : Historique, mission et valeurs du club.
- **Bureau Exécutif (Executive Board)** : Consultation publique des membres du bureau, leurs postes et biographies. Alimenté dynamiquement depuis l'API (`GET /api/users/executive-board`).
- **Partenaires (Partners)** : Présentation des partenaires actifs avec logo, description et liens vers leurs sites.
- **Activités (Activities)** : Consultation des activités publiées et rendues publiques (`is_public = true`, `status = published`). Filtrage par type et recherche textuelle, avec pagination.
- **Adhésion (Membership)** : Informations sur les modalités d'adhésion au club.
- **Contact** : Formulaire de prise de contact (nom, email, sujet, message) soumis à validation côté serveur.
- **Demande d'adhésion (Membership Request)** : Formulaire public pour soumettre une candidature au club (prénom, nom, email, téléphone, numéro étudiant, lettre de motivation).

---

#### Espace 2 — Membre Authentifié (rôle `member`)

Accès étendu après connexion, avec accès à un tableau de bord personnel et aux ressources réservées aux membres.

- **Tableau de bord (Dashboard)** : Vue personnalisée avec statistiques globales du club et accès rapide aux sections.
- **Profil personnel (Profile)** : Consultation et modification des informations personnelles (prénom, nom, téléphone, biographie). Changement de mot de passe sécurisé.
- **Activités membres** : Consultation de toutes les activités (publiées, brouillons) avec indication de l'état d'inscription du membre. Inscription et désinscription à une activité (sous réserve de disponibilité des places et de date d'ouverture).
- **Module Examens** : Accès à la liste des examens disponibles et actifs, consultation de ses propres résultats par tentative (score, pourcentage, statut `passed`/`failed`, durée). Démarrage d'une session d'examen et soumission des réponses avec calcul automatique du score.
- **Historique de présence** : Consultation de son propre historique de présence aux activités avec statistiques (taux de présence, nombre d'absences, retards, excusés).

---

#### Espace 3 — Bureau Exécutif (rôle `executive`)

Accès aux fonctionnalités de gestion opérationnelle du club, en plus des droits `member`.

- **Gestion des activités** : Création, modification et suppression d'activités. Paramétrage du type (`seminar`, `conference`, `workshop`, `meeting`, `exam`, `other`), du statut (`draft`, `published`, `cancelled`, `completed`), de la capacité maximale, des dates, du lieu/lien en ligne et des prérequis.
- **Gestion des présences** : Consultation de la feuille de présence d'une activité. Marquage individuel ou en lot (`bulk-mark`) de la présence des participants inscrits (statuts : `present`, `absent`, `late`, `excused`). Horodatage automatique du check-in.
- **Gestion des examens** : Création d'un examen avec questions (types `multiple_choice`, `true_false`, `short_answer`, `essay`), définition du score de passage, du nombre de tentatives maximum et des plages de disponibilité.
- **Gestion des partenaires** : Création, modification et désactivation (soft delete) des fiches partenaires.
- **Statistiques de présence** : Vue globale avec top 10 des participants les plus assidus et top 10 des activités les plus populaires.
- **Gestion des utilisateurs** : Consultation de la liste des membres avec recherche et filtrage par rôle.

---

#### Espace 4 — Administrateur (rôle `admin`)

Accès complet à la plateforme, incluant toutes les fonctionnalités exécutif plus les opérations sensibles.

- **Tableau de bord d'administration (Admin)** : Vue d'ensemble des métriques de la plateforme.
- **Gestion des demandes d'adhésion** (`/admin/membership-requests`) : Consultation paginée de toutes les demandes. Approbation d'une demande avec création automatique du compte utilisateur et génération optionnelle d'un mot de passe temporaire. Rejet avec saisie d'un motif. Statistiques des demandes (en attente, approuvées, rejetées, 7 derniers jours).
- **Gestion avancée des utilisateurs** : Modification du rôle (`member`, `executive`, `admin`) et du statut actif d'un utilisateur. Désactivation d'un compte (soft delete).
- **Statistiques globales utilisateurs** : Tableau de bord avec répartition par rôle, taux d'utilisateurs actifs/vérifiés, connexions du dernier mois et courbe des inscriptions mensuelles sur 12 mois.

---

### 2.2 Exigences fonctionnelles prioritaires

Les règles de gestion critiques identifiées dans le code source sont les suivantes :

1. **Restriction du domaine email à l'inscription directe** : Seules les adresses `@epitech.eu` sont acceptées lors de l'auto-inscription (`/api/auth/register`). Cette règle est appliquée côté serveur via le middleware `express-validator`.

2. **Workflow d'adhésion en deux temps** : Un candidat non-Epitech peut soumettre une demande publique (`POST /api/membership-requests`). La création du compte ne se déclenche qu'à l'approbation explicite par un administrateur (`PUT /api/membership-requests/:id/approve`), garantissant un contrôle humain obligatoire.

3. **Contrôle de la capacité des activités** : L'inscription à une activité est refusée si `current_participants >= max_participants`. Le compteur est mis à jour atomiquement à chaque inscription ou désinscription.

4. **Règle de clôture des inscriptions** : Un membre ne peut s'inscrire à une activité que si celle-ci est en statut `published` **et** que la date de début est postérieure à la date courante.

5. **Contrôle des tentatives d'examen** : Le système vérifie que l'utilisateur n'a pas atteint `max_attempts` avant d'autoriser le démarrage d'une nouvelle session. Une seule session `in_progress` est autorisée par utilisateur et par examen à tout moment.

6. **Calcul automatique du score** : À la soumission d'un examen, le score est calculé côté serveur par comparaison stricte avec les réponses correctes stockées en base. Le statut est déterminé par le ratio `score/total_points` comparé au seuil `passing_score` (défaut : 60%).

7. **Gestion des migrations automatiques** : Au démarrage du serveur, une migration SQL est exécutée automatiquement (`runMigration()`) avant l'écoute des requêtes, garantissant la cohérence du schéma.

8. **Soft Delete** : Les suppressions d'utilisateurs et de partenaires sont des désactivations logiques (`is_active = false`) et non des suppressions physiques, préservant l'intégrité référentielle et l'historique.

9. **Actualisation de la dernière connexion** : Le champ `last_login` est mis à jour en base à chaque connexion réussie, permettant des statistiques d'activité des membres.

---

## 3. Contraintes techniques

### 3.1 Architecture

Le projet suit une architecture **Monorepo** avec séparation stricte Frontend/Backend, déployé sur des infrastructures cloud distinctes.

```
epitech_blockchain_website/
├── backend/      → API RESTful (Node.js / Express)
├── frontend/     → SPA (React / Vite)
├── docs/         → Documentation technique
└── scripts/      → Scripts d'installation et de diagnostic
```

#### Frontend (SPA — Single Page Application)

| Élément | Technologie | Version |
|---|---|---|
| Framework UI | React | 19.1.1 |
| Build Tool | Vite | 7.1.x |
| Styling | Tailwind CSS | 4.1.13 |
| Routing | React Router DOM | 6.30.x |
| Animations | Framer Motion | 12.23.x |
| Requêtes HTTP | Axios | 1.12.x |
| Formulaires | React Hook Form | 7.48.x |
| Notifications | React Hot Toast | 2.6.x |
| Icônes | Lucide React | 0.544.x |
| Dates | date-fns | 2.30.x |
| Utilitaires CSS | clsx | 2.0.x |
| Linting | ESLint | 9.33.x |
| Compilateur JSX | @vitejs/plugin-react-swc | 4.0.x |

**Patterns d'architecture Frontend :**
- **Context API** avec `useReducer` pour la gestion de l'état global d'authentification (`AuthContext`), du thème (`ThemeContext`) et des notifications (`ToastContext`).
- **Lazy loading** de toutes les pages secondaires via `React.lazy()` et `<Suspense>` pour optimiser le bundle initial.
- **Route Guards** (`ProtectedRoute`, `AdminRoute`) basés sur la lecture du `localStorage` pour sécuriser l'accès aux sections privées.
- Interception globale des réponses API via les **Axios Interceptors** (injection automatique du token Bearer, gestion des 401).
- Composants UI thématiques blockchain : `BlockchainButton`, `BlockchainCard`, `BlockchainNav`, `BlockchainLoader`, `ParticleGrid`, `GlitchText`, `Card3D` (effets Web3).

**Déploiement Frontend :** Vercel (`https://epitech-blockchain.vercel.app`)

---

#### Backend & Base de données

| Élément | Technologie | Version |
|---|---|---|
| Runtime | Node.js | ≥ 18.0.0 |
| Framework | Express.js | 4.18.x |
| Base de données | TiDB Serverless (compatible MySQL) | — |
| Driver DB | mysql2/promise | 3.6.x |
| Gestion variables d'env. | dotenv | 16.3.x |
| Upload fichiers | Multer | 1.4.x |
| Emails | Nodemailer | 6.9.x |
| Identifiants uniques | uuid | 9.0.x |
| Logging | Morgan | 1.10.x |
| Compression | compression | 1.7.x |
| Tests | Jest + Supertest | 29.7.x |
| Dev server | Nodemon | 3.0.x |

**Pattern d'accès aux données :** Pool de connexions MySQL (`connectionLimit: 10`, `acquireTimeout: 60000ms`) avec fonctions utilitaires `query()`, `execute()` et `transaction()`. Requêtes SQL brutes (pas d'ORM).

**Déploiement Backend :** Render (région Frankfurt, plan gratuit, port 10000).

---

#### API RESTful

L'API est entièrement **RESTful**, exposée sur le préfixe `/api`. Toutes les réponses sont en **JSON** avec la structure normalisée :

```json
{
  "success": true | false,
  "message": "...",
  "data": { ... }
}
```

**Tableau des endpoints exposés :**

| Préfixe | Ressource | Accès |
|---|---|---|
| `POST /api/auth/register` | Inscription | Public (email @epitech.eu) |
| `POST /api/auth/login` | Connexion | Public |
| `GET /api/auth/me` | Profil courant | Privé |
| `PUT /api/auth/profile` | Mise à jour profil | Privé |
| `POST /api/auth/change-password` | Changement mot de passe | Privé |
| `POST /api/auth/refresh` | Rafraîchissement JWT | Privé |
| `GET /api/users` | Liste des membres | Executive/Admin |
| `GET /api/users/executive-board` | Bureau Exécutif | Public |
| `GET/PUT /api/users/:id` | Détail / Mise à jour | Privé (self ou Executive) |
| `DELETE /api/users/:id` | Désactivation compte | Admin |
| `GET /api/users/stats/overview` | Stats membres | Executive/Admin |
| `GET/POST /api/activities` | Liste / Création | Public (GET) / Executive (POST) |
| `GET/PUT/DELETE /api/activities/:id` | Détail / Édition / Suppression | Public (GET) / Executive |
| `POST /api/activities/:id/register` | Inscription activité | Membre |
| `DELETE /api/activities/:id/register` | Désinscription | Membre |
| `GET/POST /api/exams` | Liste / Création | Membre (GET) / Executive (POST) |
| `GET /api/exams/:id` | Détail examen + questions | Membre |
| `POST /api/exams/:id/start` | Démarrer examen | Membre |
| `POST /api/exams/:id/submit` | Soumettre examen | Membre |
| `GET /api/exams/:id/results` | Résultats | Membre |
| `GET /api/attendance/activity/:id` | Présence par activité | Executive/Admin |
| `POST /api/attendance/mark` | Marquage individuel | Executive/Admin |
| `POST /api/attendance/bulk-mark` | Marquage en lot | Executive/Admin |
| `GET /api/attendance/user/:id` | Historique utilisateur | Self ou Executive |
| `GET /api/attendance/stats/overview` | Stats globales présence | Executive/Admin |
| `GET/POST /api/membership-requests` | Demandes adhésion | Public (POST) / Admin (GET) |
| `PUT /api/membership-requests/:id/approve` | Approbation | Admin |
| `PUT /api/membership-requests/:id/reject` | Rejet | Admin |
| `GET /api/membership-requests/stats` | Stats demandes | Admin |
| `GET /api/partners` | Liste partenaires | Public |
| `GET/POST/PUT/DELETE /api/partners/:id` | CRUD partenaires | Public (GET) / Executive |
| `GET /api/stats/dashboard` | Stats tableau de bord | Public |
| `GET /api/membership` | Module adhésion | Privé |
| `/health` et `/api/health` | Healthcheck | Public |

**Pagination :** Toutes les listes supportent les paramètres `?page=` et `?limit=` avec retour des métadonnées `{ page, limit, total, pages }`.

---

### 3.2 Sécurité et Intégrité

#### Authentification & Autorisation
- **JWT (JSON Web Token)** signé avec `JWT_SECRET`, durée de vie configurable (`JWT_EXPIRES_IN`, défaut : `7d`). Transmis via l'en-tête HTTP `Authorization: Bearer <token>`.
- **Quatre niveaux de middleware d'autorisation** :
  - `authenticateToken` : Vérification du token + existence de l'utilisateur en base et statut actif.
  - `requireAdmin` : Rôle `admin` requis.
  - `requireExecutive` : Rôles `admin` ou `executive` requis.
  - `requireMember` : Rôles `admin`, `executive` ou `member` requis.
  - `optionalAuth` : Auth optionnelle (routes publiques avec personnalisation conditionnelle).
- Vérification en base à chaque requête protégée que l'utilisateur est toujours **actif** (`is_active = true`).

#### Hachage des mots de passe
- Librairie **bcryptjs** avec **12 rounds de salage** (coût élevé, résistant aux attaques par force brute).
- Vérification via `bcrypt.compare()` sans jamais stocker ou transmettre le mot de passe en clair.

#### Protection HTTP
- **Helmet.js** : Sécurisation des en-têtes HTTP (Content-Security-Policy, X-Frame-Options, etc.) avec `crossOriginResourcePolicy: cross-origin`.
- **CORS** : Origines autorisées restreintes à `FRONTEND_URL` (configuré en production : `https://epitech-blockchain.vercel.app`).
- **Rate Limiting** : `express-rate-limit` — 100 requêtes maximum par IP par fenêtre de 15 minutes (900 000 ms). Compatible avec les proxies Render/Vercel (`trust proxy: 1`).

#### Validation des données
- **express-validator** : Validation et sanitisation de toutes les entrées utilisateur côté serveur (email, longueurs, formats, valeurs autorisées par ENUM).
- Restriction des emails à `@epitech.eu` pour l'auto-inscription et les candidatures formelles.

#### Intégrité des données
- **Soft Delete** sur les utilisateurs et partenaires (pas de perte de données historiques).
- **Clés étrangères** avec `ON DELETE CASCADE` / `ON DELETE SET NULL` selon les entités.
- **Contraintes UNIQUE** sur les couples (`user_id`, `activity_id`) pour les inscriptions et présences.
- **Transactions SQL** (`START TRANSACTION / COMMIT / ROLLBACK`) pour la création atomique d'examens avec questions.

#### Connexion DB
- **SSL configurable** sur la connexion TiDB (`DB_SSL=true` → `rejectUnauthorized: false`).
- Utilisation de **requêtes paramétrées** (driver mysql2) sur toutes les requêtes SQL, éliminant le risque d'injection SQL.

---

### 3.3 Interopérabilité & Format des données

- **Format d'échange universel :** JSON (Content-Type: `application/json`).
- **Taille maximale des requêtes :** 10 Mo (`express.json({ limit: '10mb' })`).
- **Compression :** Middleware `compression` activé sur toutes les réponses API (gzip/deflate).
- **Timeout client :** 10 000 ms (configuré dans l'instance Axios côté frontend).
- **Fichiers statiques :** Servis depuis le répertoire `/uploads` via Express (`express.static`).
- **Configuration SMTP :** Nodemailer configuré pour Gmail (`smtp.gmail.com:587`), adr. expéditeur `noreply@epitech-blockchain.bj`. (Module intégré, non encore branché sur des flux applicatifs).

---

### 3.4 Performance & Optimisation

#### Base de données
- **Pool de connexions MySQL** : 10 connexions simultanées maximum, file d'attente illimitée.
- **Index sur toutes les colonnes critiques** définis dans le schéma SQL :
  - `idx_users_email`, `idx_users_role`
  - `idx_activities_start_date`, `idx_activities_status`
  - `idx_activity_registrations_user_id`, `idx_activity_registrations_activity_id`
  - `idx_attendance_user_id`, `idx_attendance_activity_id`
  - `idx_exam_results_user_id`, `idx_exam_results_exam_id`
  - `idx_membership_applications_status`
  - `idx_announcements_created_at`, `idx_contact_messages_status`

#### Frontend
- **Lazy loading** de toutes les pages secondaires (`React.lazy + Suspense`) : seul le bundle minimal est chargé à l'entrée.
- **Code Splitting** automatique par Vite.
- Compilateur **SWC** (Speedy Web Compiler) via `@vitejs/plugin-react-swc` pour des builds ultra-rapides.

#### API
- **Pagination systématique** sur tous les endpoints de liste (paramètres `page` et `limit`).
- **Requêtes SQL optimisées** avec JOINs et sous-requêtes COUNT pour éviter le chargement inutile de données.
- Logs Morgan en mode `combined` (production) ou `dev` (développement) pour le monitoring.

---

## 4. Livrables et état d'avancement

### 4.1 Fonctionnalités Back-End

| # | Fonctionnalité | Statut |
|---|---|---|
| 1 | Authentification JWT (register, login, refresh, logout) | [x] Implémenté |
| 2 | Gestion du profil utilisateur (lecture, mise à jour, changement mdp) | [x] Implémenté |
| 3 | CRUD Activités (création, modification, suppression, liste, détail) | [x] Implémenté |
| 4 | Inscription / Désinscription aux activités | [x] Implémenté |
| 5 | Gestion des présences (individuelle et en lot) | [x] Implémenté |
| 6 | Statistiques de présence globales | [x] Implémenté |
| 7 | CRUD Examens avec questions (transactions SQL) | [x] Implémenté |
| 8 | Démarrage et soumission d'examen avec calcul de score | [x] Implémenté |
| 9 | Consultation des résultats d'examen par tentative | [x] Implémenté |
| 10 | Workflow de demandes d'adhésion (soumission, approbation, rejet) | [x] Implémenté |
| 11 | CRUD Partenaires | [x] Implémenté |
| 12 | Endpoint Bureau Exécutif (public) | [x] Implémenté |
| 13 | Gestion des utilisateurs (liste, détail, mise à jour rôle, désactivation) | [x] Implémenté |
| 14 | Statistiques tableau de bord (public) | [x] Implémenté |
| 15 | Statistiques utilisateurs (admin/executive) | [x] Implémenté |
| 16 | Healthcheck endpoints (`/health`, `/api/health`) | [x] Implémenté |
| 17 | Rate Limiting (express-rate-limit) | [x] Implémenté |
| 18 | Sécurisation HTTP (Helmet, CORS) | [x] Implémenté |
| 19 | Validation des données (express-validator) | [x] Implémenté |
| 20 | Migrations SQL automatiques au démarrage | [x] Implémenté |
| 21 | Module Annonces (table `announcements`) | [ ] Schéma créé, endpoints non exposés |
| 22 | Module Messages de Contact (table `contact_messages`) | [ ] Schéma créé, endpoints non exposés |
| 23 | Envoi d'emails (Nodemailer) | [ ] Dépendance installée, non connectée |
| 24 | Vérification d'email à l'inscription | [ ] Champ `verification_token` en base, logique non implémentée |
| 25 | Réinitialisation de mot de passe | [ ] Champs `reset_password_token` en base, logique non implémentée |
| 26 | Upload de photos (Multer) | [ ] Dépendance installée, endpoints non exposés |
| 27 | Module adhésion complet (`/api/membership`) | [ ] Route déclarée, fichier non analysé complètement |
| 28 | Tests unitaires et d'intégration (Jest / Supertest) | [ ] Dépendances installées, tests non écrits |

---

### 4.2 Fonctionnalités Front-End

| # | Page / Composant | Statut |
|---|---|---|
| 1 | Page d'accueil (Home) avec stats dynamiques | [x] Implémenté |
| 2 | Page À propos (About) | [x] Implémenté |
| 3 | Page Bureau Exécutif (ExecutiveBoard) | [x] Implémenté |
| 4 | Page Partenaires (Partners) | [x] Implémenté |
| 5 | Page Activités (Activities) | [x] Implémenté |
| 6 | Page Adhésion (Membership) | [x] Implémenté |
| 7 | Page Contact (Contact) | [x] Implémenté |
| 8 | Page Connexion (Login) | [x] Implémenté |
| 9 | Page Inscription (Register) | [x] Implémenté |
| 10 | Formulaire de Demande d'adhésion (MembershipRequest) | [x] Implémenté |
| 11 | Tableau de bord Membre (Dashboard) | [x] Implémenté |
| 12 | Profil personnel (Profile) | [x] Implémenté |
| 13 | Espace Administration (Admin) | [x] Implémenté |
| 14 | Gestion des demandes d'adhésion Admin (MembershipRequests) | [x] Implémenté |
| 15 | Page 404 (NotFound) | [x] Implémenté |
| 16 | Navigation blockchain thématique (BlockchainNav) | [x] Implémenté |
| 17 | Composants UI Web3 (Cards, Buttons, Loaders, Effects) | [x] Implémenté |
| 18 | AuthContext (gestion état global authentification) | [x] Implémenté |
| 19 | ThemeContext (dark/light mode) | [x] Implémenté |
| 20 | ToastContext (notifications) | [x] Implémenté |
| 21 | Services API Axios (auth, activities, exams, users, stats) | [x] Implémenté |
| 22 | Route Guards (ProtectedRoute, AdminRoute) | [x] Implémenté |
| 23 | Lazy Loading + Suspense sur routes secondaires | [x] Implémenté |
| 24 | Interface de passage d'examens | [ ] Service frontend créé, page dédiée non identifiée |
| 25 | Interface de gestion des présences (Executive) | [ ] API backend disponible, UI non confirmée |
| 26 | Interface de gestion des examens (Executive) | [ ] API backend disponible, UI non confirmée |

---

## 5. Points d'attention

### 5.1 Limitations fonctionnelles actuelles

> [!WARNING]
> **Module Email non opérationnel :** La dépendance `nodemailer` est installée et la configuration SMTP est définie (Gmail, port 587), mais aucun flux d'envoi d'email n'est branché sur les actions applicatives. La vérification d'email à l'inscription (`verification_token`) et la réinitialisation de mot de passe (`reset_password_token`, `reset_password_expires`) sont prévues dans le schéma BDD mais **non implémentées** côté logique métier. Les comptes sont considérés `is_verified = false` par défaut après auto-inscription.

> [!NOTE]
> **Module Annonces (Announcements) :** La table `announcements` est créée en base avec une annonce de bienvenue insérée. Les endpoints API pour créer, modifier ou consulter les annonces **ne sont pas exposés**. Ce module est en attente de développement.

> [!NOTE]
> **Module Messages de Contact :** La table `contact_messages` est définie dans le schéma SQL, mais aucun endpoint `POST /api/contact` n'est déclaré dans `server.js`. La validation `validateContactMessage` est codée dans le middleware, mais non utilisée.

> [!WARNING]
> **Uploads de photos (Multer) :** La dépendance `multer` est installée et le répertoire `/uploads` est servi statiquement. Cependant, aucun endpoint d'upload de fichiers (photo de profil, logo de partenaire, image d'activité) n'est exposé dans les routes actuelles. Les champs `avatar`, `logo`, `image` existent en base mais restent nuls en pratique.

> [!CAUTION]
> **Tokens JWT en LocalStorage :** Les JWT sont stockés dans le `localStorage` du navigateur (non dans des cookies `HttpOnly`). Cette approche est susceptible aux attaques **XSS**. Il est recommandé de migrer vers des cookies `HttpOnly` sécurisés pour une production robuste.

> [!NOTE]
> **Tests automatisés absents :** Jest et Supertest sont listés comme dépendances de développement mais aucun fichier de test n'a été identifié dans le projet. La couverture de test est **nulle** à ce stade.

> [!NOTE]
> **Plan d'hébergement gratuit (Render Free) :** Le backend est déployé sur le plan gratuit de Render. Ce plan implique une mise en veille automatique du service après 15 minutes d'inactivité, engendrant une latence de "cold start" de 30 à 60 secondes sur la première requête suivant une période d'inactivité.

> [!NOTE]
> **Restriction email @epitech.eu :** L'auto-inscription est réservée aux emails `@epitech.eu`. Les personnes extérieures souhaitant rejoindre le club doivent passer par le formulaire de demande d'adhésion public, soumis à la validation manuelle d'un administrateur.

### 5.2 Données de référence pré-chargées

La base de données est initialisée avec des données de référence (`seed`) :
- **13 comptes utilisateurs** (2 admins, 11 membres du bureau exécutif) avec mots de passe hachés bcrypt identiques par défaut.
- **3 partenaires** : Epitech Bénin, Future Studio, Africa Blockchain Institute.
- **1 annonce** de bienvenue épinglée.

> [!CAUTION]
> Les mots de passe par défaut doivent impérativement être modifiés lors du premier déploiement en production pour des raisons de sécurité évidentes.

---

*Document généré par analyse automatique du code source — Club Blockchain Epitech Bénin — REF/CBC/EPITECH-BJ/2026-001 — v1.0*
