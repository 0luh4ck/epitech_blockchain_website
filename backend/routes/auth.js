import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { handleValidationErrors, validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Enregistrer un nouvel utilisateur
// @access  Public
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, studentId } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Hacher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer l'utilisateur
    const result = await query(
      'INSERT INTO users (email, password, first_name, last_name, phone, student_id, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, phone || null, studentId || null, 'member']
    );

    // Générer le token JWT
    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        token,
        user: {
          id: result.insertId,
          email,
          firstName,
          lastName,
          role: 'member'
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Connexion d'un utilisateur
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const users = await query(
      'SELECT id, email, password, first_name, last_name, role, is_active, is_verified FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const user = users[0];

    // Vérifier si le compte est actif
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Votre compte a été désactivé. Contactez un administrateur.'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
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
          isVerified: user.is_verified
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
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
      'SELECT id, email, first_name, last_name, phone, student_id, role, position, bio, avatar, is_active, is_verified, last_login, created_at FROM users WHERE id = ?',
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
      'SELECT id, email, first_name, last_name, phone, student_id, role, position, bio, avatar, is_active, is_verified, last_login, created_at FROM users WHERE id = ?',
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
// @desc    Changer le mot de passe
// @access  Private
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel et nouveau mot de passe requis'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Récupérer le mot de passe actuel
    const user = await query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user[0].password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Hacher le nouveau mot de passe
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    await query(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
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
