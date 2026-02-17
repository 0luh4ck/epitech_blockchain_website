# 🚀 Déploiement - Club Blockchain Epitech

## 📦 Fichiers de Configuration

Tous les fichiers nécessaires ont été créés et configurés :

```
Epitech-Blockchain-Website/
├── 📖 DEPLOYMENT-GUIDE.md          # Guide complet
├── ⚡ QUICK-DEPLOY.md              # Guide rapide (15 min)
├── ✅ DEPLOYMENT-CHECKLIST.md      # Checklist détaillée
├── 📋 DEPLOYMENT-SUMMARY.md        # Résumé et overview
│
├── ⚙️  render.yaml                 # Config Render (backend)
├── ⚙️  vercel.json                 # Config Vercel (frontend)
│
├── backend/
│   ├── .env.example               # Template variables backend
│   ├── healthcheck.js             # Health check script
│   └── scripts/
│       ├── planetscale-schema.sql # Schéma PlanetScale
│       └── database-schema.sql    # Schéma MySQL standard
│
├── frontend/
│   └── .env.example               # Template variables frontend
│
└── .github/
    └── workflows/
        └── deploy.yml             # CI/CD automatique
```

## 🎯 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      UTILISATEURS                             │
│                   (Web Browsers)                              │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                   FRONTEND - Vercel                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  React 19 + Vite + TailwindCSS                         │  │
│  │  • Pages publiques (Accueil, À propos, etc.)           │  │
│  │  • Dashboard authentifié (Admin, Membres)              │  │
│  │  • Formulaires et interactions                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  📦 Build: npm run build                                      │
│  🌐 Deploy: Automatique sur push main                        │
│  💰 Coût: 0€ (Plan Hobby)                                    │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ HTTPS/REST API
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND - Render.com                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Node.js + Express                                     │  │
│  │  • API REST (auth, users, activities, etc.)            │  │
│  │  • Authentification JWT                                │  │
│  │  • Middleware (CORS, Rate Limit, etc.)                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  📦 Build: npm install                                        │
│  🚀 Start: npm start                                          │
│  🌐 Deploy: Automatique sur push main                        │
│  💰 Coût: 0€ (Plan Free - sleep après 15min)                │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ MySQL Protocol
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                DATABASE - PlanetScale                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  MySQL 8.0 Compatible                                  │  │
│  │  • Tables: users, activities, exams, etc.              │  │
│  │  • Indexes optimisés                                   │  │
│  │  • Backups automatiques                                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  💾 Storage: 5GB                                              │
│  📊 Reads: 1 milliard/mois                                   │
│  💰 Coût: 0€ (Plan Free)                                     │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Workflow de Déploiement

```
┌─────────────────┐
│  Développement  │
│   Local (WSL)   │
└────────┬────────┘
         │
         │ git push origin main
         ▼
┌─────────────────┐
│     GitHub      │
│   Repository    │
└────┬───────┬────┘
     │       │
     │       └──────────────────┐
     │                          │
     ▼                          ▼
┌─────────────┐          ┌─────────────┐
│   Vercel    │          │   Render    │
│  (Frontend) │          │  (Backend)  │
└─────────────┘          └──────┬──────┘
                                │
                                ▼
                         ┌─────────────┐
                         │ PlanetScale │
                         │ (Database)  │
                         └─────────────┘
```

## ⚡ Déploiement en 5 Étapes

