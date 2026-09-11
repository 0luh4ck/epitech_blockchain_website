# Epitech Blockchain Club Website

Le site web officiel du Club Blockchain d'Epitech Bénin. Plateforme moderne, sécurisée et 100 % responsive pour la gestion des membres, des activités, des examens blockchain et de l'innovation Web3.

## 🚀 Vue d'ensemble

Application full-stack :

- **Frontend** : React 18, Vite, Tailwind CSS v4, Framer Motion, React Router (design Web3).
- **Backend** : Node.js, Express, mysql2, TiDB Cloud Serverless (MySQL/TLS), JWT Auth, Swagger/OpenAPI 3.0.
- **Déploiement** : Vercel (frontend), Render (backend), TiDB Cloud (base de données).

## 📂 Structure du projet

```text
.
├── backend/              # API Express (routes, middleware, scripts/migrate.js, config/swagger.js)
│   ├── config/           # database.js (pool mysql2 + TLS), swagger.js
│   ├── routes/           # auth, users, activities, exams, attendance, membership(-requests), partners, stats
│   └── scripts/          # database-schema.sql, seedSuperadmin.js
├── frontend/             # React/Vite (pages, components/admin, services, context)
│   ├── public/logo.png   # Logo officiel (navbar, login, footer, favicon)
│   └── src/pages/        # Home, auth/Login, auth/AdminLogin, Docs, Dashboard, Admin, ExamImmersive…
├── docs/                 # Documentation (ARCHITECTURE, SETUP, CAHIER_DES_CHARGES)
├── render.yaml           # Déploiement Render
└── README.md
```

## 🛠️ Démarrage rapide

Guides détaillés : [Installation et Configuration](./docs/SETUP.md), [Architecture](./docs/ARCHITECTURE.md).

```bash
# Backend
cd backend && npm install && cp .env.example .env   # renseigner DB_*, JWT_SECRET
npm run migrate   # schéma + colonnes + seed Superadmin
npm run dev       # http://localhost:5000 (Swagger : /api/docs)

# Frontend
cd frontend && npm install && cp .env.example .env  # VITE_API_URL, VITE_SUPERADMIN_ROUTE
npm run dev       # http://localhost:5173
```

## 🔑 Variables d'environnement

Backend (`backend/.env`, voir `.env.example`) : `PORT`, `DB_HOST`, `DB_PORT` (4000 TiDB), `DB_USER`,
`DB_PASSWORD`, `DB_NAME`, `DB_SSL` (`false` en local, TLS forcé en prod), `DATABASE_URL` (optionnel,
prioritaire), `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `API_PUBLIC_URL` (URL publique pour Swagger).

Frontend (`frontend/.env`, voir `.env.example`) : `VITE_API_URL` (ex. `http://localhost:5000/api`),
`VITE_SUPERADMIN_ROUTE` (route confidentielle, défaut `/portal-secure-x9k2/admin-login`).

## 👥 Espaces & routes

| Espace | Route | Accès |
|---|---|---|
| Public / Membre / Bureau | `/login` (onglets Membre / Bureau), `/register`, `/membership-request` | `space` vérifié côté backend |
| Administration | route confidentielle `VITE_SUPERADMIN_ROUTE` (+ honeypots → 404) | `epiblockchain@epitech.eu` / `12345678` au premier accès, changement obligatoire |
| Dashboard / Profil | `/dashboard`, `/profile` | JWT |
| Admin (layout isolé) | `/admin`, `/admin/membership-requests`, `/admin/activity-editor` | rôles `admin`/`executive` |
| Documentation | `/docs` (publique), `/api/docs` (Swagger UI) | public |

## 📜 Scripts utiles

- Backend : `npm start` (migrations + seed + serveur), `npm run migrate`, `npm test`.
- Frontend : `npm run dev`, `npm run build`.

## 🌐 Déploiement

- Render : `render.yaml` (`cd backend && npm install` / `npm start`). Renseigner `DB_HOST` (TiDB),
  `DB_PORT=4000`, `JWT_SECRET`, `FRONTEND_URL`. Le TLS est forcé automatiquement en production.
- TiDB Cloud Serverless impose TLS : toute connexion non chiffrée est rejetée.
- Vercel : `frontend/vercel.json`, définir `VITE_API_URL` et `VITE_SUPERADMIN_ROUTE`.

## 🌿 Workflow Git (branches)

On travaille **par branche dédiée** depuis `main`, on pousse systématiquement en fin de tâche :

```bash
git checkout -b fix/ma-correction main   # ou feat/ma-fonctionnalite
# ... modifications + vérifications (node --check, vite build)
git add <fichiers> && git commit -m "fix: ..." && git push -u origin fix/ma-correction
```

Puis PR vers `main` pour revue/merge.

## 🤝 Contribution

Contributions bienvenues via PR. Questions techniques : **Pôle Tech** du club.

---
© 2024-2026 Club Blockchain Epitech Bénin — Tous droits réservés.
