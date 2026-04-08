# Installation et Configuration

Ce guide vous explique comment configurer l'environnement de développement du Club Blockchain.

## 📋 Prérequis

- **Node.js** : >= 18.0.0
- **npm** : >= 9.0.0
- **Base de données** : TiDB Serverless ou MySQL local

## ⚙️ Configuration

### 1. Cloner le projet
```bash
git clone https://github.com/votre-org/epitech_blockchain_website.git
cd epitech_blockchain_website
```

### 2. Configuration du Backend
1. Naviguez vers le dossier backend :
   ```bash
   cd backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` basé sur `.env.example` :
   ```env
   PORT=5000
   DB_HOST=votre_host
   DB_USER=votre_user
   DB_PASSWORD=votre_password
   DB_NAME=votre_db
   JWT_SECRET=votre_secret_tres_robuste
   ```

### 3. Configuration du Frontend
1. Naviguez vers le dossier frontend :
   ```bash
   cd ../frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` :
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

## 🚀 Démarrage

### Mode Développement
Dans deux terminaux séparés :

- **Terminal 1 (Backend)** :
  ```bash
  cd backend
  npm run dev
  ```

- **Terminal 2 (Frontend)** :
  ```bash
  cd frontend
  npm run dev
  ```

## 🧪 Tests
- Backend : `npm test` dans `backend/`
- Frontend : `npm run lint` dans `frontend/`
