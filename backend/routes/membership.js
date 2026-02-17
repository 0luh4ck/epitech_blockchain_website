import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireExecutive } from '../middleware/auth.js';
import { validateMembershipApplication, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// @route   POST /api/membership/apply
// @desc    Soumettre une demande d'adhésion
// @access  Public
router.post('/apply', validateMembershipApplication, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      studentId,
      motivation,
      experience,
      interests
    } = req.body;

    // Vérifier si une demande existe déjà avec cet email
    const existingApplication = await query(
      'SELECT id FROM membership_applications WHERE email = ? AND status = "pending"',
      [email]
    );

    if (existingApplication.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Une demande d\'adhésion est déjà en cours pour cet email'
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
        message: 'Un compte existe déjà avec cet email'
      });
    }

    // Créer la demande d'adhésion
    const result = await query(
      `INSERT INTO membership_applications 
       (first_name, last_name, email, phone, student_id, motivation, experience, interests, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [firstName, lastName, email, phone, studentId, motivation, experience, interests]
    );

    res.status(201).json({
      success: true,
      message: 'Demande d\'adhésion soumise avec succès. Nous vous contacterons bientôt.',
      data: {
        applicationId: result.insertId
      }
    });
  } catch (error) {
    console.error('Erreur lors de la soumission de la demande d\'adhésion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la soumission de la demande d\'adhésion'
    });
  }
});

// @route   GET /api/membership/applications
// @desc    Obtenir la liste des demandes d'adhésion
// @access  Private (Executive/Admin)
router.get('/applications', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'pending', search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    // Filtrer par statut
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Recherche
    if (search) {
      whereClause += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Compter le total
    const countResult = await query(
      `SELECT COUNT(*) as total FROM membership_applications ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Récupérer les demandes
    const applications = await query(
      `SELECT ma.*, 
              reviewer.first_name as reviewer_first_name, 
              reviewer.last_name as reviewer_last_name
       FROM membership_applications ma
       LEFT JOIN users reviewer ON ma.reviewed_by = reviewer.id
       ${whereClause}
       ORDER BY ma.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      success: true,
      data: {
        applications: applications.map(app => ({
          id: app.id,
          firstName: app.first_name,
          lastName: app.last_name,
          email: app.email,
          phone: app.phone,
          studentId: app.student_id,
          motivation: app.motivation,
          experience: app.experience,
          interests: app.interests,
          status: app.status,
          reviewedBy: app.reviewer_first_name ? {
            firstName: app.reviewer_first_name,
            lastName: app.reviewer_last_name
          } : null,
          reviewedAt: app.reviewed_at,
          notes: app.notes,
          createdAt: app.created_at,
          updatedAt: app.updated_at
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes d\'adhésion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes d\'adhésion'
    });
  }
});

// @route   GET /api/membership/applications/:id
// @desc    Obtenir une demande d'adhésion par ID
// @access  Private (Executive/Admin)
router.get('/applications/:id', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { id } = req.params;

    const applications = await query(
      `SELECT ma.*, 
              reviewer.first_name as reviewer_first_name, 
              reviewer.last_name as reviewer_last_name
       FROM membership_applications ma
       LEFT JOIN users reviewer ON ma.reviewed_by = reviewer.id
       WHERE ma.id = ?`,
      [id]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Demande d\'adhésion non trouvée'
      });
    }

    const app = applications[0];

    res.json({
      success: true,
      data: {
        application: {
          id: app.id,
          firstName: app.first_name,
          lastName: app.last_name,
          email: app.email,
          phone: app.phone,
          studentId: app.student_id,
          motivation: app.motivation,
          experience: app.experience,
          interests: app.interests,
          status: app.status,
          reviewedBy: app.reviewer_first_name ? {
            firstName: app.reviewer_first_name,
            lastName: app.reviewer_last_name
          } : null,
          reviewedAt: app.reviewed_at,
          notes: app.notes,
          createdAt: app.created_at,
          updatedAt: app.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande d\'adhésion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la demande d\'adhésion'
    });
  }
});

// @route   PUT /api/membership/applications/:id/review
// @desc    Examiner une demande d'adhésion
// @access  Private (Executive/Admin)
router.put('/applications/:id/review', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const reviewerId = req.user.id;

    // Vérifier que la demande existe
    const application = await query(
      'SELECT * FROM membership_applications WHERE id = ?',
      [id]
    );

    if (application.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Demande d\'adhésion non trouvée'
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide. Utilisez "approved" ou "rejected"'
      });
    }

    // Mettre à jour la demande
    await query(
      'UPDATE membership_applications SET status = ?, notes = ?, reviewed_by = ?, reviewed_at = NOW(), updated_at = NOW() WHERE id = ?',
      [status, notes, reviewerId, id]
    );

    // Si approuvée, créer un compte utilisateur
    if (status === 'approved') {
      const app = application[0];
      
      // Vérifier que l'utilisateur n'existe pas déjà
      const existingUser = await query(
        'SELECT id FROM users WHERE email = ?',
        [app.email]
      );

      if (existingUser.length === 0) {
        // Générer un mot de passe temporaire
        const tempPassword = Math.random().toString(36).slice(-8);
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(tempPassword, 12);

        // Créer l'utilisateur
        await query(
          `INSERT INTO users (email, password, first_name, last_name, phone, student_id, role, is_active, is_verified)
           VALUES (?, ?, ?, ?, ?, ?, 'member', true, true)`,
          [app.email, hashedPassword, app.first_name, app.last_name, app.phone, app.student_id]
        );

        // TODO: Envoyer un email avec le mot de passe temporaire
        console.log(`Nouveau compte créé pour ${app.email} avec le mot de passe temporaire: ${tempPassword}`);
      }
    }

    res.json({
      success: true,
      message: `Demande d'adhésion ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès`
    });
  } catch (error) {
    console.error('Erreur lors de l\'examen de la demande d\'adhésion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'examen de la demande d\'adhésion'
    });
  }
});

// @route   GET /api/membership/stats
// @desc    Obtenir les statistiques des demandes d'adhésion
// @access  Private (Executive/Admin)
router.get('/stats', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_applications,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
      FROM membership_applications
    `);

    const monthlyApplications = await query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM membership_applications 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    res.json({
      success: true,
      data: {
        overview: stats[0],
        monthlyApplications
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques d\'adhésion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques d\'adhésion'
    });
  }
});

export default router;
