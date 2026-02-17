import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireExecutive } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/attendance/activity/:activityId
// @desc    Obtenir la liste de présence pour une activité
// @access  Private (Executive/Admin)
router.get('/activity/:activityId', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { activityId } = req.params;

    // Vérifier que l'activité existe
    const activity = await query('SELECT id, title FROM activities WHERE id = ?', [activityId]);
    if (activity.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Activité non trouvée'
      });
    }

    // Récupérer les inscriptions et présences
    const attendance = await query(
      `SELECT 
        u.id, u.first_name, u.last_name, u.email, u.student_id,
        ar.status as registration_status, ar.registration_date,
        a.status as attendance_status, a.check_in_time, a.notes, a.marked_by,
        marker.first_name as marked_by_first_name, marker.last_name as marked_by_last_name
       FROM activity_registrations ar
       JOIN users u ON ar.user_id = u.id
       LEFT JOIN attendance a ON ar.user_id = a.user_id AND ar.activity_id = a.activity_id
       LEFT JOIN users marker ON a.marked_by = marker.id
       WHERE ar.activity_id = ?
       ORDER BY u.last_name, u.first_name`,
      [activityId]
    );

    res.json({
      success: true,
      data: {
        activity: {
          id: activity[0].id,
          title: activity[0].title
        },
        attendance: attendance.map(record => ({
          user: {
            id: record.id,
            firstName: record.first_name,
            lastName: record.last_name,
            email: record.email,
            studentId: record.student_id
          },
          registration: {
            status: record.registration_status,
            date: record.registration_date
          },
          attendance: record.attendance_status ? {
            status: record.attendance_status,
            checkInTime: record.check_in_time,
            notes: record.notes,
            markedBy: record.marked_by ? {
              firstName: record.marked_by_first_name,
              lastName: record.marked_by_last_name
            } : null
          } : null
        }))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la présence:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la présence'
    });
  }
});

// @route   POST /api/attendance/mark
// @desc    Marquer la présence d'un utilisateur
// @access  Private (Executive/Admin)
router.post('/mark', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { userId, activityId, status, notes } = req.body;
    const markedBy = req.user.id;

    // Vérifier que l'utilisateur est inscrit à l'activité
    const registration = await query(
      'SELECT id FROM activity_registrations WHERE user_id = ? AND activity_id = ?',
      [userId, activityId]
    );

    if (registration.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'L\'utilisateur n\'est pas inscrit à cette activité'
      });
    }

    // Vérifier si la présence est déjà marquée
    const existingAttendance = await query(
      'SELECT id FROM attendance WHERE user_id = ? AND activity_id = ?',
      [userId, activityId]
    );

    let result;
    if (existingAttendance.length > 0) {
      // Mettre à jour la présence existante
      result = await query(
        'UPDATE attendance SET status = ?, check_in_time = ?, notes = ?, marked_by = ? WHERE user_id = ? AND activity_id = ?',
        [status, status === 'present' ? new Date() : null, notes, markedBy, userId, activityId]
      );
    } else {
      // Créer une nouvelle entrée de présence
      result = await query(
        'INSERT INTO attendance (user_id, activity_id, status, check_in_time, notes, marked_by) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, activityId, status, status === 'present' ? new Date() : null, notes, markedBy]
      );
    }

    res.json({
      success: true,
      message: 'Présence marquée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du marquage de la présence:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage de la présence'
    });
  }
});

