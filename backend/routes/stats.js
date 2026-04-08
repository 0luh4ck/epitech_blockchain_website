import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/stats/dashboard
// @desc    Obtenir les statistiques pour le tableau de bord
// @access  Public
router.get('/dashboard', async (req, res) => {
  try {
    // 1. Activités à venir
    const upcomingActivities = await query(`
      SELECT COUNT(*) as count 
      FROM activities 
      WHERE status = 'published' AND start_date >= NOW()
    `);

    // 2. Membres actifs
    const activeMembers = await query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE is_active = true AND is_verified = true
    `);

    // 3. Examens disponibles
    const availableExams = await query(`
      SELECT COUNT(*) as count 
      FROM exams 
      WHERE is_active = true 
      AND (start_date IS NULL OR start_date <= NOW()) 
      AND (end_date IS NULL OR end_date >= NOW())
    `);

    // 4. Certifications
    const certifications = await query(`
      SELECT COUNT(*) as count 
      FROM exam_results 
      WHERE status = 'passed'
    `);

    res.json({
      success: true,
      data: {
        upcomingActivities: upcomingActivities[0].count,
        activeMembers: activeMembers[0].count,
        availableExams: availableExams[0].count,
        certifications: certifications[0].count
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
