import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireExecutive, optionalAuth } from '../middleware/auth.js';
import { validateActivity, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/activities
// @desc    Obtenir la liste des activités
// @access  Public (avec données personnalisées si connecté)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status = 'published', search } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user?.id;

    let whereClause = 'WHERE 1=1';
    let params = [];

    // Filtrer par statut (public seulement si pas connecté)
    if (!userId) {
      whereClause += ' AND is_public = true AND status = "published"';
    } else {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Filtrer par type
    if (type) {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    // Recherche
    if (search) {
      whereClause += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Compter le total
    const countResult = await query(
      `SELECT COUNT(*) as total FROM activities ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Récupérer les activités
    const activities = await query(
      `SELECT a.*, u.first_name as creator_first_name, u.last_name as creator_last_name,
              CASE WHEN ar.user_id IS NOT NULL THEN true ELSE false END as is_registered
       FROM activities a
       LEFT JOIN users u ON a.created_by = u.id
       LEFT JOIN activity_registrations ar ON a.id = ar.activity_id AND ar.user_id = ?
       ${whereClause}
       ORDER BY a.start_date ASC
       LIMIT ? OFFSET ?`,
      [userId || null, ...params, parseInt(limit), offset]
    );

    res.json({
      success: true,
      data: {
        activities: activities.map(activity => ({
          id: activity.id,
          title: activity.title,
          description: activity.description,
          type: activity.type,
          status: activity.status,
          isPublic: activity.is_public,
          maxParticipants: activity.max_participants,
          currentParticipants: activity.current_participants,
          startDate: activity.start_date,
          endDate: activity.end_date,
          location: activity.location,
          onlineLink: activity.online_link,
          image: activity.image,
          requirements: activity.requirements,
          creator: {
            firstName: activity.creator_first_name,
            lastName: activity.creator_last_name
          },
          isRegistered: activity.is_registered,
          createdAt: activity.created_at,
          updatedAt: activity.updated_at
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
    console.error('Erreur lors de la récupération des activités:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des activités'
    });
  }
});

// @route   GET /api/activities/:id
// @desc    Obtenir une activité par ID
// @access  Public (avec données personnalisées si connecté)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const activities = await query(
      `SELECT a.*, u.first_name as creator_first_name, u.last_name as creator_last_name,
              CASE WHEN ar.user_id IS NOT NULL THEN true ELSE false END as is_registered,
              ar.status as registration_status
       FROM activities a
       LEFT JOIN users u ON a.created_by = u.id
       LEFT JOIN activity_registrations ar ON a.id = ar.activity_id AND ar.user_id = ?
       WHERE a.id = ?`,
      [userId || null, id]
    );

    if (activities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Activité non trouvée'
      });
    }

    const activity = activities[0];

    // Vérifier l'accès public
    if (!userId && (!activity.is_public || activity.status !== 'published')) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé à cette activité'
      });
    }

    // Récupérer les participants si l'utilisateur est connecté et a les droits
    let participants = [];
    if (userId && ['admin', 'executive'].includes(req.user.role)) {
      const participantData = await query(
        `SELECT u.id, u.first_name, u.last_name, u.email, ar.status, ar.registration_date
         FROM activity_registrations ar
         JOIN users u ON ar.user_id = u.id
         WHERE ar.activity_id = ?
         ORDER BY ar.registration_date ASC`,
        [id]
      );

      participants = participantData.map(p => ({
        id: p.id,
        firstName: p.first_name,
        lastName: p.last_name,
        email: p.email,
        status: p.status,
        registrationDate: p.registration_date
      }));
    }

    res.json({
      success: true,
      data: {
        activity: {
          id: activity.id,
          title: activity.title,
          description: activity.description,
          type: activity.type,
          status: activity.status,
          isPublic: activity.is_public,
          maxParticipants: activity.max_participants,
          currentParticipants: activity.current_participants,
          startDate: activity.start_date,
          endDate: activity.end_date,
          location: activity.location,
          onlineLink: activity.online_link,
          image: activity.image,
          requirements: activity.requirements,
          creator: {
            firstName: activity.creator_first_name,
            lastName: activity.creator_last_name
          },
          isRegistered: activity.is_registered,
          registrationStatus: activity.registration_status,
          participants,
          createdAt: activity.created_at,
          updatedAt: activity.updated_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'activité'
    });
  }
});

// @route   POST /api/activities
// @desc    Créer une nouvelle activité
// @access  Private (Executive/Admin)
router.post('/', authenticateToken, requireExecutive, validateActivity, async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      isPublic = false,
      maxParticipants,
      startDate,
      endDate,
      location,
      onlineLink,
      requirements
    } = req.body;

    const result = await query(
      `INSERT INTO activities (title, description, type, is_public, max_participants, start_date, end_date, location, online_link, requirements, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, type, isPublic, maxParticipants, startDate, endDate, location, onlineLink, requirements, req.user.id]
    );

    // Récupérer l'activité créée
    const newActivity = await query(
      'SELECT * FROM activities WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Activité créée avec succès',
      data: {
        activity: {
          id: newActivity[0].id,
          title: newActivity[0].title,
          description: newActivity[0].description,
          type: newActivity[0].type,
          status: newActivity[0].status,
          isPublic: newActivity[0].is_public,
          maxParticipants: newActivity[0].max_participants,
          currentParticipants: newActivity[0].current_participants,
          startDate: newActivity[0].start_date,
          endDate: newActivity[0].end_date,
          location: newActivity[0].location,
          onlineLink: newActivity[0].online_link,
          image: newActivity[0].image,
          requirements: newActivity[0].requirements,
          createdAt: newActivity[0].created_at,
          updatedAt: newActivity[0].updated_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'activité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'activité'
    });
  }
});

// @route   PUT /api/activities/:id
// @desc    Mettre à jour une activité
// @access  Private (Executive/Admin)
router.put('/:id', authenticateToken, requireExecutive, validateActivity, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      status,
      isPublic,
      maxParticipants,
      startDate,
      endDate,
      location,
      onlineLink,
      requirements
    } = req.body;

    // Vérifier que l'activité existe
    const existingActivity = await query('SELECT id FROM activities WHERE id = ?', [id]);
    if (existingActivity.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Activité non trouvée'
      });
    }

    await query(
      `UPDATE activities SET 
       title = ?, description = ?, type = ?, status = ?, is_public = ?, 
       max_participants = ?, start_date = ?, end_date = ?, location = ?, 
       online_link = ?, requirements = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, description, type, status, isPublic, maxParticipants, startDate, endDate, location, onlineLink, requirements, id]
    );

    // Récupérer l'activité mise à jour
    const updatedActivity = await query('SELECT * FROM activities WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Activité mise à jour avec succès',
      data: {
        activity: {
          id: updatedActivity[0].id,
          title: updatedActivity[0].title,
          description: updatedActivity[0].description,
          type: updatedActivity[0].type,
          status: updatedActivity[0].status,
          isPublic: updatedActivity[0].is_public,
          maxParticipants: updatedActivity[0].max_participants,
          currentParticipants: updatedActivity[0].current_participants,
          startDate: updatedActivity[0].start_date,
          endDate: updatedActivity[0].end_date,
          location: updatedActivity[0].location,
          onlineLink: updatedActivity[0].online_link,
          image: updatedActivity[0].image,
          requirements: updatedActivity[0].requirements,
          createdAt: updatedActivity[0].created_at,
          updatedAt: updatedActivity[0].updated_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'activité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'activité'
    });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Supprimer une activité
// @access  Private (Admin seulement)
router.delete('/:id', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'activité existe
    const existingActivity = await query('SELECT id FROM activities WHERE id = ?', [id]);
    if (existingActivity.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Activité non trouvée'
      });
    }

    // Supprimer l'activité (cascade supprimera les inscriptions et présences)
    await query('DELETE FROM activities WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Activité supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'activité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'activité'
    });
  }
});

// @route   POST /api/activities/:id/register
// @desc    S'inscrire à une activité
// @access  Private (Membres)
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier que l'activité existe et est ouverte aux inscriptions
    const activity = await query(
      'SELECT id, max_participants, current_participants, status, start_date FROM activities WHERE id = ?',
      [id]
    );

    if (activity.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Activité non trouvée'
      });
    }

    const activityData = activity[0];

    if (activityData.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cette activité n\'est pas ouverte aux inscriptions'
      });
    }

    if (new Date(activityData.start_date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Les inscriptions pour cette activité sont fermées'
      });
    }

    // Vérifier s'il y a de la place
    if (activityData.max_participants && activityData.current_participants >= activityData.max_participants) {
      return res.status(400).json({
        success: false,
        message: 'Cette activité est complète'
      });
    }

    // Vérifier si l'utilisateur est déjà inscrit
    const existingRegistration = await query(
      'SELECT id FROM activity_registrations WHERE user_id = ? AND activity_id = ?',
      [userId, id]
    );

    if (existingRegistration.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà inscrit à cette activité'
      });
    }

    // Créer l'inscription
    await query(
      'INSERT INTO activity_registrations (user_id, activity_id, status) VALUES (?, ?, ?)',
      [userId, id, 'registered']
    );

    // Mettre à jour le nombre de participants
    await query(
      'UPDATE activities SET current_participants = current_participants + 1 WHERE id = ?',
      [id]
    );

    res.status(201).json({
      success: true,
      message: 'Inscription réussie'
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
});

// @route   DELETE /api/activities/:id/register
// @desc    Se désinscrire d'une activité
// @access  Private (Membres)
router.delete('/:id/register', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier que l'inscription existe
    const registration = await query(
      'SELECT id FROM activity_registrations WHERE user_id = ? AND activity_id = ?',
      [userId, id]
    );

    if (registration.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée'
      });
    }

    // Supprimer l'inscription
    await query(
      'DELETE FROM activity_registrations WHERE user_id = ? AND activity_id = ?',
      [userId, id]
    );

    // Mettre à jour le nombre de participants
    await query(
      'UPDATE activities SET current_participants = current_participants - 1 WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Désinscription réussie'
    });
  } catch (error) {
    console.error('Erreur lors de la désinscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la désinscription'
    });
  }
});

export default router;
