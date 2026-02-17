# 🧪 Guide de Test - Club Blockchain Epitech

Ce guide vous explique comment tester le site web du Club Blockchain d'Epitech Bénin.

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/Epitech-Blockchain-Website.git
cd Epitech-Blockchain-Website

# Installation automatique
npm run install
```

### 2. Configuration

1. **Backend** : Copiez `backend/.env.example` vers `backend/.env` et configurez vos variables
2. **Frontend** : Copiez `frontend/.env.example` vers `frontend/.env` et configurez vos variables
3. **Base de données** : Configurez votre base de données PostgreSQL (Supabase recommandé)

### 3. Migration de la Base de Données

```bash
cd backend
npm run migrate
```

### 4. Démarrage

```bash
# Démarrage automatique (backend + frontend)
npm run dev

# Ou démarrage manuel
cd backend && npm run dev &
cd frontend && npm run dev
```

## 🌐 URLs de Test

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000
- **API Health** : http://localhost:5000/health
- **API Documentation** : http://localhost:5000/api

## 🧪 Tests Fonctionnels

### 1. Pages Publiques

#### Page d'Accueil
- [ ] Affichage correct du contenu
- [ ] Navigation fonctionnelle
- [ ] Liens vers les autres pages
- [ ] Responsive design

#### Page À Propos
- [ ] Histoire du club
- [ ] Mission et vision
- [ ] Valeurs
- [ ] Fondateurs

#### Bureau Exécutif
- [ ] Liste des membres
- [ ] Informations de contact
- [ ] Structure organisationnelle

#### Partenaires
- [ ] Liste des partenaires
- [ ] Liens externes
- [ ] Informations de contact

#### Activités
- [ ] Liste des activités
- [ ] Filtres par type
- [ ] Détails des activités

#### Formulaire d'Adhésion
- [ ] Validation des champs
- [ ] Soumission du formulaire
- [ ] Message de confirmation

#### Contact
- [ ] Formulaire de contact
- [ ] Informations de contact
- [ ] Soumission du message

### 2. Authentification

#### Inscription
- [ ] Création de compte
- [ ] Validation des données
- [ ] Connexion automatique
- [ ] Redirection vers le dashboard

#### Connexion
- [ ] Authentification
- [ ] Gestion des erreurs
- [ ] Redirection selon le rôle
- [ ] Persistance de session

#### Déconnexion
- [ ] Suppression du token
- [ ] Redirection vers l'accueil
- [ ] Nettoyage du localStorage

### 3. Dashboard Utilisateur

#### Tableau de Bord
- [ ] Affichage des statistiques
- [ ] Actions rapides
- [ ] Navigation vers les sections

#### Profil
- [ ] Affichage des informations
- [ ] Modification du profil
- [ ] Sauvegarde des changements

### 4. Gestion des Activités

#### Consultation
- [ ] Liste des activités
- [ ] Détails d'une activité
- [ ] Filtres et recherche

#### Inscription
- [ ] Inscription à une activité
- [ ] Vérification des places
- [ ] Confirmation d'inscription

#### Désinscription
- [ ] Désinscription d'une activité
- [ ] Confirmation de désinscription

### 5. Système d'Examens

#### Consultation
- [ ] Liste des examens disponibles
- [ ] Détails d'un examen
- [ ] Historique des tentatives

#### Passage d'Examen
- [ ] Démarrage d'un examen
- [ ] Interface de questions
- [ ] Soumission des réponses
- [ ] Affichage des résultats

### 6. Administration (Admin/Executive)

#### Gestion des Membres
- [ ] Liste des utilisateurs
- [ ] Filtres et recherche
- [ ] Modification des rôles
- [ ] Désactivation de comptes

#### Gestion des Activités
- [ ] Création d'activités
- [ ] Modification d'activités
- [ ] Suppression d'activités
- [ ] Gestion des inscriptions

#### Gestion des Examens
- [ ] Création d'examens
- [ ] Ajout de questions
- [ ] Configuration des paramètres
- [ ] Consultation des résultats

#### Gestion de la Présence
- [ ] Marquage de présence
- [ ] Marquage en lot
- [ ] Consultation des statistiques
- [ ] Historique de présence

#### Demandes d'Adhésion
- [ ] Consultation des demandes
- [ ] Validation des demandes
- [ ] Création automatique de comptes
- [ ] Envoi de notifications

## 🔧 Tests Techniques

### 1. Performance

#### Frontend
- [ ] Temps de chargement < 3s
- [ ] Images optimisées
- [ ] Lazy loading fonctionnel
- [ ] Code splitting

#### Backend
- [ ] Temps de réponse API < 500ms
- [ ] Compression gzip
- [ ] Cache headers
- [ ] Rate limiting

### 2. Sécurité

#### Authentification
- [ ] Tokens JWT valides
- [ ] Expiration des tokens
- [ ] Hachage des mots de passe
- [ ] Protection CSRF

#### API
- [ ] Validation des données
- [ ] Sanitisation des entrées
- [ ] Gestion des erreurs
- [ ] Logs de sécurité

### 3. Responsive Design

#### Mobile (< 768px)
- [ ] Navigation mobile
- [ ] Contenu adapté
- [ ] Formulaires utilisables
- [ ] Images responsives

#### Tablette (768px - 1024px)
- [ ] Layout adapté
- [ ] Navigation optimisée
- [ ] Contenu lisible

#### Desktop (> 1024px)
- [ ] Layout complet
- [ ] Navigation étendue
- [ ] Fonctionnalités avancées

## 🐛 Tests de Régression

### 1. Navigation
- [ ] Tous les liens fonctionnent
- [ ] Breadcrumbs corrects
- [ ] Retour en arrière
- [ ] Redirections

### 2. Formulaires
- [ ] Validation côté client
- [ ] Validation côté serveur
- [ ] Messages d'erreur
- [ ] Soumission réussie

### 3. États d'Erreur
- [ ] Page 404
- [ ] Erreurs serveur
- [ ] Connexion perdue
- [ ] Données manquantes

## 📊 Tests de Charge

### 1. Utilisateurs Simultanés
- [ ] 10 utilisateurs
- [ ] 50 utilisateurs
- [ ] 100 utilisateurs

### 2. Requêtes API
- [ ] 100 req/min
- [ ] 1000 req/min
- [ ] 5000 req/min

## 🔍 Tests d'Accessibilité

### 1. Navigation Clavier
- [ ] Tab navigation
- [ ] Focus visible
- [ ] Skip links
- [ ] ARIA labels

### 2. Lecteurs d'Écran
- [ ] Alt text images
- [ ] Headings structure
- [ ] Form labels
- [ ] Error messages

## 📱 Tests Multi-Navigateurs

### Navigateurs Supportés
- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)

### Fonctionnalités
- [ ] JavaScript activé
- [ ] Cookies activés
- [ ] LocalStorage disponible
- [ ] Fetch API supportée

## 🚨 Tests d'Erreur

### 1. Données Invalides
- [ ] Email malformé
- [ ] Mot de passe faible
- [ ] Champs requis manquants
- [ ] Données trop longues

### 2. États d'Exception
- [ ] Base de données indisponible
- [ ] API externe indisponible
- [ ] Fichiers manquants
- [ ] Permissions insuffisantes

## 📋 Checklist de Déploiement

### Pré-Déploiement
- [ ] Tous les tests passent
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] SSL configuré
- [ ] Domaines configurés

### Post-Déploiement
- [ ] Site accessible
- [ ] API fonctionnelle
- [ ] Base de données connectée
- [ ] Emails fonctionnels
- [ ] Monitoring actif

## 🛠️ Outils de Test

### Frontend
- **Lighthouse** : Performance et accessibilité
- **Chrome DevTools** : Debug et performance
- **React DevTools** : Debug React
- **Jest** : Tests unitaires

### Backend
- **Postman** : Tests API
- **Jest** : Tests unitaires
- **Supertest** : Tests d'intégration
- **Newman** : Tests automatisés

### Base de Données
- **pgAdmin** : Interface graphique
- **psql** : Ligne de commande
- **Supabase Dashboard** : Interface web

---

**🎯 Objectif :** Assurer une expérience utilisateur fluide et sécurisée sur toutes les plateformes et dans toutes les conditions.
