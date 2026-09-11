import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin, requireExecutive } from '../middleware/auth.js';
import { generateTemporaryPassword, sendApprovalEmail } from '../services/emailService.js';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lister les membres (Bureau, hors comptes anonymisés)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: 'Liste des membres', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       403: { description: 'Bureau requis', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 * /api/users/executive-board:
 *   get:
 *     summary: Bureau exécutif (public)
 *     tags: [Users]
 *     responses:
 *       200: { description: 'Membres du bureau', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 * /api/users/{id}:
 *   get:
 *     summary: Détail d'un membre (authentifié)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: 'Membre', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       404: { description: 'Membre introuvable', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *   put:
 *     summary: Modifier un membre (authentifié)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object } } }
 *     responses:
 *       200: { description: 'Membre mis à jour', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *   delete:
 *     summary: Supprimer un membre (Admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: 'Membre supprimé', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       403: { description: 'Admin requis', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 * /api/users/stats/overview:
 *   get:
 *     summary: Statistiques des membres (Bureau)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: 'Statistiques', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       403: { description: 'Bureau requis', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un membre manuellement (Admin)
 *     description: "Réponse 201 immédiate (< 200ms) avec tempPassword ; l'email d'invitation part en arrière-plan non-bloquant (inviteQueued). Clés camelCase ou snake_case ; alias 'bureau' → 'executive'."
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, firstName, lastName]
 *             properties:
 *               email: { type: string, format: email, example: 'nouveau@epitech.eu' }
 *               firstName: { type: string, example: 'Ada' }
 *               lastName: { type: string, example: 'Lovelace' }
 *               role: { type: string, enum: [member, executive, admin], default: member }
 *               status: { type: string, enum: [active, pending], default: active, description: 'pending = compte non vérifié' }
 *               sendInvite: { type: boolean, default: false }
 *     responses:
 *       201: { description: 'Compte créé (data.user + data.tempPassword)', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       400: { description: 'Champs invalides / email déjà utilisé', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       403: { description: 'Admin requis', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       500: { description: 'Erreur serveur', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 */
// @route   POST /api/users
// @desc    Créer un membre manuellement (mot de passe temporaire + invitation optionnelle)
// @access  Private (Admin seulement)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Contrat DTO tolérant : accepte camelCase (frontend) ET snake_case (scripts),
    // + alias historique 'bureau' → 'executive' (ENUM BDD : admin/member/executive).
    // Le mot de passe est TOUJOURS généré côté serveur (jamais exigé du formulaire).
    const body = req.body || {};
    console.log('👤 [users] création manuelle, clés reçues:', Object.keys(body));
    const email = String(body.email || '').trim().toLowerCase();
    const firstName = String(body.firstName ?? body.first_name ?? '').trim();
    const lastName = String(body.lastName ?? body.last_name ?? '').trim();
    let role = String(body.role || 'member').trim().toLowerCase();
    const status = String(body.status || 'active').trim().toLowerCase();
    const sendInvite = !!body.sendInvite;
    console.log('👤 [users] création manuelle :', { email, role, status, sendInvite });
    if (role === 'bureau') role = 'executive';

    const errors = [];
    if (!email) errors.push('email requis');
    if (!firstName) errors.push('firstName (ou first_name) requis');
    if (!lastName) errors.push('lastName (ou last_name) requis');
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Email, prénom et nom sont requis',
        errors
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_EMAIL',
        message: 'Format d\'email invalide',
        errors: [`email invalide : "${email}"`]
      });
    }
    if (!['member', 'executive', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_ROLE',
        message: 'Rôle invalide (member, executive, admin — alias accepté : bureau)',
        errors: [`role reçu : "${body.role}"`]
      });
    }
    if (!['active', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_STATUS',
        message: 'Statut invalide (active, pending)',
        errors: [`status reçu : "${body.status}"`]
      });
    }

    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        code: 'EMAIL_TAKEN',
        message: 'Un compte existe déjà pour cet email'
      });
    }

    const tempPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const isVerified = status === 'active';

    const result = await query(
      `INSERT INTO users
        (email, password, first_name, last_name, role, is_active, is_verified, must_change_password)
       VALUES (?, ?, ?, ?, ?, true, ?, true)`,
      [email, hashedPassword, firstName, lastName, role, isVerified]
    );

    // Réponse ULTRA-RAPIDE (< 200ms) : l'email part en arrière-plan APRES
    // la réponse HTTP, via setImmediate non attendu (jamais de blocage/timeout,
    // même si le SMTP rame ou le réseau est instable).
    console.log(`✅ [users] compte créé id=${result.insertId} (${email})`);
    res.status(201).json({
      success: true,
      message: 'Profil créé avec succès. Transmettez le mot de passe temporaire.',
      data: {
        user: {
          id: result.insertId,
          email,
          firstName,
          lastName,
          role,
          isActive: true,
          isVerified,
          mustChangePassword: true
        },
        tempPassword,
        inviteQueued: !!sendInvite
      }
    });

    if (sendInvite) {
      setImmediate(() => {
        sendApprovalEmail({ email, firstName, lastName, tempPassword })
          .then((info) => console.log(
            `✉️ [users] invitation arrière-plan envoyée à ${email}:`,
            info?.simulated ? '(simulation SMTP)' : (info?.messageId || info)
          ))
          .catch((mailError) => console.error(
            `⚠️ [users] échec invitation arrière-plan pour ${email}:`,
            mailError.message
          ));
      });
    }
  } catch (error) {
    console.error('Erreur lors de la création du membre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du membre'
    });
  }
});

