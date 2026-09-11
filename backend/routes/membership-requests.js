import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin, requireExecutive } from '../middleware/auth.js';
import { handleValidationErrors, validateMembershipRequest } from '../middleware/validation.js';
import { generateTemporaryPassword, sendApprovalEmail, sendRejectionEmail } from '../services/emailService.js';

const router = express.Router();

/**
 * @swagger
 * /api/membership-requests:
 *   post:
 *     summary: "Soumettre une demande d'adhésion (public)"
 *     tags: [MembershipRequests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MembershipRequestInput' }
 *     responses:
 *       201: { description: 'Demande créée (statut pending)', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       400: { description: 'Email déjà utilisé / validation', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       500: { description: 'Erreur serveur', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *   get:
 *     summary: Lister les demandes d'adhésion (Bureau)
 *     tags: [MembershipRequests]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: status, schema: { type: string, enum: [pending, approved, rejected] } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200: { description: 'Liste paginée', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       403: { description: 'Bureau requis', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 * /api/membership-requests/{id}/approve:
 *   put:
 *     summary: Approuver une demande (crée le compte membre, Bureau)
 *     tags: [MembershipRequests]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: 'Demande approuvée', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       403: { description: 'Bureau requis', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       404: { description: 'Demande introuvable', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 * /api/membership-requests/{id}/reject:
 *   put:
 *     summary: Rejeter une demande (Bureau)
 *     tags: [MembershipRequests]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejectionReason: { type: string }
 *     responses:
 *       200: { description: 'Demande rejetée', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       403: { description: 'Bureau requis', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       404: { description: 'Demande introuvable', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 * /api/membership-requests/stats:
 *   get:
 *     summary: Statistiques des demandes (Admin)
 *     tags: [MembershipRequests]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: 'Statistiques', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       403: { description: 'Admin requis', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 */

// @route   POST /api/membership-requests
// @desc    Créer une demande d'adhésion
// @access  Public
router.post('/', validateMembershipRequest, async (req, res) => {
  try {
    const { email, firstName, lastName, phone, studentId, motivation } = req.body;

    // Vérifier si une demande existe déjà avec cet email
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

    // Vérifier si l'utilisateur a déjà un compte
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Un compte utilisateur existe déjà pour cet email'
      });
    }

    // Créer la demande d'adhésion
    await query(
      'INSERT INTO membership_requests (email, first_name, last_name, phone, student_id, motivation, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
      [email, firstName, lastName, phone || null, studentId || null, motivation || null]
    );

    res.status(201).json({
      success: true,
      message: 'Demande d\'adhésion soumise avec succès. Elle sera examinée par le Bureau Exécutif.'
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
// @desc    Récupérer toutes les demandes d'adhésion (Admin & Bureau Exécutif)
// @access  Private (Executive/Admin)
router.get('/', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (status) {
      whereClause = 'WHERE mr.status = ?';
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
      `SELECT COUNT(*) as total FROM membership_requests mr ${whereClause}`,
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
// @desc    Approuver une demande d'adhésion, générer MDP & envoyer e-mail
// @access  Private (Executive/Admin)
router.put('/:id/approve', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { id } = req.params;
    const { role = 'member' } = req.body;
    const reviewerId = req.user.id || req.user.userId;

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

    // 1. Générer automatiquement un mot de passe temporaire cryptographique (12 caractères)
    const tempPassword = generateTemporaryPassword();
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

    // 2. Créer l'utilisateur dans la table users
    const userResult = await query(
      'INSERT INTO users (email, password, first_name, last_name, phone, student_id, role, is_active, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, true, true)',
      [membershipRequest.email, hashedPassword, membershipRequest.first_name, membershipRequest.last_name, membershipRequest.phone, membershipRequest.student_id, role]
    );

    // 3. Marquer la demande comme approuvée
    await query(
      'UPDATE membership_requests SET status = "approved", reviewed_by = ?, reviewed_at = NOW() WHERE id = ?',
      [reviewerId, id]
    );

    // 4. Envoi automatique de l'e-mail avec identifiants via Nodemailer (expéditeur: moktar.vodounnon@epitech.eu)
    const emailResult = await sendApprovalEmail({
      email: membershipRequest.email,
      firstName: membershipRequest.first_name,
      lastName: membershipRequest.last_name,
      tempPassword
    });

    res.json({
      success: true,
      message: 'Demande d\'adhésion approuvée. Le mot de passe temporaire a été généré et transmis par e-mail.',
      data: {
        userId: userResult.insertId,
        email: membershipRequest.email,
        tempPasswordGenerated: tempPassword,
        emailStatus: emailResult
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
// @desc    Rejeter une demande d'adhésion et notifier le candidat
// @access  Private (Executive/Admin)
router.put('/:id/reject', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;
    const reviewerId = req.user.id || req.user.userId;

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

    // Marquer la demande comme rejetée
    await query(
      'UPDATE membership_requests SET status = "rejected", reviewed_by = ?, reviewed_at = NOW(), rejection_reason = ? WHERE id = ?',
      [reviewerId, rejection_reason || null, id]
    );

    // Envoi de l'email de notification de rejet
    await sendRejectionEmail({
      email: membershipRequest.email,
      firstName: membershipRequest.first_name,
      rejectionReason: rejection_reason
    });

    res.json({
      success: true,
      message: 'Demande d\'adhésion rejetée avec succès.'
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