### 1️⃣ Préparer le Code (2 min)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2️⃣ Base de Données (5 min)
- 🌐 [planetscale.com](https://planetscale.com) → Sign up
- ➕ Create database: `epitech-blockchain-db`
- 🔑 Create password → Copier credentials
- 📝 Console → Exécuter `backend/scripts/planetscale-schema.sql`

### 3️⃣ Backend (5 min)
- 🌐 [render.com](https://render.com) → Sign up with GitHub
- ➕ New Web Service → Import from GitHub
- ⚙️ Configure selon `render.yaml`
- 🔐 Ajouter variables d'environnement
- 🚀 Deploy

### 4️⃣ Frontend (5 min)
- 🌐 [vercel.com](https://vercel.com) → Sign up with GitHub
- ➕ New Project → Import from GitHub
- ⚙️ Configure selon `vercel.json`
- 🔐 Ajouter `VITE_API_URL`
- 🚀 Deploy

### 5️⃣ Finaliser (2 min)
- 🔄 Mettre à jour `FRONTEND_URL` dans Render
- ✅ Tester l'application
- 🔒 Changer les mots de passe par défaut

## 📊 Tableau de Bord

### URLs de Production
| Service | URL | Status |
|---------|-----|--------|
| Frontend | `https://votre-app.vercel.app` | 🟢 |
| Backend | `https://...onrender.com` | 🟢 |
| Database | PlanetScale Console | 🟢 |

### Credentials Admin
| Compte | Email | Password |
|--------|-------|----------|
| Admin | `admin@epitech-blockchain.bj` | `Admin123!` ⚠️ |
| Président | `president@epitech-blockchain.bj` | `Admin123!` ⚠️ |

**⚠️ À CHANGER IMMÉDIATEMENT APRÈS LE DÉPLOIEMENT !**

## 🧪 Tests Post-Déploiement

### ✅ Backend
```bash
# Health check
curl https://epitech-blockchain-backend.onrender.com/api/health

# Expected: {"status":"OK",...}
```

### ✅ Frontend
- Ouvrir `https://votre-app.vercel.app`
- Vérifier page d'accueil
- Tester navigation
- Console sans erreurs

### ✅ Intégration
- Formulaire demande d'adhésion
- Connexion admin
- Création d'activité
- Inscription à une activité

## 💰 Coûts

### Plan Gratuit (Total: 0€/mois)
- ✅ PlanetScale: 5GB, 1B reads
- ✅ Render: 750h/mois
- ✅ Vercel: 100GB bandwidth

### Limitations Plan Gratuit
- ⚠️ Render: Sleep après 15min d'inactivité
- ⚠️ PlanetScale: 5GB max
- ⚠️ Vercel: 100GB bandwidth/mois

## 📚 Documentation

| Document | Description | Temps |
|----------|-------------|-------|
| [QUICK-DEPLOY.md](../QUICK-DEPLOY.md) | Guide rapide | 15 min |
| [DEPLOYMENT-GUIDE.md](../DEPLOYMENT-GUIDE.md) | Guide complet | 1h |
| [DEPLOYMENT-CHECKLIST.md](../DEPLOYMENT-CHECKLIST.md) | Checklist | - |
| [DEPLOYMENT-SUMMARY.md](../DEPLOYMENT-SUMMARY.md) | Résumé | 5 min |

## 🆘 Aide

### Problèmes Courants

**Backend ne démarre pas:**
- Vérifier les logs Render
- Vérifier variables d'environnement
- Tester connexion PlanetScale

**Frontend erreur CORS:**
- Vérifier `FRONTEND_URL` dans Render
- Doit correspondre exactement à l'URL Vercel

**Base de données erreur:**
- Vérifier credentials PlanetScale
- Vérifier que le schéma est importé
- Tester connexion depuis console

### Support
- 📧 Email: admin@epitech-blockchain.bj
- 🐛 GitHub Issues: [Créer un issue](../../issues)
- 📖 Documentation: Voir fichiers DEPLOYMENT-*.md

## 🎉 Succès !

Une fois toutes les étapes complétées, votre application sera en ligne et accessible au monde entier !

**Prochaines étapes:**
1. Partager les URLs avec l'équipe
2. Former les administrateurs
3. Commencer à utiliser la plateforme
4. Collecter les retours utilisateurs
5. Itérer et améliorer

---

**Bonne chance avec votre déploiement ! 🚀**
