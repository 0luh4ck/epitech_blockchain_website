import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST,
  //port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  // Removed invalid options: timeout, reconnect
};

// Créer le pool de connexions
const pool = mysql.createPool(dbConfig);

// Test de connexion
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion à la base de données réussie');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    return false;
  }
};

// Fonction pour exécuter des requêtes
export const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Erreur SQL:', error.message);
    throw error;
  }
};

// Fonction pour les transactions
export const transaction = async (callback) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export default pool;
