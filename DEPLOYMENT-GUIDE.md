# 🚀 Guide de Déploiement - Club Blockchain Epitech Bénin

Ce guide vous accompagne dans le déploiement complet de l'application.

## 📋 Architecture de Déploiement

```
Frontend:  Vercel (React + Vite)
Backend:   Render.com (Node.js + Express)
Database:  PlanetScale (MySQL)
```

## 🗄️ Étape 1: Déploiement de la Base de Données (PlanetScale)

### 1.1 Créer un compte PlanetScale
1. Allez sur [planetscale.com](https://planetscale.com)
2. Créez un compte gratuit
3. Cliquez sur "Create a new database"

### 1.2 Configuration de la base de données
```bash
# Nom de la base de données
epitech-blockchain-db

# Région recommandée
AWS eu-west-1 (Europe - Ireland) ou us-east-1
```

### 1.3 Obtenir la chaîne de connexion
1. Dans votre base de données, allez dans "Connect"
2. Sélectionnez "Node.js" comme framework
3. Créez un nouveau mot de passe
4. Copiez les informations de connexion :
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`

### 1.4 Importer le schéma
```bash
# Option 1: Via l'interface web PlanetScale
# - Allez dans "Console"
# - Copiez le contenu de backend/scripts/database-schema.sql
# - Exécutez les commandes SQL (sans les commandes CREATE DATABASE et USE)

# Option 2: Via CLI PlanetScale
pscale shell epitech-blockchain-db main
# Puis collez le schéma SQL
```

**Note importante**: PlanetScale ne supporte pas les clés étrangères traditionnelles. Vous devrez peut-être adapter le schéma en supprimant les contraintes `FOREIGN KEY`.

### 1.5 Schéma adapté pour PlanetScale
Utilisez le fichier `backend/scripts/planetscale-schema.sql` que je vais créer.

---

## 🔧 Étape 2: Déploiement du Backend (Render.com)

### 2.1 Préparer le repository GitHub
```bash
# Assurez-vous que tout est commité
git add .
git commit -m "Préparation pour le déploiement"
git push origin main
```

### 2.2 Créer un compte Render
1. Allez sur [render.com](https://render.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "New +" → "Web Service"

### 2.3 Configuration du service
```yaml
Name: epitech-blockchain-backend
Environment: Node
Region: Frankfurt (EU Central) ou Oregon (US West)
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 2.4 Variables d'environnement
Ajoutez ces variables dans Render :

```bash
# Base de données (depuis PlanetScale)
DB_HOST=<votre-host-planetscale>
DB_USER=<votre-user-planetscale>
DB_PASSWORD=<votre-password-planetscale>
DB_NAME=epitech_blockchain_club

# Application
NODE_ENV=production
PORT=10000

# JWT (généré automatiquement par Render ou créez le vôtre)
JWT_SECRET=<généré-automatiquement>
JWT_EXPIRES_IN=7d

# Frontend URL (à mettre à jour après déploiement Vercel)
FRONTEND_URL=https://epitech-blockchain.vercel.app

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (optionnel - pour les notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<votre-email>
SMTP_PASSWORD=<votre-app-password>
EMAIL_FROM=noreply@epitech-blockchain.bj
```

### 2.5 Déployer
1. Cliquez sur "Create Web Service"
2. Attendez que le déploiement se termine (5-10 minutes)
3. Notez l'URL de votre backend : `https://epitech-blockchain-backend.onrender.com`

### 2.6 Tester l'API
```bash
# Tester la santé de l'API
curl https://epitech-blockchain-backend.onrender.com/api/health

# Devrait retourner: {"status":"ok","timestamp":"..."}
```

---

## 🎨 Étape 3: Déploiement du Frontend (Vercel)

### 3.1 Installer Vercel CLI (optionnel)
```bash
npm install -g vercel
```

### 3.2 Déployer via l'interface web
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "Add New..." → "Project"
4. Importez votre repository GitHub
5. Configuration :

```yaml
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.3 Variables d'environnement Vercel
```bash
VITE_API_URL=https://epitech-blockchain-backend.onrender.com/api
```

### 3.4 Déployer
1. Cliquez sur "Deploy"
2. Attendez la fin du déploiement (2-5 minutes)
3. Notez votre URL : `https://epitech-blockchain.vercel.app`

### 3.5 Mettre à jour le CORS du backend
Retournez dans Render et mettez à jour la variable `FRONTEND_URL` avec votre vraie URL Vercel.

---

## 🔒 Étape 4: Configuration de la Sécurité

### 4.1 CORS
Le backend est déjà configuré pour accepter les requêtes depuis `FRONTEND_URL`.

### 4.2 Variables d'environnement sensibles
- ✅ Ne jamais commiter les fichiers `.env`
- ✅ Utiliser des secrets forts pour `JWT_SECRET`
- ✅ Activer 2FA sur PlanetScale, Render et Vercel

### 4.3 Rate Limiting
Le backend limite déjà les requêtes (100 req/15min par défaut).

---

## 🧪 Étape 5: Tests Post-Déploiement

### 5.1 Tester le backend
```bash
# Health check
curl https://epitech-blockchain-backend.onrender.com/api/health

# Obtenir les activités publiques
curl https://epitech-blockchain-backend.onrender.com/api/activities
```

### 5.2 Tester le frontend
1. Ouvrez `https://epitech-blockchain.vercel.app`
2. Vérifiez que la page d'accueil se charge
3. Testez la navigation
4. Testez le formulaire de demande d'adhésion

### 5.3 Tester l'intégration complète
1. Créez une demande d'adhésion depuis le frontend
2. Vérifiez dans la base de données PlanetScale
3. Connectez-vous avec un compte admin (voir credentials par défaut)

---

## 👤 Comptes par Défaut

### Administrateur
```
Email: admin@epitech-blockchain.bj
Mot de passe: Admin123! (à changer immédiatement)
```

### Président
```
Email: president@epitech-blockchain.bj
Mot de passe: Admin123! (à changer immédiatement)
```

**⚠️ IMPORTANT**: Changez ces mots de passe immédiatement après le premier déploiement !

---

## 📊 Monitoring et Maintenance

### Logs Backend (Render)
1. Allez dans votre service Render
2. Cliquez sur "Logs"
3. Surveillez les erreurs

### Analytics Frontend (Vercel)
1. Allez dans votre projet Vercel
2. Cliquez sur "Analytics"
3. Surveillez les performances

### Base de données (PlanetScale)
1. Allez dans votre base PlanetScale
2. Cliquez sur "Insights"
3. Surveillez les requêtes lentes

---

## 🔄 Mises à Jour

### Déploiement automatique
Les deux plateformes sont configurées pour le déploiement automatique :

```bash
# Faire des modifications
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin main

# Vercel et Render déploieront automatiquement
```

### Rollback
- **Vercel**: Allez dans "Deployments" → Sélectionnez une version précédente → "Promote to Production"
- **Render**: Allez dans "Events" → Sélectionnez un déploiement précédent → "Redeploy"

---

## 💰 Coûts Estimés

### Plan Gratuit (Recommandé pour commencer)
- **PlanetScale**: Gratuit (5GB, 1 milliard de lectures/mois)
- **Render**: Gratuit (750h/mois, se met en veille après 15min d'inactivité)
- **Vercel**: Gratuit (100GB bandwidth, déploiements illimités)

**Total: 0€/mois** 🎉

### Plan Payant (Pour production avec trafic)
- **PlanetScale**: $29/mois (10GB, 100 milliards de lectures)
- **Render**: $7/mois (pas de mise en veille)
- **Vercel**: $20/mois (1TB bandwidth)

**Total: ~$56/mois**

---

## 🆘 Dépannage

### Le backend ne démarre pas
1. Vérifiez les logs Render
2. Vérifiez les variables d'environnement
3. Testez la connexion à PlanetScale

### Le frontend ne se connecte pas au backend
1. Vérifiez `VITE_API_URL` dans Vercel
2. Vérifiez `FRONTEND_URL` dans Render
3. Testez l'API directement avec curl

### Erreurs de base de données
1. Vérifiez que le schéma est bien importé
2. Vérifiez les credentials PlanetScale
3. Vérifiez que la base est en mode "production" (pas "development")

---

## 📞 Support

Pour toute question :
- Email: admin@epitech-blockchain.bj
- Documentation: Voir les fichiers dans `/docs`

---

## ✅ Checklist de Déploiement

- [ ] Base de données PlanetScale créée
- [ ] Schéma SQL importé
- [ ] Backend déployé sur Render
- [ ] Variables d'environnement configurées
- [ ] Frontend déployé sur Vercel
- [ ] CORS configuré correctement
- [ ] Tests post-déploiement réussis
- [ ] Mots de passe admin changés
- [ ] Monitoring configuré
- [ ] Documentation mise à jour

**Félicitations ! Votre application est en ligne ! 🎉**
