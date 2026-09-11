import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { handleValidationErrors, validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Enregistrer une demande d'adhésion (Workflow strict d'approbation)
// @access  Public
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, firstName, lastName, phone, studentId, motivation } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      });
    }

    // Vérifier si une demande d'adhésion est déjà en attente
    const existingRequest = await query(
      'SELECT id FROM membership_requests WHERE email = ? AND status = "pending"',
      [email]
    );

    if (existingRequest.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Une demande d\'adhésion avec cet email est déjà en attente d\'approbation'
      });
    }

    // Créer la demande d'adhésion (Statut Pending Obligatoire)
    await query(
      'INSERT INTO membership_requests (email, first_name, last_name, phone, student_id, motivation, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
      [email, firstName, lastName, phone || null, studentId || null, motivation || 'Demande d\'inscription depuis la plateforme']
    );

    res.status(201).json({
      success: true,
      pendingApproval: true,
      message: 'Demande d\'adhésion soumise avec succès. Votre dossier est en cours d\'examen par le Bureau Exécutif. Un email contenant vos accès vous sera envoyé après validation.'
    });
  } catch (error) {
    console.error('❌ Erreur dans POST /api/auth/register:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la soumission de la demande d\'adhésion'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Connexion d'un utilisateur
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password, space } = req.body;

    // Trouver l'utilisateur
    console.log('🔑 Tentative de connexion pour:', email, '| espace demandé:', space || '(défaut)');
    const users = await query(
      'SELECT id, email, password, first_name, last_name, role, is_active, is_verified, must_change_password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const user = users[0];
    const realRole = String(user.role || '').toLowerCase();
    console.log('👤 Utilisateur trouvé:', { email: user.email, role: user.role, isActive: user.is_active });

    // --- Contrôle d'accès par espace (Tabs public vs /admin/login) ---
    // Espace public : 'member' (Membre) | 'executive' (Membre du Bureau)
    // Espace isolé  : 'admin' (Superadmin, route /admin/login uniquement)
    const isAdminRole = realRole === 'admin' || realRole === 'superadmin';

    if (space === 'admin') {
      // Route /admin/login : seuls les admins passent
      if (!isAdminRole) {
        console.log('⛔ Accès admin refusé (rôle réel):', realRole);
        return res.status(403).json({
          success: false,
          message: "Ce compte n'a pas accès à l'espace d'administration."
        });
      }
    } else if (space === 'member' || space === 'executive') {
      // Connexion publique : le rôle choisi doit correspondre au rôle BDD
      if (isAdminRole) {
        console.log('⛔ Compte admin sur espace public:', email);
        return res.status(403).json({
          success: false,
          message: "Ce compte administrateur doit se connecter via /admin/login."
        });
      }
      if (realRole !== space) {
        console.log(`⛔ Rôle incohérent: demandé=${space}, réel=${realRole}`);
        return res.status(403).json({
          success: false,
          message: `Ce compte est enregistré comme « ${realRole === 'executive' ? 'Membre du Bureau' : 'Membre'} ». Veuillez sélectionner le bon espace.`
        });
      }
    } else {
      // Rétro-compatibilité (anciens clients sans champ space) :
      // on bloque les admins sur la page publique pour masquer le Superadmin.
      if (isAdminRole) {
        console.log('⛔ Compte admin sans espace admin:', email);
        return res.status(403).json({
          success: false,
          message: "Ce compte administrateur doit se connecter via /admin/login."
        });
      }
    }

    // Vérifier si le compte est actif
    if (!user.is_active) {
      console.log('❌ Compte inactif:', email);
      return res.status(401).json({
        success: false,
        message: 'Votre compte a été désactivé. Contactez un administrateur.'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔐 Mot de passe valide:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour la dernière connexion
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          isVerified: user.is_verified,
          mustChangePassword: !!user.must_change_password
        }
      }
    });
  } catch (error) {
    console.error('❌ Erreur dans POST /api/auth/login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtenir les informations de l'utilisateur connecté
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await query(
      'SELECT id, email, first_name, last_name, phone, student_id, role, position, bio, avatar, is_active, is_verified, must_change_password, last_login, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user[0].id,
          email: user[0].email,
          firstName: user[0].first_name,
          lastName: user[0].last_name,
          phone: user[0].phone,
          studentId: user[0].student_id,
          role: user[0].role,
          position: user[0].position,
          bio: user[0].bio,
          avatar: user[0].avatar,
          isActive: user[0].is_active,
          isVerified: user[0].is_verified,
          mustChangePassword: !!user[0].must_change_password,
          lastLogin: user[0].last_login,
          createdAt: user[0].created_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Mettre à jour le profil de l'utilisateur
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, bio } = req.body;
    const userId = req.user.id;

    // Mettre à jour le profil
    await query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, bio = ?, updated_at = NOW() WHERE id = ?',
      [firstName, lastName, phone, bio, userId]
    );

    // Récupérer les données mises à jour
    const updatedUser = await query(
      'SELECT id, email, first_name, last_name, phone, student_id, role, position, bio, avatar, is_active, is_verified, must_change_password, last_login, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        user: {
          id: updatedUser[0].id,
          email: updatedUser[0].email,
          firstName: updatedUser[0].first_name,
          lastName: updatedUser[0].last_name,
          phone: updatedUser[0].phone,
          studentId: updatedUser[0].student_id,
          role: updatedUser[0].role,
          position: updatedUser[0].position,
          bio: updatedUser[0].bio,
          avatar: updatedUser[0].avatar,
          isActive: updatedUser[0].is_active,
          isVerified: updatedUser[0].is_verified,
          mustChangePassword: !!updatedUser[0].must_change_password,
          lastLogin: updatedUser[0].last_login,
          createdAt: updatedUser[0].created_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Changer le mot de passe (Réinitialise must_change_password à false)
// @access  Private
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    // Contrat d'API : le frontend doit envoyer EXACTEMENT ces deux clés
    // (voir authService.change-password et MustChangePasswordModal).
    console.log('🔑 [change-password] clés reçues:', Object.keys(req.body || {}));
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Mot de passe actuel et nouveau mot de passe requis'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        code: 'WEAK_PASSWORD',
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Récupérer le mot de passe actuel (+ flag pour le cas Superadmin)
    const user = await query(
      'SELECT email, password, must_change_password FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'Utilisateur non trouvé'
      });
    }

    // Debug bcrypt : jamais de secret en clair, uniquement des métadonnées
    const storedHash = user[0].password || '';
    console.log('🔍 [change-password] user:', {
      userId,
      email: user[0].email,
      mustChangePassword: !!user[0].must_change_password,
      hashPresent: !!storedHash,
      hashPrefix: storedHash.substring(0, 7),
      hashLength: storedHash.length,
    });
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, storedHash);
    console.log('🔐 [change-password] bcrypt.compare =>', isCurrentPasswordValid);
    if (!isCurrentPasswordValid) {
      const isSuperadmin = user[0].email === 'epiblockchain@epitech.eu';
      return res.status(400).json({
        success: false,
        code: 'CURRENT_PASSWORD_MISMATCH',
        message: 'Mot de passe actuel incorrect',
        hint: isSuperadmin && user[0].must_change_password
          ? "Compte Superadmin en premier accès : utilisez le mot de passe initial '12345678' (réinitialisé automatiquement à chaque migration)."
          : undefined
      });
    }

    // Hacher le nouveau mot de passe
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe et libérer la modale (must_change_password = false)
    await query(
      'UPDATE users SET password = ?, must_change_password = false, updated_at = NOW() WHERE id = ?',
      [hashedNewPassword, userId]
    );

    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Rafraîchir le token JWT
// @access  Private
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const { userId, email } = req.user;

    // Générer un nouveau token
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Token rafraîchi avec succès',
      data: { token }
    });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du rafraîchissement du token'
    });
  }
});

export default router;
