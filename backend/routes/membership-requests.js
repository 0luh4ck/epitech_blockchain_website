import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { handleValidationErrors, validateMembershipRequest } from '../middleware/validation.js';

const router = express.Router();

// @route   POST /api/membership-requests
// @desc    Créer une demande d'adhésion
// @access  Public
router.post('/', validateMembershipRequest, async (req, res) => {
  try {
    const { email, firstName, lastName, phone, studentId, motivation } = req.body;

    // Vérifier si une demande existe déjà avec cet email
    const existingRequest = await query(
      'SELECT id FROM membership_requests WHERE email = ?',
      [email]
    );

    if (existingRequest.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Une demande d\'adhésion avec cet email existe déjà'
      });
    }

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

    // Créer la demande d'adhésion
    await query(
      'INSERT INTO membership_requests (email, first_name, last_name, phone, student_id, motivation) VALUES (?, ?, ?, ?, ?, ?)',
      [email, firstName, lastName, phone || null, studentId || null, motivation || null]
    );

    res.status(201).json({
      success: true,
      message: 'Demande d\'adhésion soumise avec succès. Elle sera examinée par nos administrateurs.'
    });
  } catch (error) {
    console.error('Erreur lors de la création de la demande d\'adhésion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la soumission de la demande d\'adhésion'
    });
  }
});

// @route   GET /api/membership-requests
// @desc    Récupérer toutes les demandes d'adhésion (admin seulement)
// @access  Private (Admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (status) {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }

    // Récupérer les demandes avec pagination
    const requests = await query(
      `SELECT mr.*, u.first_name as reviewer_first_name, u.last_name as reviewer_last_name 
       FROM membership_requests mr 
       LEFT JOIN users u ON mr.reviewed_by = u.id 
       ${whereClause} 
       ORDER BY mr.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // Compter le total
    const totalResult = await query(
      `SELECT COUNT(*) as total FROM membership_requests ${whereClause}`,
      params
    );

    const total = totalResult[0].total;

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes d\'adhésion'
    });
  }
});

// @route   PUT /api/membership-requests/:id/approve
// @desc    Approuver une demande d'adhésion (admin seulement)
// @access  Private (Admin)
router.put('/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { password, role = 'member' } = req.body;
    const adminId = req.user.userId;

    // Vérifier que la demande existe et est en attente
    const request = await query(
      'SELECT * FROM membership_requests WHERE id = ? AND status = "pending"',
      [id]
    );

    if (request.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Demande d\'adhésion non trouvée ou déjà traitée'
      });
    }

    const membershipRequest = request[0];

    // Générer un mot de passe temporaire si non fourni
    const tempPassword = password || Math.random().toString(36).slice(-8);
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

    // Créer l'utilisateur
    const userResult = await query(
      'INSERT INTO users (email, password, first_name, last_name, phone, student_id, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [membershipRequest.email, hashedPassword, membershipRequest.first_name, membershipRequest.last_name, membershipRequest.phone, membershipRequest.student_id, role]
    );

    // Marquer la demande comme approuvée
    await query(
      'UPDATE membership_requests SET status = "approved", reviewed_by = ?, reviewed_at = NOW() WHERE id = ?',
      [adminId, id]
    );

    res.json({
      success: true,
      message: 'Demande d\'adhésion approuvée avec succès',
      data: {
        userId: userResult.insertId,
        email: membershipRequest.email,
        tempPassword: password ? undefined : tempPassword // Ne pas renvoyer le mot de passe si fourni par l'admin
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'approbation de la demande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'approbation de la demande d\'adhésion'
    });
  }
});

// @route   PUT /api/membership-requests/:id/reject
// @desc    Rejeter une demande d'adhésion (admin seulement)
// @access  Private (Admin)
router.put('/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;
    const adminId = req.user.userId;

    // Vérifier que la demande existe et est en attente
    const request = await query(
      'SELECT * FROM membership_requests WHERE id = ? AND status = "pending"',
      [id]
    );

    if (request.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Demande d\'adhésion non trouvée ou déjà traitée'
      });
    }

    // Marquer la demande comme rejetée
    await query(
      'UPDATE membership_requests SET status = "rejected", reviewed_by = ?, reviewed_at = NOW(), rejection_reason = ? WHERE id = ?',
      [adminId, rejection_reason || null, id]
    );

    res.json({
      success: true,
      message: 'Demande d\'adhésion rejetée'
    });
  } catch (error) {
    console.error('Erreur lors du rejet de la demande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du rejet de la demande d\'adhésion'
    });
  }
});

// @route   GET /api/membership-requests/stats
// @desc    Récupérer les statistiques des demandes d'adhésion (admin seulement)
// @access  Private (Admin)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM membership_requests 
      GROUP BY status
    `);

    const totalRequests = await query('SELECT COUNT(*) as total FROM membership_requests');
    const recentRequests = await query(`
      SELECT COUNT(*) as count 
      FROM membership_requests 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    res.json({
      success: true,
      data: {
        byStatus: stats,
        total: totalRequests[0].total,
        recent: recentRequests[0].count
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

export default router;
