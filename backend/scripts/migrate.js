import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, testConnection, default as pool } from '../config/database.js';
import { seedSuperadmin } from './seedSuperadmin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colonnes de `users` lues/écrites par le code (auth + seed) qui peuvent
// manquer sur une BDD créée par un ancien schéma. On les garantit via
// information_schema (portable MySQL / TiDB / PlanetScale) AVANT le seed,
// au lieu d'un `ADD COLUMN IF NOT EXISTS` non supporté par MySQL 8.0.
export const REQUIRED_USER_COLUMNS = [
  { name: 'phone', definition: 'VARCHAR(20)' },
  { name: 'student_id', definition: 'VARCHAR(50)' },
  { name: 'position', definition: 'VARCHAR(100)' },
  { name: 'bio', definition: 'TEXT' },
  { name: 'avatar', definition: 'VARCHAR(255)' },
  { name: 'is_verified', definition: 'BOOLEAN DEFAULT false' },
  { name: 'verification_token', definition: 'VARCHAR(255)' },
  { name: 'reset_password_token', definition: 'VARCHAR(255)' },
  { name: 'reset_password_expires', definition: 'DATETIME' },
  { name: 'last_login', definition: 'DATETIME' },
  { name: 'must_change_password', definition: 'BOOLEAN DEFAULT false' },
];

// Fonction pure (testable) : colonnes requises absentes de la table.
export function findMissingColumns(existingNames) {
  const existing = new Set((existingNames || []).map((n) => String(n).toLowerCase()));
  return REQUIRED_USER_COLUMNS.filter((col) => !existing.has(col.name.toLowerCase()));
}

// Étape de migration sécurisée : ajoute uniquement les colonnes manquantes.
export async function ensureUserColumns() {
  const rows = await query(
    `SELECT COLUMN_NAME AS name FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'`
  );
  const missing = findMissingColumns(rows.map((r) => r.name ?? r.COLUMN_NAME));

  if (missing.length === 0) {
    console.log('✅ Table users : toutes les colonnes requises sont présentes');
    return;
  }

  for (const col of missing) {
    console.log(`🔧 Colonne manquante détectée : users.${col.name} → ALTER TABLE...`);
    await pool.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.definition}`);
    console.log(`✅ Colonne users.${col.name} ajoutée`);
  }
}

async function runMigration() {
  try {
    console.log('🚀 Démarrage de la migration de la base de données...');

    // Tester la connexion
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }

    // Lire le fichier SQL
    const sqlFile = path.join(__dirname, 'database-schema.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    // Fonction pour découper proprement le SQL en requêtes
    const splitQueries = (content) => {
      const result = [];
      let current = '';
      const lines = content.split('\n');

      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('--')) continue; // Ignorer les lignes vides et commentaires

        current += ' ' + line;

        if (line.endsWith(';')) {
          result.push(current.trim());
          current = '';
        }
      }
      return result;
    };

    const queries = splitQueries(sqlContent);
    console.log(`📝 Exécution de ${queries.length} requêtes...`);

    // Exécuter chaque requête
    for (let i = 0; i < queries.length; i++) {
      const queryText = queries[i];
      try {
        await pool.query(queryText);
        console.log(`✅ Requête ${i + 1}/${queries.length} exécutée avec succès`);
      } catch (error) {
        // Ignorer les erreurs de création si déjà existant
        if (
          error.code === 'ER_TABLE_EXISTS_ERROR' ||
          error.code === 'ER_DUP_KEYNAME' ||
          error.errno === 1061 ||
          error.message.includes('already exists') ||
          error.code === 'ER_DUP_ENTRY'
        ) {
          console.log(`⚠️  Requête ${i + 1}/${queries.length} ignorée (déjà existant)`);
        } else {
          console.error(`❌ Erreur lors de l'exécution de la requête ${i + 1}:`, error.message);
          console.error(`Query context: ${queryText.substring(0, 50)}...`);
          throw error;
        }
      }
    }

    // Migration sécurisée : garantir les colonnes de `users` sur un schéma
    // existant AVANT tout INSERT/UPDATE qui les référence.
    await ensureUserColumns();

    // Seed du compte Superadmin TOUJOURS en toute fin de migration,
    // une fois l'intégralité de la structure vérifiée et mise à jour.
    await seedSuperadmin();

    console.log('🎉 Migration terminée avec succès !');
    console.log('📊 Base de données prête pour le Club Blockchain Epitech');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error; // Laisser le serveur gérer l'erreur au démarrage
  }
}

export default runMigration;
