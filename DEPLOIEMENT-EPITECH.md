# 🚀 Guide de Déploiement - Club Blockchain Epitech Bénin

Ce guide vous explique comment déployer votre site web complet (Frontend, Backend et Base de données) gratuitement sur le cloud.

## 📋 Architecture
*   **Frontend :** React + Vite (Déployé sur **Vercel**)
*   **Backend :** Node.js + Express (Déployé sur **Render.com**)
*   **Base de données :** MySQL (Hébergé sur **TiDB Cloud**)

---

## 🗄️ Étape 1 : Base de Données (TiDB Cloud)

1.  **Créer un compte :** Allez sur [tidbcloud.com](https://tidbcloud.com) et créez un compte gratuit.
2.  **Créer un Cluster :** 
    *   Choisissez **TiDB Serverless**.
    *   Sélectionnez une région proche (ex: AWS Frankfurt).
    *   Nommez votre cluster `epitech-blockchain`.
3.  **Récupérer les accès :** 
    *   Cliquez sur **Connect**.
    *   Sélectionnez **Node.js** (mysql2).
    *   Notez votre `Host`, `Port` (souvent 4000), `User`, et `Password`.
    *   Notez également que TiDB Serverless **nécessite SSL**.
4.  **Initialiser le schéma :**
    *   Allez dans l'onglet **SQL Editor**.
    *   Copiez-collez le contenu du fichier [database-schema.sql](file:///home/moktar/Projects/Block-chain/Epitech-Blockchain-Website/backend/scripts/database-schema.sql) pour créer les tables.

---

## ⚙️ Étape 2 : Backend (Render.com)

1.  **Nouveau Web Service :** Sur [render.com](https://render.com), créez un **Web Service**.
2.  **Configuration :**
    *   **Root Directory :** `backend`
    *   **Build Command :** `npm install`
    *   **Start Command :** `npm start`
3.  **Variables d'environnement :**
    *   `DB_HOST` : (Votre host TiDB Cloud)
    *   `DB_USER` : (Votre username TiDB Cloud)
    *   `DB_PASSWORD` : (Votre password TiDB Cloud)
    *   `DB_NAME` : `test` (ou le nom de votre base sur TiDB)
    *   `DB_PORT` : `4000`
    *   `JWT_SECRET` : (Une phrase secrète longue)
    *   `NODE_ENV` : `production`
    *   `FRONTEND_URL` : (À mettre à jour après l'étape 3)

---

## 🎨 Étape 3 : Frontend (Vercel)

1.  **Importer le projet :** Sur [vercel.com](https://vercel.com), importez votre dépôt.
2.  **Configuration :**
    *   **Root Directory :** `frontend`
    *   **Framework Preset :** Vite
3.  **Variables d'environnement :**
    *   `VITE_API_URL` : `https://[URL-RENDER]/api`
4.  **Déployer :** Cliquez sur **Deploy**.

---

## 🔗 Étape 4 : Connexion Finale

1.  **CORS Backend :** Dans Render, mettez à jour `FRONTEND_URL` avec l'URL de Vercel.
2.  **Test :** Vérifiez que tout fonctionne !

---

## 👤 Accès Administrateur par défaut

*   **Email :** `admin@epitech-blockchain.bj`
*   **Mot de passe :** `Admin123!`

---

## 🛠️ Maintenance

*   **Mise à jour :** `git push` déploie automatiquement sur Vercel et Render.
*   **Logs :** Vérifiez les logs sur Render/Vercel en cas de problème.
