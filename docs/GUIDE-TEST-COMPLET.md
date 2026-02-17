# 🧪 Guide de Test Complet - Club Blockchain Epitech

## 📋 Vue d'ensemble

Ce guide vous accompagne pour tester toutes les fonctionnalités du site web du Club Blockchain Epitech, de l'installation à la validation complète du système.

## 🚀 Préparation des Tests

### 1. Installation de l'Environnement

#### Prérequis
- **Node.js 18+** : [Télécharger](https://nodejs.org)
- **PostgreSQL** ou **Supabase** : Base de données
- **Git** : Pour cloner le projet

#### Installation
```bash
# 1. Cloner le projet
git clone <repository-url>
cd Epitech-Blockchain-Website

# 2. Installer les dépendances
cd frontend && npm install
cd ../backend && npm install

# 3. Configuration
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# 4. Configurer les variables d'environnement
# Éditer frontend/.env et backend/.env

# 5. Migration de la base de données
cd backend && npm run migrate

# 6. Démarrage
npm run dev
```

### 2. Vérification de l'Installation

#### Test de Base
```bash
# Vérifier que les serveurs démarrent
curl http://localhost:5173  # Frontend
curl http://localhost:5000/health  # Backend API
```

#### Test TailwindCSS
1. Ouvrir `http://localhost:5173`
2. Vérifier que les styles s'appliquent correctement
3. Tester la responsivité sur différentes tailles d'écran

## 🎯 Tests par Fonctionnalité

### 1. 🌐 Tests des Pages Publiques

#### Page d'Accueil (`/`)
**Tests à effectuer :**
- [ ] Logo du club s'affiche correctement
- [ ] Navigation fonctionne
- [ ] Boutons "Rejoindre le Club" et "Voir les Activités" fonctionnent
- [ ] Statistiques s'affichent
- [ ] Section des membres du bureau s'affiche
- [ ] Footer avec liens sociaux fonctionne

**Tests Responsive :**
- [ ] Mobile (320px - 768px)
- [ ] Tablette (768px - 1024px)
- [ ] Desktop (1024px+)

#### Page À Propos (`/about`)
**Tests à effectuer :**
- [ ] Histoire du club s'affiche
- [ ] Mission et vision sont présentes
- [ ] Liste des fondateurs complète
- [ ] Timeline des événements
- [ ] Témoignages des membres

#### Bureau Exécutif (`/executive-board`)
**Tests à effectuer :**
- [ ] Tous les membres du bureau 2025-2026 s'affichent
- [ ] Photos des membres (ou initiales si pas de photo)
- [ ] Informations de contact (email, LinkedIn, Twitter)
- [ ] Structure organisationnelle
- [ ] Responsive sur mobile

#### Partenaires (`/partners`)
**Tests à effectuer :**
- [ ] Epitech Bénin avec lien vers https://epitech.bj/
- [ ] Future Studio avec lien vers https://www.futurestudio.bj/
- [ ] Africa Blockchain Institute avec lien vers https://africablockchain.institute/
- [ ] Logos des partenaires s'affichent
- [ ] Liens externes s'ouvrent dans un nouvel onglet

#### Activités (`/activities`)
**Tests à effectuer :**
- [ ] Liste des activités publiques
- [ ] Filtres par type (séminaire, conférence, atelier)
- [ ] Filtres par statut (à venir, en cours, terminé)
- [ ] Recherche par titre
- [ ] Pagination fonctionne
- [ ] Bouton d'inscription (si connecté)

#### Formulaire d'Adhésion (`/membership`)
**Tests à effectuer :**
- [ ] Formulaire complet s'affiche
- [ ] Validation des champs obligatoires
- [ ] Validation du format email
- [ ] Validation du numéro de téléphone
- [ ] Soumission du formulaire
- [ ] Message de confirmation
- [ ] Redirection après soumission

#### Contact (`/contact`)
**Tests à effectuer :**
- [ ] Formulaire de contact fonctionne
- [ ] Informations de contact s'affichent
- [ ] Carte interactive (si implémentée)
- [ ] Validation des champs
- [ ] Envoi d'email de contact

### 2. 🔐 Tests d'Authentification

#### Inscription (`/register`)
**Tests à effectuer :**
- [ ] Formulaire d'inscription s'affiche
- [ ] Validation des champs :
  - [ ] Email valide et unique
  - [ ] Mot de passe fort (8+ caractères)
  - [ ] Confirmation du mot de passe
  - [ ] Prénom et nom obligatoires
- [ ] Inscription réussie
- [ ] Connexion automatique après inscription
- [ ] Redirection vers le dashboard

#### Connexion (`/login`)
**Tests à effectuer :**
- [ ] Formulaire de connexion s'affiche
- [ ] Connexion avec email/mot de passe valides
- [ ] Gestion des erreurs (email inexistant, mot de passe incorrect)
- [ ] "Se souvenir de moi" fonctionne
- [ ] Redirection vers le dashboard après connexion
- [ ] Token JWT stocké dans localStorage

#### Déconnexion
**Tests à effectuer :**
- [ ] Bouton de déconnexion dans le menu utilisateur
- [ ] Déconnexion réussie
- [ ] Token supprimé du localStorage
- [ ] Redirection vers la page d'accueil
- [ ] Accès aux pages protégées bloqué

### 3. 👤 Tests du Dashboard Membre

#### Accès au Dashboard (`/dashboard`)
**Tests à effectuer :**
- [ ] Accès uniquement si connecté
- [ ] Redirection vers login si non connecté
- [ ] Informations personnelles s'affichent
- [ ] Statistiques personnelles (activités, examens)
- [ ] Actions rapides disponibles

#### Profil Utilisateur (`/profile`)
**Tests à effectuer :**
- [ ] Informations personnelles modifiables
- [ ] Mise à jour du profil
- [ ] Changement de mot de passe
- [ ] Historique des activités
- [ ] Historique des examens
- [ ] Sauvegarde des modifications

#### Gestion des Activités
**Tests à effectuer :**
- [ ] Liste des activités disponibles
- [ ] Inscription à une activité
- [ ] Désinscription d'une activité
- [ ] Vérification des places disponibles
- [ ] Historique des inscriptions

#### Système d'Examens
**Tests à effectuer :**
- [ ] Liste des examens disponibles
- [ ] Début d'un examen
- [ ] Timer fonctionne correctement
- [ ] Sauvegarde automatique des réponses
- [ ] Soumission de l'examen
- [ ] Affichage des résultats
- [ ] Gestion des tentatives multiples

### 4. 🛡️ Tests du Dashboard Admin/Executive

#### Accès Administrateur (`/admin`)
**Tests à effectuer :**
- [ ] Accès uniquement pour admin/executive
- [ ] Redirection si pas les droits
- [ ] Interface d'administration complète
- [ ] Statistiques globales

#### Gestion des Utilisateurs
**Tests à effectuer :**
- [ ] Liste des utilisateurs
- [ ] Filtres et recherche
- [ ] Création d'un nouvel utilisateur
- [ ] Modification d'un utilisateur
- [ ] Désactivation d'un utilisateur
- [ ] Gestion des rôles

#### Gestion des Activités
**Tests à effectuer :**
- [ ] Création d'une nouvelle activité
- [ ] Modification d'une activité existante
- [ ] Suppression d'une activité
- [ ] Gestion des participants
- [ ] Marquage de présence
- [ ] Statistiques de participation

#### Gestion des Examens
**Tests à effectuer :**
- [ ] Création d'un nouvel examen
- [ ] Ajout de questions (QCM, Vrai/Faux, etc.)
- [ ] Configuration des paramètres (durée, tentatives)
- [ ] Publication d'un examen
- [ ] Consultation des résultats
- [ ] Statistiques des examens

#### Gestion des Adhésions
**Tests à effectuer :**
- [ ] Liste des demandes d'adhésion
- [ ] Consultation d'une demande
- [ ] Approbation d'une demande
- [ ] Rejet d'une demande
- [ ] Création automatique de compte
- [ ] Notification par email

#### Gestion des Partenaires
**Tests à effectuer :**
- [ ] Ajout d'un nouveau partenaire
- [ ] Modification d'un partenaire
- [ ] Suppression d'un partenaire
- [ ] Upload de logo
- [ ] Gestion des liens externes

### 5. 📱 Tests de Responsivité

#### Breakpoints à Tester
- **Mobile** : 320px, 375px, 414px
- **Tablette** : 768px, 1024px
- **Desktop** : 1280px, 1440px, 1920px

#### Éléments à Vérifier
- [ ] Navigation mobile (hamburger menu)
- [ ] Images et logos s'adaptent
- [ ] Textes restent lisibles
- [ ] Boutons et formulaires utilisables
- [ ] Tableaux responsives
- [ ] Modales et popups

### 6. 🔒 Tests de Sécurité

#### Authentification
- [ ] Tokens JWT valides
- [ ] Expiration des tokens
- [ ] Protection des routes sensibles
- [ ] Déconnexion automatique après inactivité

#### Autorisation
- [ ] Accès aux pages selon les rôles
- [ ] API protégées par rôles
- [ ] Données sensibles non exposées

#### Validation
- [ ] Validation côté client et serveur
- [ ] Protection contre l'injection SQL
- [ ] Sanitisation des entrées utilisateur
- [ ] Limitation du taux de requêtes

### 7. 🌐 Tests de Performance

#### Temps de Chargement
- [ ] Page d'accueil < 3 secondes
- [ ] Pages internes < 2 secondes
- [ ] Images optimisées
- [ ] Lazy loading des composants

#### Optimisations
- [ ] Compression des assets
- [ ] Cache des ressources statiques
- [ ] Minification du CSS/JS
- [ ] Optimisation des images

## 🐛 Tests de Gestion d'Erreurs

### Erreurs Frontend
- [ ] Erreurs 404 (page non trouvée)
- [ ] Erreurs 500 (erreur serveur)
- [ ] Erreurs de réseau
- [ ] Erreurs de validation
- [ ] Messages d'erreur clairs

### Erreurs Backend
- [ ] Erreurs de base de données
- [ ] Erreurs d'authentification
- [ ] Erreurs de validation
- [ ] Logs d'erreurs appropriés

## 📊 Tests de Données

### Base de Données
- [ ] Connexion à la base de données
- [ ] Migration des données
- [ ] Intégrité des données
- [ ] Sauvegarde et restauration

### Données de Test
- [ ] Utilisateurs de test
- [ ] Activités de test
- [ ] Examens de test
- [ ] Données de démonstration

## 🔄 Tests d'Intégration

### API Backend
- [ ] Tous les endpoints fonctionnent
- [ ] Réponses JSON valides
- [ ] Codes de statut corrects
- [ ] Gestion des erreurs

### Frontend-Backend
- [ ] Communication API fonctionne
- [ ] Authentification synchronisée
- [ ] Données cohérentes
- [ ] Gestion des erreurs réseau

## 📋 Checklist de Validation

### ✅ Fonctionnalités Principales
- [ ] Pages publiques accessibles
- [ ] Authentification fonctionnelle
- [ ] Dashboard membre opérationnel
- [ ] Dashboard admin opérationnel
- [ ] Formulaire d'adhésion fonctionnel
- [ ] Système d'activités complet
- [ ] Système d'examens complet
- [ ] Gestion des utilisateurs
- [ ] Gestion des partenaires

### ✅ Qualité Technique
- [ ] Code propre et documenté
- [ ] Tests unitaires passent
- [ ] Performance acceptable
- [ ] Sécurité appropriée
- [ ] Responsive design
- [ ] Accessibilité de base

### ✅ Expérience Utilisateur
- [ ] Navigation intuitive
- [ ] Messages d'erreur clairs
- [ ] Feedback utilisateur approprié
- [ ] Chargement rapide
- [ ] Interface moderne

## 🚀 Tests de Déploiement

### Environnement de Production
- [ ] Variables d'environnement configurées
- [ ] Base de données de production
- [ ] SSL/HTTPS configuré
- [ ] Domaine configuré
- [ ] Monitoring en place

### Tests Post-Déploiement
- [ ] Site accessible publiquement
- [ ] Toutes les fonctionnalités opérationnelles
- [ ] Performance en production
- [ ] Logs de production
- [ ] Sauvegarde automatique

## 📞 Support et Maintenance

### Documentation
- [ ] README à jour
- [ ] Documentation API complète
- [ ] Guide d'installation
- [ ] Guide de déploiement
- [ ] Guide de maintenance

### Monitoring
- [ ] Logs d'application
- [ ] Métriques de performance
- [ ] Alertes d'erreur
- [ ] Monitoring de la base de données

---

## 🎯 Résumé des Tests

### Tests Critiques (Obligatoires)
1. **Authentification** - Connexion/Inscription/Déconnexion
2. **Pages Publiques** - Toutes les pages accessibles
3. **Dashboard Membre** - Fonctionnalités de base
4. **Dashboard Admin** - Gestion complète
5. **Responsive** - Mobile, tablette, desktop
6. **Sécurité** - Protection des données

### Tests Recommandés
1. **Performance** - Temps de chargement
2. **Accessibilité** - Utilisation avec lecteurs d'écran
3. **Compatibilité** - Différents navigateurs
4. **Données** - Intégrité et cohérence

### Tests Optionnels
1. **Stress** - Charge élevée
2. **Sécurité Avancée** - Tests de pénétration
3. **Internationalisation** - Support multilingue

---

**🎉 Félicitations !** Si tous ces tests passent, votre site web du Club Blockchain Epitech est prêt pour la production !

**📞 Support :** Pour toute question ou problème, consultez la documentation ou contactez l'équipe technique.
