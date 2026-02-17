# 🚀 Déploiement Rapide - 15 Minutes

Guide condensé pour déployer rapidement l'application.

## ⚡ Prérequis
- Compte GitHub (avec le code pushé)
- Compte Google/GitHub pour s'inscrire

## 📝 Étapes Rapides

### 1️⃣ Base de Données (5 min)

**PlanetScale:**
1. ➡️ [planetscale.com](https://planetscale.com) → Sign up
2. ➡️ "Create database" → Nom: `epitech-blockchain-db`
3. ➡️ "Connect" → "Create password" → **Copier les credentials**
4. ➡️ "Console" → Coller le contenu de `backend/scripts/planetscale-schema.sql`
5. ✅ Exécuter le SQL

**Credentials à noter:**
```
DB_HOST: xxxxx.us-east-1.psdb.cloud
DB_USER: xxxxx
DB_PASSWORD: pscale_pw_xxxxx
DB_NAME: epitech_blockchain_club
```

---

### 2️⃣ Backend (5 min)

**Render.com:**
1. ➡️ [render.com](https://render.com) → Sign up with GitHub
2. ➡️ "New +" → "Web Service"
3. ➡️ Connecter votre repo GitHub
4. **Configuration:**
   ```
   Name: epitech-blockchain-backend
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```
5. ➡️ "Advanced" → Ajouter les variables d'environnement:
   ```bash
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=(cliquer "Generate")
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://votre-app.vercel.app
   
   # Depuis PlanetScale
   DB_HOST=xxxxx.us-east-1.psdb.cloud
   DB_USER=xxxxx
   DB_PASSWORD=pscale_pw_xxxxx
   DB_NAME=epitech_blockchain_club
   ```
6. ➡️ "Create Web Service"
7. ✅ Attendre le déploiement (~5 min)
8. **Noter l'URL:** `https://epitech-blockchain-backend.onrender.com`

---

### 3️⃣ Frontend (5 min)

**Vercel:**
1. ➡️ [vercel.com](https://vercel.com) → Sign up with GitHub
2. ➡️ "Add New..." → "Project"
3. ➡️ Import votre repo GitHub
4. **Configuration:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
5. ➡️ "Environment Variables" → Ajouter:
   ```bash
   VITE_API_URL=https://epitech-blockchain-backend.onrender.com/api
   ```
6. ➡️ "Deploy"
7. ✅ Attendre le déploiement (~3 min)
8. **Noter l'URL:** `https://votre-app.vercel.app`

---

### 4️⃣ Finalisation (2 min)

1. **Retourner sur Render:**
   - Aller dans votre service backend
   - "Environment" → Modifier `FRONTEND_URL`
   - Mettre votre vraie URL Vercel
   - Sauvegarder (redéploiement automatique)

2. **Tester:**
   ```bash
   # API Health
   curl https://epitech-blockchain-backend.onrender.com/api/health
   
   # Frontend
   Ouvrir: https://votre-app.vercel.app
   ```

---

## ✅ Checklist Finale

- [ ] Base de données créée sur PlanetScale
- [ ] Schéma SQL importé
- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] CORS configuré (FRONTEND_URL)
- [ ] Tests réussis

---

## 🔑 Comptes par Défaut

**Admin:**
```
Email: admin@epitech-blockchain.bj
Password: Admin123!
```

**⚠️ IMPORTANT:** Changez ce mot de passe immédiatement !

---

## 🆘 Problèmes Courants

### Backend ne démarre pas
- Vérifier les logs Render
- Vérifier les variables d'environnement DB_*

### Frontend ne charge pas
- Vérifier `VITE_API_URL` dans Vercel
- Tester l'API directement: `curl https://votre-backend.onrender.com/api/health`

### Erreur CORS
- Vérifier `FRONTEND_URL` dans Render
- Doit correspondre exactement à l'URL Vercel

---

## 📊 Coût Total

**0€/mois** avec les plans gratuits ! 🎉

---

## 📚 Documentation Complète

Voir `DEPLOYMENT-GUIDE.md` pour plus de détails.

---

**Félicitations ! Votre application est en ligne ! 🎊**
