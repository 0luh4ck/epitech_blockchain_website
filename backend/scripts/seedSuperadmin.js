import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

const SUPERADMIN_EMAIL = 'epiblockchain@epitech.eu';
const SUPERADMIN_PASSWORD = '12345678';

/**
 * Crée / réinitialise le compte Superadmin juste après la migration
 * (équivalent du hook post sequelize.sync()).
 * Rôle ENUM BDD : 'admin' | 'member' | 'executive' -> on utilise 'admin'.
 * La table `users` n'a pas de colonne `status` (elle est sur membership_requests),
 * on utilise donc is_active / is_verified.
 */
export async function seedSuperadmin() {
  try {
    const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);

    const existing = await query('SELECT id, role FROM users WHERE email = ?', [SUPERADMIN_EMAIL]);

    if (existing.length === 0) {
      await query(
        `INSERT INTO users
          (email, password, first_name, last_name, role, position, is_active, is_verified, must_change_password)
         VALUES (?, ?, 'Superadmin', 'Club Blockchain', 'admin', 'Superadmin System', true, true, true)`,
        [SUPERADMIN_EMAIL, hashedPassword]
      );
    } else {
      await query(
        `UPDATE users
         SET password = ?, role = 'admin', position = 'Superadmin System',
             is_active = true, is_verified = true, must_change_password = true,
             updated_at = NOW()
         WHERE email = ?`,
        [hashedPassword, SUPERADMIN_EMAIL]
      );
    }

    console.log('✅ Compte Superadmin initialisé/vérifié avec succès');
    return true;
  } catch (error) {
    console.error('❌ Échec seed Superadmin:', error.message);
    throw error;
  }
}

export default seedSuperadmin;
