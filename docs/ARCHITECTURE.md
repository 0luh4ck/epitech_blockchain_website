# Architecture Technique

Ce document détaille l'organisation technique du projet du Club Blockchain.

## 🏗️ Structure Globale

Le projet suit une architecture Monorepo simplifiée permettant une gestion cohérente du Frontend et du Backend.

```text
epitech_blockchain_website/
├── backend/            # API Service
│   ├── models/         # Modèles de données (TiDB/MySQL)
│   ├── routes/         # Endpoints de l'API
│   ├── middleware/     # Auth (JWT) et validation
│   └── server.js       # Point d'entrée
├── frontend/           # Client Application
│   ├── src/
│   │   ├── components/ # Composants UI réutilisables
│   │   ├── pages/      # Vues de l'application
│   │   ├── context/    # Gestion d'état (Auth, Theme, Toast)
│   │   └── services/   # Communication avec l'API (Axios)
│   └── public/         # Assets statiques (Vite)
└── docs/               # Documentation technique
```

## 💻 Stack Technique

### Backend (API)
- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : TiDB (TiDB Serverless) via driver MySQL2
- **Authentification** : JSON Web Token (JWT)
- **Validation** : Joi / Custom Middleware

### Frontend (SPA)
- **Framework** : React 18
- **Build Tool** : Vite
- **Styling** : Tailwind CSS v4
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Gestion de Formulaires** : React Hook Form

## 🔒 Sécurité et Authentification

1. **Tokens** : L'accès aux routes protégées est régulé par des JWT stockés dans le local storage du client.
2. **Domaines Autorisés** : L'inscription est restreinte aux emails `@epitech.eu`.
3. **Middleware** : Toutes les requêtes sensibles passent par un middleware de vérification de session côté serveur.

## 📊 Flux de Données

1. L'utilisateur interagit avec l'interface React.
2. Le service Axios du frontend envoie une requête vers l'API Backend.
3. Le Backend valide le token/data et interroge la base de données TiDB.
4. Les données sont renvoyées via JSON et affichées via les hooks React.
