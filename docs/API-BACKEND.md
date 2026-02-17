# 🔌 Documentation API Backend - Club Blockchain Epitech

## 📋 Vue d'ensemble

L'API Backend du Club Blockchain Epitech est construite avec **Node.js** et **Express.js**, utilisant **PostgreSQL** comme base de données. Elle fournit une interface RESTful complète pour gérer tous les aspects du club.

### 🏗️ Architecture

```
Backend/
├── controllers/     # Logique métier
├── models/         # Modèles de données
├── routes/         # Définition des routes
├── middleware/     # Middleware (auth, validation, etc.)
├── config/         # Configuration (DB, etc.)
└── scripts/        # Scripts de migration
```

## 🔐 Authentification

### Base URL
```
http://localhost:5000/api
```

### Headers Requis
```http
Content-Type: application/json
Authorization: Bearer <token>
```

## 📚 Endpoints API

### 🔑 Authentification (`/auth`)

#### POST `/auth/login`
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "member",
      "position": "Étudiant",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST `/auth/register`
Inscription d'un nouvel utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "position": "Étudiant",
  "phone": "+22912345678"
}
```

#### GET `/auth/me`
Obtenir le profil de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "member",
      "position": "Étudiant",
      "phone": "+22912345678",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### PUT `/auth/profile`
Mettre à jour le profil utilisateur.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "position": "Étudiant",
  "phone": "+22912345678"
}
```

#### POST `/auth/change-password`
Changer le mot de passe.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### 👥 Utilisateurs (`/users`)

#### GET `/users`
Obtenir la liste des utilisateurs (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Numéro de page (défaut: 1)
- `limit` (number): Nombre d'éléments par page (défaut: 10)
- `role` (string): Filtrer par rôle
- `search` (string): Recherche par nom/email

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "member",
        "position": "Étudiant",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

#### GET `/users/executive-board`
Obtenir les membres du bureau exécutif.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "executiveBoard": [
      {
        "id": 1,
        "firstName": "Brouhane",
        "lastName": "BONI GOMINA",
        "position": "Président",
        "role": "admin",
        "email": "president@epitech-blockchain.bj"
      }
    ]
  }
}
```

#### GET `/users/:id`
Obtenir un utilisateur par ID.

**Headers:** `Authorization: Bearer <token>`

#### PUT `/users/:id`
Mettre à jour un utilisateur (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "role": "member",
  "position": "Étudiant",
  "isActive": true
}
```

#### DELETE `/users/:id`
Désactiver un utilisateur (Admin).

**Headers:** `Authorization: Bearer <token>`

#### GET `/users/stats/overview`
Obtenir les statistiques des utilisateurs (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeUsers": 145,
    "newUsersThisMonth": 25,
    "usersByRole": {
      "admin": 2,
      "executive": 12,
      "member": 131
    }
  }
}
```

### 🎯 Activités (`/activities`)

#### GET `/activities`
Obtenir la liste des activités.

**Query Parameters:**
- `page` (number): Numéro de page
- `limit` (number): Nombre d'éléments par page
- `type` (string): Type d'activité (seminar, conference, workshop, etc.)
- `status` (string): Statut (upcoming, ongoing, completed)
- `public` (boolean): Activités publiques uniquement

**Response (200):**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": 1,
        "title": "Introduction à la Blockchain",
        "description": "Séminaire d'introduction aux concepts blockchain",
        "type": "seminar",
        "status": "upcoming",
        "startDate": "2024-02-15T10:00:00.000Z",
        "endDate": "2024-02-15T12:00:00.000Z",
        "location": "Amphithéâtre Epitech",
        "maxParticipants": 100,
        "currentParticipants": 45,
        "isPublic": true,
        "createdBy": 1,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

#### GET `/activities/:id`
Obtenir une activité par ID.

#### POST `/activities`
Créer une nouvelle activité (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Introduction à la Blockchain",
  "description": "Séminaire d'introduction aux concepts blockchain",
  "type": "seminar",
  "startDate": "2024-02-15T10:00:00.000Z",
  "endDate": "2024-02-15T12:00:00.000Z",
  "location": "Amphithéâtre Epitech",
  "maxParticipants": 100,
  "isPublic": true
}
```

