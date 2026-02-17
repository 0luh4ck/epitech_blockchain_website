import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireExecutive } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/partners
// @desc    Obtenir la liste des partenaires
// @access  Public
router.get('/', async (req, res) => {
  try {
    const partners = await query(
      'SELECT * FROM partners WHERE is_active = true ORDER BY name ASC'
    );

    res.json({
      success: true,
      data: {
        partners: partners.map(partner => ({
          id: partner.id,
          name: partner.name,
          description: partner.description,
          website: partner.website,
          logo: partner.logo,
          contactEmail: partner.contact_email,
          contactPhone: partner.contact_phone,
          createdAt: partner.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des partenaires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des partenaires'
    });
  }
});

// @route   GET /api/partners/:id
// @desc    Obtenir un partenaire par ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const partners = await query(
      'SELECT * FROM partners WHERE id = ? AND is_active = true',
      [id]
    );

    if (partners.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partenaire non trouvé'
      });
    }

    const partner = partners[0];

    res.json({
      success: true,
      data: {
        partner: {
          id: partner.id,
          name: partner.name,
          description: partner.description,
          website: partner.website,
          logo: partner.logo,
          contactEmail: partner.contact_email,
          contactPhone: partner.contact_phone,
          createdAt: partner.created_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du partenaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du partenaire'
    });
  }
});

// @route   POST /api/partners
// @desc    Créer un nouveau partenaire
// @access  Private (Executive/Admin)
router.post('/', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const {
      name,
      description,
      website,
      logo,
      contactEmail,
      contactPhone
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Le nom et la description sont requis'
      });
    }

    const result = await query(
      `INSERT INTO partners (name, description, website, logo, contact_email, contact_phone, is_active)
       VALUES (?, ?, ?, ?, ?, ?, true)`,
      [name, description, website, logo, contactEmail, contactPhone]
    );

    // Récupérer le partenaire créé
    const newPartner = await query(
      'SELECT * FROM partners WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Partenaire créé avec succès',
      data: {
        partner: {
          id: newPartner[0].id,
          name: newPartner[0].name,
          description: newPartner[0].description,
          website: newPartner[0].website,
          logo: newPartner[0].logo,
          contactEmail: newPartner[0].contact_email,
          contactPhone: newPartner[0].contact_phone,
          isActive: newPartner[0].is_active,
          createdAt: newPartner[0].created_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du partenaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du partenaire'
    });
  }
});

// @route   PUT /api/partners/:id
// @desc    Mettre à jour un partenaire
// @access  Private (Executive/Admin)
router.put('/:id', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      website,
      logo,
      contactEmail,
      contactPhone,
      isActive
    } = req.body;

    // Vérifier que le partenaire existe
    const existingPartner = await query(
      'SELECT id FROM partners WHERE id = ?',
      [id]
    );

    if (existingPartner.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partenaire non trouvé'
      });
    }

    await query(
      `UPDATE partners SET 
       name = ?, description = ?, website = ?, logo = ?, 
       contact_email = ?, contact_phone = ?, is_active = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, description, website, logo, contactEmail, contactPhone, isActive, id]
    );

    // Récupérer le partenaire mis à jour
    const updatedPartner = await query(
      'SELECT * FROM partners WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Partenaire mis à jour avec succès',
      data: {
        partner: {
          id: updatedPartner[0].id,
          name: updatedPartner[0].name,
          description: updatedPartner[0].description,
          website: updatedPartner[0].website,
          logo: updatedPartner[0].logo,
          contactEmail: updatedPartner[0].contact_email,
          contactPhone: updatedPartner[0].contact_phone,
          isActive: updatedPartner[0].is_active,
          createdAt: updatedPartner[0].created_at,
          updatedAt: updatedPartner[0].updated_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du partenaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du partenaire'
    });
  }
});

// @route   DELETE /api/partners/:id
// @desc    Supprimer un partenaire (soft delete)
// @access  Private (Admin seulement)
router.delete('/:id', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le partenaire existe
    const existingPartner = await query(
      'SELECT id FROM partners WHERE id = ?',
      [id]
    );

    if (existingPartner.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partenaire non trouvé'
      });
    }

    // Désactiver le partenaire
    await query(
      'UPDATE partners SET is_active = false, updated_at = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Partenaire supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du partenaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du partenaire'
    });
  }
});

export default router;
