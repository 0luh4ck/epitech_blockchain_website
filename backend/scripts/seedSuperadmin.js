import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

export const SUPERADMIN_EMAIL = 'epiblockchain@epitech.eu';
export const SUPERADMIN_INITIAL_PASSWORD = '12345678';

/**
 * Décision pure (testable) pour un seed NON-DESTRUCTIF.
 * - absent            -> 'insert'      : crée le compte (hash frais de 12345678, flag true)
 * - présent + flag true  -> 'reset'   : re-hash 12345678 + rôle/flags (garantit la
 *   validité du mot de passe initial ; corrige un hash obsolète/inconnu)
 * - présent + flag false -> 'ensure-only' : rôle/actif/vérifié UNIQUEMENT, le mot de
 *   passe déjà personnalisé N'EST JAMAIS touché (évite de casser le compte à
 *   chaque redémarrage Render).
 */
export function decideSeedAction(existing) {
  if (!existing) return 'insert';
  const mustChange = existing.must_change_password === true ||
    existing.must_change_password === 1;
  return mustChange ? 'reset' : 'ensure-only';
}

/**
 * Crée / réinitialise le compte Superadmin juste après la migration
 * (équivalent du hook post sequelize.sync()).
 * Rôle ENUM BDD : 'admin' | 'member' | 'executive' -> on utilise 'admin'.
 * La table `users` n'a pas de colonne `status` (elle est sur membership_requests),
 * on utilise donc is_active / is_verified.
 */
export async function seedSuperadmin() {
  try {
    const rows = await query(
      'SELECT id, role, must_change_password FROM users WHERE email = ?',
      [SUPERADMIN_EMAIL]
    );
    const action = decideSeedAction(rows[0] || null);
    console.log(`🔧 [seed-superadmin] ${SUPERADMIN_EMAIL} -> action: ${action}`);

    if (action === 'insert') {
      const hashedPassword = await bcrypt.hash(SUPERADMIN_INITIAL_PASSWORD, 10);
      await query(
        `INSERT INTO users
          (email, password, first_name, last_name, role, position, is_active, is_verified, must_change_password)
         VALUES (?, ?, 'Superadmin', 'Club Blockchain', 'admin', 'Superadmin System', true, true, true)`,
        [SUPERADMIN_EMAIL, hashedPassword]
      );
    } else if (action === 'reset') {
      // Premier accès (ou hash corrompu) : on garantit que '12345678' est valide
      const hashedPassword = await bcrypt.hash(SUPERADMIN_INITIAL_PASSWORD, 10);
      await query(
        `UPDATE users
         SET password = ?, role = 'admin', position = 'Superadmin System',
             is_active = true, is_verified = true, must_change_password = true,
             updated_at = NOW()
         WHERE email = ?`,
        [hashedPassword, SUPERADMIN_EMAIL]
      );
    } else {
      // Mot de passe déjà personnalisé : on ne touche JAMAIS au hash
      await query(
        `UPDATE users
         SET role = 'admin', is_active = true, is_verified = true, updated_at = NOW()
         WHERE email = ?`,
        [SUPERADMIN_EMAIL]
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