#### PUT `/activities/:id`
Mettre à jour une activité (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

#### DELETE `/activities/:id`
Supprimer une activité (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

#### POST `/activities/:id/register`
S'inscrire à une activité.

**Headers:** `Authorization: Bearer <token>`

#### DELETE `/activities/:id/register`
Se désinscrire d'une activité.

**Headers:** `Authorization: Bearer <token>`

### 📝 Examens (`/exams`)

#### GET `/exams`
Obtenir la liste des examens.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Numéro de page
- `limit` (number): Nombre d'éléments par page
- `status` (string): Statut (draft, published, completed)

#### GET `/exams/:id`
Obtenir un examen par ID.

**Headers:** `Authorization: Bearer <token>`

#### POST `/exams`
Créer un nouvel examen (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Examen Blockchain Niveau 1",
  "description": "Examen de validation des connaissances blockchain",
  "duration": 60,
  "maxAttempts": 3,
  "questions": [
    {
      "type": "multiple_choice",
      "question": "Qu'est-ce que la blockchain ?",
      "options": [
        "Une base de données centralisée",
        "Un registre distribué",
        "Une monnaie virtuelle",
        "Un protocole de communication"
      ],
      "correctAnswer": 1,
      "points": 10
    }
  ]
}
```

#### PUT `/exams/:id`
Mettre à jour un examen (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

#### DELETE `/exams/:id`
Supprimer un examen (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

#### POST `/exams/:id/start`
Commencer un examen.

**Headers:** `Authorization: Bearer <token>`

#### POST `/exams/:id/submit`
Soumettre les réponses d'un examen.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "answers": [
    {
      "questionId": 1,
      "answer": 1
    }
  ]
}
```

### 📊 Présence (`/attendance`)

#### GET `/attendance/activities/:activityId`
Obtenir la liste de présence pour une activité (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

#### POST `/attendance/activities/:activityId/mark`
Marquer la présence d'un étudiant (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "userId": 1,
  "status": "present"
}
```

#### GET `/attendance/users/:userId`
Obtenir l'historique de présence d'un utilisateur.

**Headers:** `Authorization: Bearer <token>`

### 🎫 Adhésion (`/membership`)

#### POST `/membership/apply`
Soumettre une demande d'adhésion.

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+22912345678",
  "position": "Étudiant",
  "motivation": "Passionné par la blockchain",
  "experience": "Débutant",
  "expectations": "Apprendre et contribuer"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "application": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "status": "pending",
      "submittedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### GET `/membership/applications`
Obtenir les demandes d'adhésion (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Numéro de page
- `limit` (number): Nombre d'éléments par page
- `status` (string): Statut (pending, approved, rejected)

#### GET `/membership/applications/:id`
Obtenir une demande d'adhésion par ID (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

#### PUT `/membership/applications/:id/review`
Examiner une demande d'adhésion (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "status": "approved",
  "comments": "Profil intéressant, accepté"
}
```

#### GET `/membership/stats`
Obtenir les statistiques des demandes d'adhésion (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

### 🤝 Partenaires (`/partners`)

#### GET `/partners`
Obtenir la liste des partenaires.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "partners": [
      {
        "id": 1,
        "name": "Epitech Bénin",
        "description": "École d'informatique",
        "website": "https://epitech.bj/",
        "logo": "/images/partners/epitech.png",
        "type": "academic",
        "isActive": true
      }
    ]
  }
}
```

#### GET `/partners/:id`
Obtenir un partenaire par ID.

#### POST `/partners`
Créer un nouveau partenaire (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

#### PUT `/partners/:id`
Mettre à jour un partenaire (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

#### DELETE `/partners/:id`
Supprimer un partenaire (Admin/Executive).

**Headers:** `Authorization: Bearer <token>`

## 🔒 Gestion des Erreurs

### Codes de Statut HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Ressource non trouvée
- `409` - Conflit (ex: email déjà utilisé)
- `422` - Erreur de validation
- `500` - Erreur serveur

### Format des Erreurs

```json
{
  "success": false,
  "error": {
    "message": "Message d'erreur",
    "code": "ERROR_CODE",
    "details": {
      "field": "Description de l'erreur"
    }
  }
}
```

### Exemples d'Erreurs

#### 400 - Requête Invalide
```json
{
  "success": false,
  "error": {
    "message": "Données de requête invalides",
    "code": "INVALID_REQUEST",
    "details": {
      "email": "Format d'email invalide"
    }
  }
}
```

#### 401 - Non Authentifié
```json
{
  "success": false,
  "error": {
    "message": "Token d'authentification manquant ou invalide",
    "code": "UNAUTHORIZED"
  }
}
```

#### 403 - Non Autorisé
```json
{
  "success": false,
  "error": {
    "message": "Accès refusé. Privilèges insuffisants",
    "code": "FORBIDDEN"
  }
}
```

## 🔐 Rôles et Permissions

### Rôles Disponibles

1. **`admin`** - Administrateur complet
   - Accès à toutes les fonctionnalités
   - Gestion des utilisateurs
   - Gestion du système

2. **`executive`** - Membre du bureau exécutif
   - Gestion des activités
   - Gestion des examens
   - Gestion des adhésions
   - Consultation des statistiques

3. **`member`** - Membre du club
   - Inscription aux activités
   - Passage des examens
   - Consultation du profil

### Matrice des Permissions

| Endpoint | Admin | Executive | Member |
|----------|-------|-----------|--------|
| `/auth/*` | ✅ | ✅ | ✅ |
| `/users` | ✅ | ✅ | ❌ |
| `/users/:id` | ✅ | ✅ | ❌ |
| `/activities` | ✅ | ✅ | ✅ |
| `/activities` (POST/PUT/DELETE) | ✅ | ✅ | ❌ |
| `/exams` | ✅ | ✅ | ✅ |
| `/exams` (POST/PUT/DELETE) | ✅ | ✅ | ❌ |
| `/attendance` | ✅ | ✅ | ❌ |
| `/membership/applications` | ✅ | ✅ | ❌ |
| `/partners` | ✅ | ✅ | ✅ |

## 📊 Base de Données

### Tables Principales

#### `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'member',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `activities`
```sql
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  max_participants INTEGER,
  is_public BOOLEAN DEFAULT true,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `exams`
```sql
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  max_attempts INTEGER DEFAULT 3,
  status VARCHAR(20) DEFAULT 'draft',
  questions JSONB NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Déploiement

### Variables d'Environnement

```env
# Serveur
PORT=5000
NODE_ENV=production

# Base de données
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=epitech_blockchain
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

### Scripts Disponibles

```bash
# Développement
npm run dev

# Production
npm start

# Migration de la base de données
npm run migrate

# Tests
npm test
```

## 🧪 Tests

### Tests Unitaires
```bash
npm run test:unit
```

### Tests d'Intégration
```bash
npm run test:integration
```

### Tests E2E
```bash
npm run test:e2e
```

## 📈 Monitoring et Logs

### Logs
- Logs d'application dans `logs/app.log`
- Logs d'erreurs dans `logs/error.log`
- Logs d'accès dans `logs/access.log`

### Métriques
- Temps de réponse des API
- Taux d'erreur
- Utilisation de la base de données
- Authentifications réussies/échouées

## 🔧 Maintenance

### Sauvegarde de la Base de Données
```bash
# Sauvegarde quotidienne
pg_dump epitech_blockchain > backup_$(date +%Y%m%d).sql
```

### Mise à Jour
```bash
# Mise à jour des dépendances
npm update

# Migration de la base de données
npm run migrate
```

---

**📞 Support Technique**

Pour toute question ou problème avec l'API :
- 📧 Email : tech@epitech-blockchain.bj
- 🐛 Issues : [GitHub Issues]
- 📚 Documentation : [Lien vers la documentation complète]
