import { query } from './config/database.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    try {
        const tables = await query('SHOW TABLES');
        console.log('Tables:', tables);

        const activities = await query('SELECT COUNT(*) as count FROM activities');
        console.log('Activities count:', activities[0].count);

        const registrations = await query('SELECT COUNT(*) as count FROM activity_registrations');
        console.log('Registrations count:', registrations[0].count);

        const sample = await query('SELECT * FROM activities LIMIT 1');
        console.log('Sample activity:', sample);

    } catch (error) {
        console.error('Test Error:', error.message);
        if (error.sql) console.log('SQL:', error.sql);
    } finally {
        process.exit();
    }
}

check();
