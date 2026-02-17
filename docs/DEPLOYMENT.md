# 🚀 Guide de Déploiement - Club Blockchain Epitech

Ce guide vous explique comment déployer le site web du Club Blockchain d'Epitech Bénin.

## 📋 Prérequis

- Node.js 18+ et npm 8+
- Compte GitHub
- Compte Vercel (pour le frontend)
- Compte Render (pour le backend)
- Compte Supabase (pour la base de données)
- Compte Cloudflare (pour le nom de domaine)

## 🗄️ Configuration de la Base de Données

### 1. Créer un Projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez les informations de connexion :
   - Host
   - Database name
   - Username
   - Password
   - Port (5432)

### 2. Exécuter les Migrations

```bash
# Dans le dossier backend
npm run migrate
```

## 🎨 Déploiement du Frontend (Vercel)

### 1. Préparer le Frontend

```bash
cd frontend
npm run build
```

### 2. Déployer sur Vercel

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement :
   ```
   VITE_API_URL=https://votre-backend-url.onrender.com/api
   VITE_APP_NAME=Club Blockchain Epitech
   ```

3. Déployez automatiquement

## 🔧 Déploiement du Backend (Render)

### 1. Préparer le Backend

1. Créez un fichier `render.yaml` dans la racine :

```yaml
services:
  - type: web
    name: epitech-blockchain-backend
    env: node
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: DB_HOST
        fromDatabase:
          name: epitech-blockchain-db
          property: host
      - key: DB_NAME
        fromDatabase:
          name: epitech-blockchain-db
          property: database
      - key: DB_USER
        fromDatabase:
          name: epitech-blockchain-db
          property: user
      - key: DB_PASSWORD
        fromDatabase:
          name: epitech-blockchain-db
          property: password
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        value: https://votre-frontend-url.vercel.app

databases:
  - name: epitech-blockchain-db
    plan: free
```

### 2. Déployer sur Render

1. Connectez votre repository GitHub à Render
2. Créez un nouveau service web
3. Configurez les variables d'environnement
4. Déployez

## 🌐 Configuration du Nom de Domaine (Cloudflare)

### 1. Ajouter le Domaine

1. Connectez votre domaine à Cloudflare
2. Configurez les DNS :
   ```
   A    @    [IP de Vercel]
   CNAME www [votre-frontend-url.vercel.app]
   CNAME api [votre-backend-url.onrender.com]
   ```

### 2. Configuration SSL

Cloudflare activera automatiquement SSL pour votre domaine.

## 🔐 Variables d'Environnement

### Backend (.env)

```env
NODE_ENV=production
PORT=10000
DB_HOST=votre-host-supabase
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre-mot-de-passe
JWT_SECRET=votre-secret-jwt
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://votre-domaine.com
```

### Frontend (.env)

```env
VITE_API_URL=https://api.votre-domaine.com/api
VITE_APP_NAME=Club Blockchain Epitech
```

## 📊 Monitoring et Maintenance

### 1. Logs

- **Vercel** : Dashboard Vercel > Functions > Logs
- **Render** : Dashboard Render > Service > Logs
- **Supabase** : Dashboard Supabase > Logs

### 2. Sauvegardes

- **Base de données** : Supabase gère automatiquement les sauvegardes
- **Code** : Sauvegardé sur GitHub

### 3. Mises à Jour

```bash
# Mise à jour du code
git pull origin main

# Redéploiement automatique via GitHub Actions
```

## 🚨 Dépannage

### Problèmes Courants

1. **Erreur de connexion à la base de données**
   - Vérifiez les variables d'environnement
   - Vérifiez que Supabase est accessible

2. **Erreur CORS**
   - Vérifiez que `FRONTEND_URL` est correctement configuré

3. **Erreur 404 sur l'API**
   - Vérifiez que l'URL de l'API est correcte
   - Vérifiez que le backend est déployé

### Support

- 📧 Email : contact@epitech-blockchain.bj
- 📱 Discord : [Lien Discord]
- 🐛 Issues : [GitHub Issues]

## 📈 Optimisations

### Performance

1. **Frontend**
   - Images optimisées
   - Lazy loading
   - Code splitting

2. **Backend**
   - Compression gzip
   - Cache Redis (optionnel)
   - Rate limiting

3. **Base de données**
   - Index optimisés
   - Requêtes optimisées
   - Connection pooling

### Sécurité

1. **Authentification**
   - JWT avec expiration
   - Hachage bcrypt
   - Rate limiting

2. **API**
   - Validation des données
   - Sanitisation
   - CORS configuré

3. **Base de données**
   - Connexions sécurisées
   - Sauvegardes automatiques
   - Monitoring

---

**🎉 Félicitations ! Votre site web du Club Blockchain Epitech est maintenant déployé !**
