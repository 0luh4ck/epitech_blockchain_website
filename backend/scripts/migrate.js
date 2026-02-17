import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, testConnection, default as pool } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.message.includes('already exists') || error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Requête ${i + 1}/${queries.length} ignorée (déjà existant)`);
        } else {
          console.error(`❌ Erreur lors de l'exécution de la requête ${i + 1}:`, error.message);
          console.error(`Query context: ${queryText.substring(0, 50)}...`);
          throw error;
        }
      }
    }

    console.log('🎉 Migration terminée avec succès !');
    console.log('📊 Base de données prête pour le Club Blockchain Epitech');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error; // Laisser le serveur gérer l'erreur au démarrage
  }
}

export default runMigration;