// @route   GET /api/users
// @desc    Obtenir la liste des utilisateurs (admin/executive seulement)
// @access  Private (Admin/Executive)
router.get('/', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, includeAnonymized } = req.query;
    const offset = (page - 1) * limit;

    // Les comptes anonymisés/archivés sont exclus par défaut ;
    // includeAnonymized=true les réinclut (écran de réactivation admin).
    let whereClause =
      includeAnonymized === 'true'
        ? 'WHERE 1=1'
        : 'WHERE (is_anonymized IS NULL OR is_anonymized = FALSE)';
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
      `SELECT id, email, first_name, last_name, phone, student_id, role, position, is_active, is_verified, is_anonymized, last_login, created_at
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
          isAnonymized: !!user.is_anonymized,
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
         AND (is_anonymized IS NULL OR is_anonymized = FALSE)
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

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Anonymiser un compte (soft delete, JAMAIS de DELETE physique)
 *     description: "Passe is_anonymized=TRUE / is_active=FALSE et archive les PII (email fictif unique, mot de passe inexploitable). Le compte disparaît des listes et statistiques. Le Superadmin est protégé (403)."
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: 'Compte anonymisé', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       403: { description: 'Admin requis / compte Superadmin protégé', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       404: { description: 'Utilisateur non trouvé', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       500: { description: 'Erreur serveur', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 * /api/users/{id}/reactivate:
 *   patch:
 *     summary: Réactiver un compte anonymisé (nouveau mot de passe temporaire)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: 'membre@epitech.eu' }
 *               firstName: { type: string, example: 'Ada' }
 *               lastName: { type: string, example: 'Lovelace' }
 *     responses:
 *       200: { description: 'Compte réactivé (data.user + data.tempPassword)', content: { application/json: { schema: { $ref: '#/components/schemas/ApiSuccess' } } } }
 *       400: { description: 'Email manquant/invalide/déjà utilisé ou compte non anonymisé', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       401: { description: 'Non authentifié', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       403: { description: 'Admin requis', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       404: { description: 'Utilisateur non trouvé', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 *       500: { description: 'Erreur serveur', content: { application/json: { schema: { $ref: '#/components/schemas/ApiError' } } } }
 */
// @route   DELETE /api/users/:id
// @desc    Anonymiser un compte (soft delete — aucun DELETE physique)
// @access  Private (Admin seulement)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur existe
    const users = await query('SELECT id, email FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'Utilisateur non trouvé'
      });
    }

    // Garde-fou : le Superadmin ne peut jamais être anonymisé
    if (users[0].email === 'epiblockchain@epitech.eu') {
      console.log(`⛔ [users] tentative d'anonymisation du Superadmin (id=${id}) refusée`);
      return res.status(403).json({
        success: false,
        code: 'SUPERADMIN_PROTECTED',
        message: 'Le compte Superadmin ne peut pas être anonymisé'
      });
    }

    // Soft delete : anonymisation dynamique (ID conservé, PII archivées)
    await query(
      `UPDATE users SET
        first_name = 'Anonyme',
        last_name = CONCAT('User_', id),
        email = CONCAT('archived_user_', id, '@deleted.local'),
        phone = NULL,
        student_id = NULL,
        bio = NULL,
        avatar = NULL,
        verification_token = NULL,
        reset_password_token = NULL,
        reset_password_expires = NULL,
        password = CONCAT('$UNUSABLE$', SHA2(CONCAT(UUID(), id, RAND()), 256)),
        is_active = FALSE,
        is_verified = FALSE,
        must_change_password = FALSE,
        is_anonymized = TRUE,
        updated_at = NOW()
       WHERE id = ?`,
      [id]
    );

    console.log(`🗃️ [users] compte id=${id} anonymisé (soft delete)`);
    res.json({
      success: true,
      code: 'ANONYMIZED',
      message: 'Compte anonymisé avec succès. Il est exclu des listes et statistiques.'
    });
  } catch (error) {
    console.error('Erreur lors de l\'anonymisation de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'anonymisation de l\'utilisateur'
    });
  }
});