// @route   POST /api/attendance/bulk-mark
// @desc    Marquer la présence de plusieurs utilisateurs
// @access  Private (Executive/Admin)
router.post('/bulk-mark', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { activityId, attendanceData } = req.body;
    const markedBy = req.user.id;

    if (!Array.isArray(attendanceData)) {
      return res.status(400).json({
        success: false,
        message: 'Les données de présence doivent être un tableau'
      });
    }

    const results = [];
    const errors = [];

    for (const data of attendanceData) {
      try {
        const { userId, status, notes } = data;

        // Vérifier que l'utilisateur est inscrit à l'activité
        const registration = await query(
          'SELECT id FROM activity_registrations WHERE user_id = ? AND activity_id = ?',
          [userId, activityId]
        );

        if (registration.length === 0) {
          errors.push({
            userId,
            error: 'L\'utilisateur n\'est pas inscrit à cette activité'
          });
          continue;
        }

        // Vérifier si la présence est déjà marquée
        const existingAttendance = await query(
          'SELECT id FROM attendance WHERE user_id = ? AND activity_id = ?',
          [userId, activityId]
        );

        if (existingAttendance.length > 0) {
          // Mettre à jour la présence existante
          await query(
            'UPDATE attendance SET status = ?, check_in_time = ?, notes = ?, marked_by = ? WHERE user_id = ? AND activity_id = ?',
            [status, status === 'present' ? new Date() : null, notes, markedBy, userId, activityId]
          );
        } else {
          // Créer une nouvelle entrée de présence
          await query(
            'INSERT INTO attendance (user_id, activity_id, status, check_in_time, notes, marked_by) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, activityId, status, status === 'present' ? new Date() : null, notes, markedBy]
          );
        }

        results.push({ userId, status: 'success' });
      } catch (error) {
        errors.push({
          userId: data.userId,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Présence marquée pour ${results.length} utilisateur(s)`,
      data: {
        successful: results,
        errors
      }
    });
  } catch (error) {
    console.error('Erreur lors du marquage en lot de la présence:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage en lot de la présence'
    });
  }
});

// @route   GET /api/attendance/user/:userId
// @desc    Obtenir l'historique de présence d'un utilisateur
// @access  Private (Executive/Admin ou utilisateur lui-même)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    // Vérifier les permissions
    if (parseInt(userId) !== currentUserId && !['admin', 'executive'].includes(currentUserRole)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    const { page = 1, limit = 20, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE a.user_id = ?';
    let params = [userId];

    if (startDate) {
      whereClause += ' AND act.start_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      whereClause += ' AND act.start_date <= ?';
      params.push(endDate);
    }

    // Compter le total
    const countResult = await query(
      `SELECT COUNT(*) as total 
       FROM attendance a
       JOIN activities act ON a.activity_id = act.id
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Récupérer l'historique de présence
    const attendanceHistory = await query(
      `SELECT 
        a.id, a.status, a.check_in_time, a.notes, a.created_at,
        act.id as activity_id, act.title as activity_title, act.start_date, act.end_date, act.type,
        marker.first_name as marked_by_first_name, marker.last_name as marked_by_last_name
       FROM attendance a
       JOIN activities act ON a.activity_id = act.id
       LEFT JOIN users marker ON a.marked_by = marker.id
       ${whereClause}
       ORDER BY act.start_date DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // Calculer les statistiques
    const stats = await query(
      `SELECT 
        COUNT(*) as total_activities,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_count,
        SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late_count,
        SUM(CASE WHEN a.status = 'excused' THEN 1 ELSE 0 END) as excused_count
       FROM attendance a
       JOIN activities act ON a.activity_id = act.id
       WHERE a.user_id = ?`,
      [userId]
    );

    const attendanceRate = stats[0].total_activities > 0 
      ? (stats[0].present_count / stats[0].total_activities) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        history: attendanceHistory.map(record => ({
          id: record.id,
          status: record.status,
          checkInTime: record.check_in_time,
          notes: record.notes,
          createdAt: record.created_at,
          activity: {
            id: record.activity_id,
            title: record.activity_title,
            startDate: record.start_date,
            endDate: record.end_date,
            type: record.type
          },
          markedBy: record.marked_by_first_name ? {
            firstName: record.marked_by_first_name,
            lastName: record.marked_by_last_name
          } : null
        })),
        statistics: {
          totalActivities: stats[0].total_activities,
          presentCount: stats[0].present_count,
          absentCount: stats[0].absent_count,
          lateCount: stats[0].late_count,
          excusedCount: stats[0].excused_count,
          attendanceRate: Math.round(attendanceRate * 100) / 100
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique de présence:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique de présence'
    });
  }
});

// @route   GET /api/attendance/stats/overview
// @desc    Obtenir les statistiques globales de présence
// @access  Private (Executive/Admin)
router.get('/stats/overview', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (startDate) {
      whereClause += ' AND act.start_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      whereClause += ' AND act.start_date <= ?';
      params.push(endDate);
    }

    // Statistiques globales
    const globalStats = await query(
      `SELECT 
        COUNT(DISTINCT a.activity_id) as total_activities,
        COUNT(DISTINCT a.user_id) as total_participants,
        COUNT(*) as total_attendance_records,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_count,
        SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late_count,
        SUM(CASE WHEN a.status = 'excused' THEN 1 ELSE 0 END) as excused_count
       FROM attendance a
       JOIN activities act ON a.activity_id = act.id
       ${whereClause}`,
      params
    );

    // Top participants
    const topParticipants = await query(
      `SELECT 
        u.id, u.first_name, u.last_name,
        COUNT(*) as total_attendance,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
        ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as attendance_rate
       FROM attendance a
       JOIN users u ON a.user_id = u.id
       JOIN activities act ON a.activity_id = act.id
       ${whereClause}
       GROUP BY u.id, u.first_name, u.last_name
       HAVING total_attendance > 0
       ORDER BY attendance_rate DESC, present_count DESC
       LIMIT 10`,
      params
    );

    // Activités les plus populaires
    const popularActivities = await query(
      `SELECT 
        act.id, act.title, act.start_date, act.type,
        COUNT(a.user_id) as total_participants,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
        ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(a.user_id)) * 100, 2) as attendance_rate
       FROM activities act
       LEFT JOIN attendance a ON act.id = a.activity_id
       ${whereClause.replace('a.', 'act.')}
       GROUP BY act.id, act.title, act.start_date, act.type
       HAVING total_participants > 0
       ORDER BY attendance_rate DESC, present_count DESC
       LIMIT 10`,
      params
    );

    const stats = globalStats[0];
    const totalAttendance = stats.total_attendance_records;
    const overallAttendanceRate = totalAttendance > 0 
      ? (stats.present_count / totalAttendance) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalActivities: stats.total_activities,
          totalParticipants: stats.total_participants,
          totalAttendanceRecords: stats.total_attendance_records,
          presentCount: stats.present_count,
          absentCount: stats.absent_count,
          lateCount: stats.late_count,
          excusedCount: stats.excused_count,
          overallAttendanceRate: Math.round(overallAttendanceRate * 100) / 100
        },
        topParticipants: topParticipants.map(p => ({
          id: p.id,
          firstName: p.first_name,
          lastName: p.last_name,
          totalAttendance: p.total_attendance,
          presentCount: p.present_count,
          attendanceRate: p.attendance_rate
        })),
        popularActivities: popularActivities.map(a => ({
          id: a.id,
          title: a.title,
          startDate: a.start_date,
          type: a.type,
          totalParticipants: a.total_participants,
          presentCount: a.present_count,
          attendanceRate: a.attendance_rate
        }))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de présence:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques de présence'
    });
  }
});

export default router;
