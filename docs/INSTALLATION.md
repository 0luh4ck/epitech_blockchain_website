# 🚀 Guide d'Installation - Club Blockchain Epitech Website

Ce guide vous accompagne étape par étape pour installer et configurer le site web du Club Blockchain Epitech.

## 📋 Prérequis

### 1. Node.js et npm

**Node.js 18+ est requis** pour faire fonctionner le projet.

#### Installation sur Windows

1. **Télécharger Node.js**
   - Allez sur [nodejs.org](https://nodejs.org)
   - Téléchargez la version **LTS** (Long Term Support)
   - Exécutez l'installateur `.msi`

2. **Vérifier l'installation**
   ```cmd
   node --version
   npm --version
   ```

3. **Si Node.js n'est pas reconnu**
   - Redémarrez votre terminal/PowerShell
   - Vérifiez que Node.js est dans le PATH système
   - Réinstallez Node.js si nécessaire

#### Installation sur Linux (Ubuntu/Debian)

```bash
# Mettre à jour le système
sudo apt update

# Installer Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

#### Installation sur macOS

```bash
# Avec Homebrew
brew install node

# Ou télécharger depuis nodejs.org
# Vérifier l'installation
node --version
npm --version
```

### 2. Git (Optionnel mais recommandé)

```bash
# Windows : Télécharger depuis git-scm.com
# Linux
sudo apt install git

# macOS
brew install git
```

## 🏗️ Installation du Projet

### 1. Cloner le Projet

```bash
# Si vous avez Git
git clone <repository-url>
cd Epitech-Blockchain-Website

# Ou télécharger et extraire le ZIP
```

### 2. Installation des Dépendances

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

### 3. Configuration des Variables d'Environnement

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Éditez `frontend/.env` :
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Club Blockchain Epitech
VITE_APP_VERSION=1.0.0
```

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Éditez `backend/.env` :
```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=epitech_blockchain
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT
JWT_SECRET=votre_secret_tres_long_et_securise_ici
JWT_EXPIRES_IN=7d

# Serveur
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 🗄️ Configuration de la Base de Données

### Option 1 : PostgreSQL Local

#### Installation PostgreSQL

**Windows :**
1. Téléchargez depuis [postgresql.org](https://www.postgresql.org/download/windows/)
2. Installez avec l'installateur
3. Notez le mot de passe du superutilisateur

**Linux :**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS :**
```bash
brew install postgresql
brew services start postgresql
```

#### Configuration de la Base

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE epitech_blockchain;

# Créer un utilisateur
CREATE USER epitech_user WITH PASSWORD 'votre_mot_de_passe';

# Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE epitech_blockchain TO epitech_user;

# Quitter
\q
```

### Option 2 : Supabase (Recommandé)

1. **Créer un compte**
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un compte gratuit

2. **Créer un projet**
   - Cliquez sur "New Project"
   - Choisissez un nom : `epitech-blockchain`
   - Choisissez une région proche
   - Créez un mot de passe fort

3. **Récupérer les informations**
   - Allez dans Settings > Database
   - Copiez les informations de connexion

4. **Mettre à jour .env**
   ```env
   DB_HOST=db.xxxxxxxxxxxxx.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=votre_mot_de_passe_supabase
   ```

## 🚀 Démarrage du Projet

### 1. Migration de la Base de Données

```bash
cd backend
npm run migrate
```

### 2. Démarrage des Serveurs

#### Option A : Démarrage Automatique
```bash
# Depuis la racine du projet
npm run dev
```

#### Option B : Démarrage Manuel

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

### 3. Vérification

- **Frontend :** http://localhost:5173
- **Backend API :** http://localhost:5000
- **Test TailwindCSS :** Ouvrez `frontend/test-tailwind.html` dans votre navigateur

## 🧪 Test de l'Installation

### 1. Test TailwindCSS

Ouvrez le fichier `frontend/test-tailwind.html` dans votre navigateur. Vous devriez voir :
- Une page avec un design moderne
- Des boutons colorés
- Des éléments stylés

### 2. Test de l'API

```bash
# Test de santé de l'API
curl http://localhost:5000/health
```

### 3. Test du Frontend

1. Ouvrez http://localhost:5173
2. Vérifiez que la page s'affiche correctement
3. Testez la navigation entre les pages

## 🔧 Résolution des Problèmes

### Node.js non reconnu

**Windows :**
1. Redémarrez votre terminal
2. Vérifiez le PATH système
3. Réinstallez Node.js

**Linux/Mac :**
```bash
# Ajouter au PATH
echo 'export PATH=$PATH:/usr/local/bin' >> ~/.bashrc
source ~/.bashrc
```

### Erreur de Port

Si le port 5173 ou 5000 est occupé :

```bash
# Frontend sur un autre port
cd frontend
npm run dev -- --port 3000

# Backend sur un autre port
cd backend
PORT=3001 npm run dev
```

### Erreur de Base de Données

1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les informations de connexion dans `.env`
3. Testez la connexion :
   ```bash
   psql -h localhost -U postgres -d epitech_blockchain
   ```

### TailwindCSS ne fonctionne pas

1. Vérifiez que `frontend/tailwind.config.js` existe
2. Vérifiez que `frontend/src/index.css` contient `@import "tailwindcss"`
3. Redémarrez le serveur de développement

## 📚 Documentation Supplémentaire

- [README.md](../README.md) - Documentation principale
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Guide de dépannage
- [API.md](./API.md) - Documentation de l'API
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement

## 🆘 Obtenir de l'Aide

Si vous rencontrez des problèmes :

1. **Consultez les logs**
   - Console du navigateur (F12)
   - Terminal du serveur

2. **Vérifiez la documentation**
   - Guide de dépannage
   - Issues GitHub

3. **Contactez l'équipe**
   - 📧 Email : contact@epitech-blockchain.bj
   - 💬 Discord : [Lien Discord]

## ✅ Checklist d'Installation

- [ ] Node.js 18+ installé
- [ ] npm installé
- [ ] Projet cloné/téléchargé
- [ ] Dépendances frontend installées
- [ ] Dépendances backend installées
- [ ] Variables d'environnement configurées
- [ ] Base de données configurée
- [ ] Migration de la base de données
- [ ] Serveurs démarrés
- [ ] Test TailwindCSS réussi
- [ ] Site accessible sur http://localhost:5173

---

**🎉 Félicitations !** Votre environnement de développement est maintenant prêt pour le Club Blockchain Epitech Website !
