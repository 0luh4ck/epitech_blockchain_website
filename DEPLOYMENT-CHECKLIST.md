# ✅ Checklist de Déploiement

## 📋 Avant de Commencer

- [ ] Code pushé sur GitHub
- [ ] Tous les tests locaux passent
- [ ] Variables d'environnement documentées
- [ ] README.md à jour

---

## 🗄️ Base de Données - PlanetScale

### Configuration
- [ ] Compte PlanetScale créé
- [ ] Base de données `epitech-blockchain-db` créée
- [ ] Région sélectionnée (Europe ou US)
- [ ] Mot de passe de connexion créé

### Credentials Notés
- [ ] `DB_HOST` copié
- [ ] `DB_USER` copié
- [ ] `DB_PASSWORD` copié
- [ ] `DB_NAME` = epitech_blockchain_club

### Schéma
- [ ] Fichier `backend/scripts/planetscale-schema.sql` ouvert
- [ ] SQL exécuté dans la console PlanetScale
- [ ] Tables créées vérifiées
- [ ] Données initiales insérées (admins, partenaires)

### Tests
- [ ] Connexion testée depuis la console
- [ ] Tables listées : `SHOW TABLES;`
- [ ] Utilisateurs vérifiés : `SELECT * FROM users;`

---

## 🔧 Backend - Render.com

### Configuration Initiale
- [ ] Compte Render créé
- [ ] GitHub connecté
- [ ] Repository sélectionné
- [ ] Service web créé

### Paramètres du Service
- [ ] Name: `epitech-blockchain-backend`
- [ ] Environment: `Node`
- [ ] Region: `Frankfurt` ou `Oregon`
- [ ] Branch: `main`
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Plan: `Free`

### Variables d'Environnement
**Application:**
- [ ] `NODE_ENV` = production
- [ ] `PORT` = 10000
- [ ] `JWT_SECRET` (généré)
- [ ] `JWT_EXPIRES_IN` = 7d

**Base de Données:**
- [ ] `DB_HOST` (depuis PlanetScale)
- [ ] `DB_USER` (depuis PlanetScale)
- [ ] `DB_PASSWORD` (depuis PlanetScale)
- [ ] `DB_NAME` = epitech_blockchain_club

**CORS:**
- [ ] `FRONTEND_URL` (URL Vercel - à mettre à jour)

**Rate Limiting:**
- [ ] `RATE_LIMIT_WINDOW_MS` = 900000
- [ ] `RATE_LIMIT_MAX_REQUESTS` = 100

**Email (Optionnel):**
- [ ] `SMTP_HOST` = smtp.gmail.com
- [ ] `SMTP_PORT` = 587
- [ ] `SMTP_USER` (votre email)
- [ ] `SMTP_PASSWORD` (app password)
- [ ] `EMAIL_FROM` = noreply@epitech-blockchain.bj

### Déploiement
- [ ] Service créé
- [ ] Build réussi (vérifier les logs)
- [ ] Service démarré
- [ ] URL notée : `https://epitech-blockchain-backend.onrender.com`

### Tests Backend
```bash
# Health check
curl https://epitech-blockchain-backend.onrender.com/api/health

# API info
curl https://epitech-blockchain-backend.onrender.com/api

# Activities (public)
curl https://epitech-blockchain-backend.onrender.com/api/activities
```

- [ ] `/api/health` retourne 200 OK
- [ ] `/api` retourne les endpoints
- [ ] `/api/activities` retourne des données ou tableau vide

---

## 🎨 Frontend - Vercel

### Configuration Initiale
- [ ] Compte Vercel créé
- [ ] GitHub connecté
- [ ] Repository importé
- [ ] Projet créé

### Paramètres du Projet
- [ ] Framework Preset: `Vite`
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### Variables d'Environnement
- [ ] `VITE_API_URL` = `https://epitech-blockchain-backend.onrender.com/api`

### Déploiement
- [ ] Build réussi
- [ ] Déploiement terminé
- [ ] URL notée : `https://votre-app.vercel.app`
- [ ] Custom domain configuré (optionnel)

### Tests Frontend
- [ ] Page d'accueil charge
- [ ] Navigation fonctionne
- [ ] Images/assets chargent
- [ ] Console sans erreurs critiques

---

## 🔗 Intégration

### Mise à Jour CORS
- [ ] Retourner sur Render
- [ ] Modifier `FRONTEND_URL` avec l'URL Vercel exacte
- [ ] Sauvegarder (redéploiement auto)
- [ ] Attendre le redéploiement (~2 min)

### Tests d'Intégration
- [ ] Formulaire de demande d'adhésion fonctionne
- [ ] Données envoyées au backend
- [ ] Données sauvegardées en base
- [ ] Pas d'erreurs CORS dans la console

