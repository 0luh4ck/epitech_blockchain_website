import { query } from './backend/config/database.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

async function diagnose() {
    try {
        console.log('🔍 Diagnostic de la base de données...');

        const tables = await query('SHOW TABLES');
        console.log('📁 Tables présentes :', tables.map(t => Object.values(t)[0]).join(', '));

        const usersCount = await query('SELECT COUNT(*) as count FROM users');
        console.log(`👤 Nombre d'utilisateurs : ${usersCount[0].count}`);

        if (usersCount[0].count > 0) {
            const firstUser = await query('SELECT email, role FROM users LIMIT 1');
            console.log(`📧 Premier utilisateur : ${firstUser[0].email} (${firstUser[0].role})`);
        }

        const activitiesCount = await query('SELECT COUNT(*) as count FROM activities');
        console.log(`📅 Nombre d'activités : ${activitiesCount[0].count}`);

        if (activitiesCount[0].count > 0) {
            const firstActivity = await query('SELECT title FROM activities LIMIT 1');
            console.log(`📌 Première activité : ${firstActivity[0].title}`);
        }

    } catch (error) {
        console.error('❌ Erreur diagnostic :', error.message);
    } finally {
        process.exit();
    }
}

diagnose();
