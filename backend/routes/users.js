import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin, requireExecutive } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Obtenir la liste des utilisateurs (admin/executive seulement)
// @access  Private (Admin/Executive)
router.get('/', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    // Filtrer par rôle
    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    // Recherche par nom ou email
    if (search) {
      whereClause += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Compter le total
    const countResult = await query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Récupérer les utilisateurs
    const users = await query(
      `SELECT id, email, first_name, last_name, phone, student_id, role, position, is_active, is_verified, last_login, created_at 
       FROM users ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          studentId: user.student_id,
          role: user.role,
          position: user.position,
          isActive: user.is_active,
          isVerified: user.is_verified,
          lastLogin: user.last_login,
          createdAt: user.created_at
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
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
});

// @route   GET /api/users/executive-board
// @desc    Obtenir les membres du bureau exécutif
// @access  Public
router.get('/executive-board', async (req, res) => {
  try {
    const executives = await query(
      `SELECT id, first_name, last_name, position, bio, avatar, role
       FROM users 
       WHERE role IN ('admin', 'executive') AND is_active = true
       ORDER BY 
         CASE role 
           WHEN 'admin' THEN 1 
           WHEN 'executive' THEN 2 
         END,
         position ASC`
    );

    res.json({
      success: true,
      data: {
        executives: executives.map(exec => ({
          id: exec.id,
          firstName: exec.first_name,
          lastName: exec.last_name,
          position: exec.position,
          bio: exec.bio,
          avatar: exec.avatar,
          role: exec.role
        }))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du bureau exécutif:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du bureau exécutif'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Obtenir un utilisateur par ID
// @access  Private (Admin/Executive ou utilisateur lui-même)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Vérifier les permissions
    if (parseInt(id) !== userId && !['admin', 'executive'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    const users = await query(
      'SELECT id, email, first_name, last_name, phone, student_id, role, position, bio, avatar, is_active, is_verified, last_login, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const user = users[0];
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          studentId: user.student_id,
          role: user.role,
          position: user.position,
          bio: user.bio,
          avatar: user.avatar,
          isActive: user.is_active,
          isVerified: user.is_verified,
          lastLogin: user.last_login,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Mettre à jour un utilisateur
// @access  Private (Admin/Executive ou utilisateur lui-même)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { firstName, lastName, phone, bio, position, role, isActive } = req.body;

    // Vérifier les permissions
    if (parseInt(id) !== userId && !['admin', 'executive'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    // Seuls les admins peuvent modifier le rôle et le statut actif
    const canModifyRole = userRole === 'admin';
    const canModifyStatus = userRole === 'admin';

    let updateFields = [];
    let params = [];

    if (firstName) {
      updateFields.push('first_name = ?');
      params.push(firstName);
    }
    if (lastName) {
      updateFields.push('last_name = ?');
      params.push(lastName);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      params.push(phone);
    }
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      params.push(bio);
    }
    if (position && canModifyRole) {
      updateFields.push('position = ?');
      params.push(position);
    }
    if (role && canModifyRole) {
      updateFields.push('role = ?');
      params.push(role);
    }
    if (isActive !== undefined && canModifyStatus) {
      updateFields.push('is_active = ?');
      params.push(isActive);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }

    updateFields.push('updated_at = NOW()');
    params.push(id);

    await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    // Récupérer les données mises à jour
    const updatedUsers = await query(
      'SELECT id, email, first_name, last_name, phone, student_id, role, position, bio, avatar, is_active, is_verified, last_login, created_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: {
        user: {
          id: updatedUsers[0].id,
          email: updatedUsers[0].email,
          firstName: updatedUsers[0].first_name,
          lastName: updatedUsers[0].last_name,
          phone: updatedUsers[0].phone,
          studentId: updatedUsers[0].student_id,
          role: updatedUsers[0].role,
          position: updatedUsers[0].position,
          bio: updatedUsers[0].bio,
          avatar: updatedUsers[0].avatar,
          isActive: updatedUsers[0].is_active,
          isVerified: updatedUsers[0].is_verified,
          lastLogin: updatedUsers[0].last_login,
          createdAt: updatedUsers[0].created_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'utilisateur'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Désactiver un utilisateur (soft delete)
// @access  Private (Admin seulement)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur existe
    const users = await query('SELECT id FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Désactiver l'utilisateur
    await query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Utilisateur désactivé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la désactivation de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la désactivation de l\'utilisateur'
    });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Obtenir les statistiques des utilisateurs
// @access  Private (Admin/Executive)
router.get('/stats/overview', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
        SUM(CASE WHEN role = 'executive' THEN 1 ELSE 0 END) as executives,
        SUM(CASE WHEN role = 'member' THEN 1 ELSE 0 END) as members,
        SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN is_verified = true THEN 1 ELSE 0 END) as verified_users,
        SUM(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as active_last_month
      FROM users
    `);

    const monthlyRegistrations = await query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    res.json({
      success: true,
      data: {
        overview: stats[0],
        monthlyRegistrations
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