### Connexion Admin
- [ ] Aller sur `/login`
- [ ] Email: `admin@epitech-blockchain.bj`
- [ ] Password: `Admin123!`
- [ ] Connexion réussie
- [ ] Dashboard accessible

---

## 🔒 Sécurité

### Mots de Passe
- [ ] Mot de passe admin changé
- [ ] Mot de passe président changé
- [ ] Tous les comptes executive vérifiés

### Secrets
- [ ] `JWT_SECRET` fort et unique
- [ ] Fichiers `.env` dans `.gitignore`
- [ ] Pas de secrets dans le code

### 2FA (Recommandé)
- [ ] 2FA activé sur PlanetScale
- [ ] 2FA activé sur Render
- [ ] 2FA activé sur Vercel
- [ ] 2FA activé sur GitHub

---

## 📊 Monitoring

### Render
- [ ] Logs accessibles
- [ ] Pas d'erreurs critiques
- [ ] Service en état "Live"

### Vercel
- [ ] Analytics activé
- [ ] Pas d'erreurs de build
- [ ] Déploiements automatiques configurés

### PlanetScale
- [ ] Insights vérifiés
- [ ] Pas de requêtes lentes
- [ ] Utilisation dans les limites

---

## 📝 Documentation

### Mise à Jour
- [ ] README.md avec URLs de production
- [ ] Variables d'environnement documentées
- [ ] Guide utilisateur créé (optionnel)

### Communication
- [ ] Équipe informée du déploiement
- [ ] URLs partagées
- [ ] Credentials admin partagés (sécurisé)

---

## 🚀 Post-Déploiement

### Fonctionnalités à Tester
- [ ] Inscription membre
- [ ] Connexion/Déconnexion
- [ ] Création d'activité (admin)
- [ ] Inscription à une activité
- [ ] Affichage des partenaires
- [ ] Formulaire de contact

### Performance
- [ ] Temps de chargement < 3s
- [ ] Images optimisées
- [ ] Pas de requêtes bloquantes

### SEO (Optionnel)
- [ ] Meta tags configurés
- [ ] Open Graph tags
- [ ] Sitemap généré
- [ ] robots.txt créé

---

## 🔄 Déploiement Continu

### GitHub Actions
- [ ] Workflow `.github/workflows/deploy.yml` créé
- [ ] Tests automatiques configurés
- [ ] Notifications configurées

### Auto-Deploy
- [ ] Render auto-deploy activé
- [ ] Vercel auto-deploy activé
- [ ] Branches de preview configurées (optionnel)

---

## 💰 Facturation

### Plans Gratuits Vérifiés
- [ ] PlanetScale: Free tier (5GB)
- [ ] Render: Free tier (750h/mois)
- [ ] Vercel: Hobby plan (gratuit)

### Limites Surveillées
- [ ] Bandwidth Vercel < 100GB/mois
- [ ] Build minutes Render < 750h/mois
- [ ] Storage PlanetScale < 5GB

---

## 🆘 Support

### Contacts d'Urgence
- [ ] Email admin configuré
- [ ] Numéros de téléphone notés
- [ ] Slack/Discord configuré (optionnel)

### Documentation
- [ ] `DEPLOYMENT-GUIDE.md` lu
- [ ] `QUICK-DEPLOY.md` partagé
- [ ] Troubleshooting documenté

---

## ✨ Améliorations Futures

### Court Terme
- [ ] Custom domain (epitech-blockchain.bj)
- [ ] SSL certificate (automatique avec Vercel)
- [ ] Email notifications fonctionnelles
- [ ] Upload d'images pour activités

### Moyen Terme
- [ ] CDN pour les images
- [ ] Cache Redis (Upstash)
- [ ] Monitoring avancé (Sentry)
- [ ] Analytics (Google Analytics)

### Long Terme
- [ ] Migration vers plan payant si nécessaire
- [ ] Scaling horizontal
- [ ] Multi-région
- [ ] Mobile app

---

## 🎉 Félicitations !

Si toutes les cases sont cochées, votre application est **100% déployée** ! 🚀

**URLs de Production:**
- Frontend: `https://votre-app.vercel.app`
- Backend: `https://epitech-blockchain-backend.onrender.com`
- Database: PlanetScale Console

**Prochaines Étapes:**
1. Partager les URLs avec l'équipe
2. Former les admins
3. Commencer à utiliser la plateforme
4. Collecter les retours utilisateurs
5. Itérer et améliorer

---

**Date de déploiement:** _______________  
**Déployé par:** _______________  
**Version:** 1.0.0
