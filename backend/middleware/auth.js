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

// Middleware d'autorisation pour les administrateurs
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.'
    });
  }
  next();
};

// Middleware d'autorisation pour les membres du bureau exécutif
export const requireExecutive = (req, res, next) => {
  if (!['admin', 'executive'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits de membre du bureau exécutif requis.'
    });
  }
  next();
};

// Middleware d'autorisation pour les membres actifs
export const requireMember = (req, res, next) => {
  if (!['admin', 'executive', 'member'].includes(req.user.role)) {
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
