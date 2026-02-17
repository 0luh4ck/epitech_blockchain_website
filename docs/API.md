# 📚 Documentation API - Club Blockchain Epitech

Cette documentation décrit l'API REST du site web du Club Blockchain d'Epitech Bénin.

## 🔗 Base URL

```
Production: https://api.epitech-blockchain.bj/api
Development: http://localhost:5000/api
```

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Headers Requis

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## 📋 Endpoints

### 🔑 Authentification

#### POST /auth/register
Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+22912345678",
  "studentId": "EPI123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "member"
    }
  }
}
```

#### POST /auth/login
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Obtenir les informations de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

#### PUT /auth/profile
Mettre à jour le profil de l'utilisateur.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+22912345678",
  "bio": "Passionné de blockchain"
}
```

### 👥 Utilisateurs

#### GET /users
Obtenir la liste des utilisateurs (Admin/Executive).

**Query Parameters:**
- `page` (number): Numéro de page (défaut: 1)
- `limit` (number): Nombre d'éléments par page (défaut: 20)
- `role` (string): Filtrer par rôle
- `search` (string): Recherche par nom ou email

#### GET /users/executive-board
Obtenir les membres du bureau exécutif.

#### GET /users/:id
Obtenir un utilisateur par ID.

#### PUT /users/:id
Mettre à jour un utilisateur.

#### DELETE /users/:id
Désactiver un utilisateur (Admin).

### 📅 Activités

#### GET /activities
Obtenir la liste des activités.

**Query Parameters:**
- `page` (number): Numéro de page
- `limit` (number): Nombre d'éléments par page
- `type` (string): Type d'activité
- `status` (string): Statut de l'activité
- `search` (string): Recherche

#### GET /activities/:id
Obtenir une activité par ID.

#### POST /activities
Créer une nouvelle activité (Executive/Admin).

**Body:**
```json
{
  "title": "Séminaire Blockchain",
  "description": "Introduction à la blockchain",
  "type": "seminar",
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-15T12:00:00Z",
  "location": "Epitech Bénin",
  "maxParticipants": 50,
  "isPublic": true
}
```

#### PUT /activities/:id
Mettre à jour une activité (Executive/Admin).

#### DELETE /activities/:id
Supprimer une activité (Executive/Admin).

#### POST /activities/:id/register
S'inscrire à une activité.

#### DELETE /activities/:id/register
Se désinscrire d'une activité.

### 📝 Examens

#### GET /exams
Obtenir la liste des examens.

#### GET /exams/:id
Obtenir un examen par ID.

#### POST /exams
Créer un nouvel examen (Executive/Admin).

**Body:**
```json
{
  "title": "Examen Blockchain Basics",
  "description": "Test de connaissances de base",
  "durationMinutes": 60,
  "maxAttempts": 1,
  "passingScore": 60,
  "questions": [
    {
      "questionText": "Qu'est-ce que la blockchain ?",
      "questionType": "multiple_choice",
      "options": ["Base de données", "Réseau", "Cryptomonnaie"],
      "correctAnswer": "Base de données",
      "points": 1
    }
  ]
}
```

#### POST /exams/:id/start
Commencer un examen.

#### POST /exams/:id/submit
Soumettre les réponses d'un examen.

**Body:**
```json
{
  "answers": {
    "1": "Base de données",
    "2": "True"
  },
  "resultId": 123
}
```

#### GET /exams/:id/results
Obtenir les résultats d'un examen.

### 📊 Présence

#### GET /attendance/activity/:activityId
Obtenir la liste de présence pour une activité (Executive/Admin).

#### POST /attendance/mark
Marquer la présence d'un utilisateur (Executive/Admin).

**Body:**
```json
{
  "userId": 1,
  "activityId": 1,
  "status": "present",
  "notes": "Présent"
}
```

#### POST /attendance/bulk-mark
Marquer la présence de plusieurs utilisateurs (Executive/Admin).

#### GET /attendance/user/:userId
Obtenir l'historique de présence d'un utilisateur.

#### GET /attendance/stats/overview
Obtenir les statistiques globales de présence (Executive/Admin).

### 🎯 Adhésion

#### POST /membership/apply
Soumettre une demande d'adhésion.

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+22912345678",
  "studentId": "EPI123456",
  "motivation": "Passionné de blockchain...",
  "experience": "Expérience en programmation...",
  "interests": "DeFi, Smart Contracts..."
}
```

#### GET /membership/applications
Obtenir la liste des demandes d'adhésion (Executive/Admin).

#### GET /membership/applications/:id
Obtenir une demande d'adhésion par ID (Executive/Admin).

#### PUT /membership/applications/:id/review
Examiner une demande d'adhésion (Executive/Admin).

**Body:**
```json
{
  "status": "approved",
  "notes": "Demande approuvée"
}
```

#### GET /membership/stats
Obtenir les statistiques des demandes d'adhésion (Executive/Admin).

### 🤝 Partenaires

#### GET /partners
Obtenir la liste des partenaires.

#### GET /partners/:id
Obtenir un partenaire par ID.

#### POST /partners
Créer un nouveau partenaire (Executive/Admin).

#### PUT /partners/:id
Mettre à jour un partenaire (Executive/Admin).

#### DELETE /partners/:id
Supprimer un partenaire (Executive/Admin).

## 📊 Codes de Statut

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Accès refusé
- `404` - Ressource non trouvée
- `409` - Conflit
- `500` - Erreur serveur

## 🔒 Rôles et Permissions

### Admin
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs
- Configuration système

### Executive
- Gestion des activités et examens
- Gestion des demandes d'adhésion
- Consultation des statistiques

### Member
- Consultation des activités
- Inscription aux activités
- Passage des examens
- Gestion du profil personnel

## 📝 Exemples d'Utilisation

### JavaScript (Fetch)

```javascript
// Connexion
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('token', data.data.token);

// Requête authentifiée
const activities = await fetch('/api/activities', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

### cURL

```bash
# Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Requête authentifiée
curl -X GET http://localhost:5000/api/activities \
  -H "Authorization: Bearer <token>"
```

## 🚨 Gestion des Erreurs

### Format d'Erreur

```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": [
    {
      "field": "email",
      "message": "Format d'email invalide"
    }
  ]
}
```

### Erreurs Courantes

- **401 Unauthorized** : Token manquant ou invalide
- **403 Forbidden** : Permissions insuffisantes
- **404 Not Found** : Ressource non trouvée
- **409 Conflict** : Ressource déjà existante
- **422 Unprocessable Entity** : Données invalides

---

**📞 Support :** contact@epitech-blockchain.bj
