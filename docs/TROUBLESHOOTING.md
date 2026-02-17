# 🔧 Guide de Dépannage - Club Blockchain Epitech

Ce guide vous aide à résoudre les problèmes courants rencontrés lors du développement.

## 🎨 Problème : CSS TailwindCSS non appliqué

### Symptômes
- Les styles TailwindCSS ne s'appliquent pas
- Le site s'affiche sans style
- Les classes comme `bg-green-500`, `text-white` n'ont aucun effet

### Solutions

#### 1. Vérifier la Configuration TailwindCSS

**Étape 1 :** Vérifiez que le fichier `tailwind.config.js` existe dans le dossier `frontend/`

```bash
ls frontend/tailwind.config.js
```

**Étape 2 :** Vérifiez le contenu du fichier `frontend/src/index.css`

Le fichier doit commencer par :
```css
@import "tailwindcss";
```

**Étape 3 :** Vérifiez que `main.jsx` importe le CSS

```javascript
import './index.css'
```

#### 2. Réinstaller les Dépendances

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 3. Vérifier la Configuration Vite

Le fichier `vite.config.js` doit contenir :

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

#### 4. Test Rapide

Créez un fichier `test.html` dans le dossier `frontend/` :

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">
    <div class="bg-white p-4 rounded shadow">
        <h1 class="text-2xl text-green-600">Test TailwindCSS</h1>
    </div>
</body>
</html>
```

Ouvrez ce fichier dans votre navigateur. Si les styles s'appliquent, le problème vient de la configuration Vite.

#### 5. Redémarrer le Serveur de Développement

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

#### 6. Vérifier les Erreurs de Console

Ouvrez les outils de développement (F12) et vérifiez :
- Onglet Console : erreurs JavaScript
- Onglet Network : fichiers CSS non chargés
- Onglet Sources : fichiers CSS présents

### Solution Alternative : CDN TailwindCSS

Si le problème persiste, utilisez temporairement le CDN :

```html
<!-- Dans index.html -->
<script src="https://cdn.tailwindcss.com"></script>
```

## 🚀 Problème : Serveur de Développement ne démarre pas

### Symptômes
- Erreur "npm not found"
- Port déjà utilisé
- Erreurs de dépendances

### Solutions

#### 1. Vérifier Node.js et npm

```bash
node --version  # Doit être 18+
npm --version   # Doit être 8+
```

#### 2. Installer Node.js

**Windows :**
- Téléchargez depuis [nodejs.org](https://nodejs.org)
- Installez la version LTS

**Linux/Mac :**
```bash
# Avec nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### 3. Changer le Port

Si le port 5173 est occupé :

```bash
npm run dev -- --port 3000
```

#### 4. Nettoyer le Cache

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🗄️ Problème : Base de Données non Connectée

### Symptômes
- Erreur "Connection refused"
- "Database not found"
- Timeout de connexion

### Solutions

#### 1. Vérifier les Variables d'Environnement

Fichier `backend/.env` :
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=epitech_blockchain
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
```

#### 2. Vérifier que PostgreSQL est Démarré

```bash
# Linux/Mac
sudo systemctl start postgresql

# Windows
# Démarrer PostgreSQL depuis les Services
```

#### 3. Tester la Connexion

```bash
psql -h localhost -U postgres -d epitech_blockchain
```

#### 4. Utiliser Supabase (Recommandé)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Copiez les informations de connexion dans `.env`

## 🔐 Problème : Authentification ne Fonctionne pas

### Symptômes
- Erreur "Token invalid"
- Redirection infinie
- "Unauthorized" sur toutes les routes

### Solutions

#### 1. Vérifier JWT_SECRET

Fichier `backend/.env` :
```env
JWT_SECRET=votre_secret_tres_long_et_securise
JWT_EXPIRES_IN=7d
```

#### 2. Vérifier les Headers

Les requêtes doivent inclure :
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

#### 3. Vérifier le localStorage

```javascript
// Dans la console du navigateur
localStorage.getItem('token')
localStorage.getItem('user')
```

## 📱 Problème : Design non Responsive

### Symptômes
- Site cassé sur mobile
- Éléments qui débordent
- Navigation non fonctionnelle

### Solutions

#### 1. Vérifier les Classes Responsive

```html
<!-- Bon -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

<!-- Mauvais -->
<div class="grid grid-cols-3">
```

#### 2. Tester sur Différentes Tailles

- Ouvrir les outils de développement (F12)
- Cliquer sur l'icône mobile/tablet
- Tester différentes résolutions

#### 3. Vérifier la Meta Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## 🐛 Problème : Erreurs JavaScript

### Symptômes
- Page blanche
- Erreurs dans la console
- Fonctionnalités non disponibles

### Solutions

#### 1. Vérifier la Console

Ouvrez F12 > Console et cherchez les erreurs.

#### 2. Erreurs Courantes

**"Cannot read property of undefined"**
```javascript
// Mauvais
user.name

// Bon
user?.name
```

**"Module not found"**
```javascript
// Vérifier les imports
import { useAuth } from '../context/AuthContext';
```

#### 3. Vérifier les Dépendances

```bash
npm list
npm audit
```

## 🔄 Problème : Hot Reload ne Fonctionne pas

### Symptômes
- Les changements ne s'appliquent pas automatiquement
- F5 manuel nécessaire
- Serveur se ferme

### Solutions

#### 1. Vérifier la Configuration Vite

```javascript
export default defineConfig({
  server: {
    hmr: true,
    watch: {
      usePolling: true
    }
  }
})
```

#### 2. Redémarrer le Serveur

```bash
# Arrêter (Ctrl+C) et redémarrer
npm run dev
```

#### 3. Vérifier les Permissions de Fichier

```bash
# Linux/Mac
chmod -R 755 frontend/
```

## 📊 Problème : Performance Lente

### Symptômes
- Chargement lent
- Interface qui lag
- Timeout des requêtes

### Solutions

#### 1. Optimiser les Images

```javascript
// Utiliser des images optimisées
<img src="/images/logo.webp" alt="Logo" loading="lazy" />
```

#### 2. Lazy Loading

```javascript
const LazyComponent = lazy(() => import('./Component'));
```

#### 3. Vérifier les Requêtes API

```javascript
// Éviter les requêtes inutiles
const { data, loading } = useApi(apiFunction, [dependency]);
```

## 🆘 Obtenir de l'Aide

### 1. Vérifier la Documentation

- [README.md](../README.md)
- [API.md](./API.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)

### 2. Vérifier les Logs

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### 3. Créer un Issue

Si le problème persiste :
1. Décrivez le problème
2. Incluez les logs d'erreur
3. Spécifiez votre environnement (OS, Node.js version)
4. Ajoutez des captures d'écran si nécessaire

### 4. Contact

- 📧 Email : contact@epitech-blockchain.bj
- 💬 Discord : [Lien Discord]
- 🐛 Issues : [GitHub Issues]

---

**💡 Conseil :** Toujours vérifier la console du navigateur (F12) pour les erreurs JavaScript et les logs du serveur pour les erreurs backend.