// @route   PATCH /api/users/:id/reactivate
// @desc    Réactiver un compte anonymisé (nouvelle identité + mot de passe temporaire)
// @access  Private (Admin seulement)
router.patch('/:id/reactivate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName } = req.body || {};
    console.log('♻️ [users] réactivation demandée :', { id, email });

    const rows = await query(
      'SELECT id, email, is_anonymized FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'Utilisateur non trouvé'
      });
    }
    if (!rows[0].is_anonymized) {
      return res.status(400).json({
        success: false,
        code: 'NOT_ANONYMIZED',
        message: 'Ce compte n\'est pas anonymisé, réactivation inutile'
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        code: 'EMAIL_REQUIRED',
        message: 'Un email valide doit être réassigné lors de la réactivation'
      });
    }
    const taken = await query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );
    if (taken.length > 0) {
      return res.status(400).json({
        success: false,
        code: 'EMAIL_TAKEN',
        message: 'Cet email est déjà utilisé par un autre compte'
      });
    }

    const tempPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await query(
      `UPDATE users SET
        email = ?, first_name = ?, last_name = ?,
        password = ?, is_active = TRUE, is_verified = TRUE,
        must_change_password = TRUE, is_anonymized = FALSE,
        updated_at = NOW()
       WHERE id = ?`,
      [
        email,
        (firstName || '').trim() || 'Membre',
        (lastName || '').trim() || `User_${id}`,
        hashedPassword,
        id
      ]
    );

    console.log(`✅ [users] compte id=${id} réactivé (${email})`);
    res.json({
      success: true,
      message: 'Compte réactivé avec succès. Transmettez le mot de passe temporaire.',
      data: {
        user: {
          id: Number(id),
          email,
          firstName: (firstName || '').trim() || 'Membre',
          lastName: (lastName || '').trim() || `User_${id}`,
          isActive: true,
          isVerified: true,
          isAnonymized: false,
          mustChangePassword: true
        },
        tempPassword
      }
    });
  } catch (error) {
    console.error('Erreur lors de la réactivation du compte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réactivation du compte'
    });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Obtenir les statistiques des utilisateurs
// @access  Private (Admin/Executive)
router.get('/stats/overview', authenticateToken, requireExecutive, async (req, res) => {
  try {
    // Toutes les agrégations excluent les comptes anonymisés/archivés
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
      WHERE (is_anonymized IS NULL OR is_anonymized = FALSE)
    `);

    const monthlyRegistrations = await query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        AND (is_anonymized IS NULL OR is_anonymized = FALSE)
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
