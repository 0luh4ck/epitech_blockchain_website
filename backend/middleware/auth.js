import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

// Middleware d'authentification
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier que l'utilisateur existe toujours
    const user = await query(
      'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ? AND is_active = true',
      [decoded.userId]
    );

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé ou inactif'
      });
    }

    req.user = user[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Matrice RBAC à 3 niveaux : executive < admin < superadmin.
// (Le rôle stocké en BDD est 'admin' pour le Superadmin ; 'superadmin' est
// accepté partout par compatibilité avec le frontend.)

// Niveau 2 — Bureau Exécutif et au-delà : executive, admin, superadmin.
// Utilisé par : /api/membership-requests, /api/activities, /api/exams, GET /api/users.
export const requireExecutiveOrAdmin = (req, res, next) => {
  if (!['executive', 'admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits du Bureau Exécutif requis.'
    });
  }
  next();
};

// Niveau 3 — Admin et au-delà : admin, superadmin uniquement.
// Utilisé par : POST /api/users, PATCH /api/users/:id, DELETE /api/users/:id
// (modifications de comptes : rôle, statut, anonymisation, réactivation).
export const requireAdminOnly = (req, res, next) => {
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.'
    });
  }
  next();
};

// --- Alias historiques (conservés pour les routes existantes) ---
// Middleware d'autorisation pour les administrateurs
export const requireAdmin = requireAdminOnly;

// Middleware d'autorisation pour les membres du bureau exécutif
export const requireExecutive = requireExecutiveOrAdmin;

// Middleware d'autorisation pour les membres actifs
export const requireMember = (req, res, next) => {
  if (!['admin', 'executive', 'member', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Adhésion au club requise.'
    });
  }
  next();
};

// Middleware optionnel d'authentification (pour les routes publiques avec données personnalisées)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await query(
        'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ? AND is_active = true',
        [decoded.userId]
      );

      if (user.length > 0) {
        req.user = user[0];
      }
    }
    
    next();
  } catch (error) {
    // En cas d'erreur, on continue sans utilisateur authentifié
    next();
  }
};
