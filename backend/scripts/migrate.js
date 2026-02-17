import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, testConnection } from '../config/database.js';

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

    // Diviser le contenu en requêtes individuelles
    const queries = sqlContent
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0 && !query.startsWith('--'));

    console.log(`📝 Exécution de ${queries.length} requêtes...`);

    // Exécuter chaque requête
    for (let i = 0; i < queries.length; i++) {
      const queryText = queries[i];
      try {
        await query(queryText);
        console.log(`✅ Requête ${i + 1}/${queries.length} exécutée avec succès`);
      } catch (error) {
        // Ignorer les erreurs de création de table si elle existe déjà
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.message.includes('already exists')) {
          console.log(`⚠️  Requête ${i + 1}/${queries.length} ignorée (table existe déjà)`);
        } else {
          console.error(`❌ Erreur lors de l'exécution de la requête ${i + 1}:`, error.message);
          throw error;
        }
      }
    }

    console.log('🎉 Migration terminée avec succès !');
    console.log('📊 Base de données prête pour le Club Blockchain Epitech');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration si ce script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export default runMigration;
