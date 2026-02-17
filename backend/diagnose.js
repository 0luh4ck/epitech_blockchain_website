import { query } from './config/database.js';
import dotenv from 'dotenv';
dotenv.config();

async function diagnose() {
    try {
        console.log('🔍 Diagnostic de la base de données...');

        // Check tables
        const tables = await query('SHOW TABLES');
        const tableList = tables.map(t => Object.values(t)[0]);
        console.log('📁 Tables présentes :', tableList.join(', '));

        // Check users
        if (tableList.includes('users')) {
            const usersCount = await query('SELECT COUNT(*) as count FROM users');
            console.log(`👤 Nombre d'utilisateurs : ${usersCount[0].count}`);

            if (usersCount[0].count > 0) {
                const adminUsers = await query('SELECT email, role, is_active FROM users WHERE role = "admin" OR role = "executive"');
                console.log('📧 Comptes spéciaux trouvés :');
                adminUsers.forEach(u => console.log(`  - ${u.email} (${u.role}, active: ${u.is_active})`));
            }
        } else {
            console.error('❌ Table USERS manquante !');
        }

        // Check activities
        if (tableList.includes('activities')) {
            const activitiesCount = await query('SELECT COUNT(*) as count FROM activities');
            console.log(`📅 Nombre d'activités : ${activitiesCount[0].count}`);

            if (activitiesCount[0].count > 0) {
                const activityDetails = await query('SELECT title, status, is_public FROM activities LIMIT 3');
                console.log('📌 Aperçu des activités :');
                activityDetails.forEach(a => console.log(`  - ${a.title} (status: ${a.status}, public: ${a.is_public})`));
            }
        } else {
            console.error('❌ Table ACTIVITIES manquante !');
        }

    } catch (error) {
        console.error('❌ Erreur diagnostic :', error.message);
    } finally {
        process.exit();
    }
}

diagnose();
