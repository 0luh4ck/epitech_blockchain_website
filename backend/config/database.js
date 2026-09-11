import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la base de données (mysql2/promise — TiDB Cloud compatible)
// TiDB Cloud Serverless impose TLS : toute connexion non-SSL est rejetée avec
// "Connections using insecure transport are prohibited".
const isLocalHost = ['localhost', '127.0.0.1'].includes(process.env.DB_HOST);
// SSL forcé sauf en local. En prod (Render + TiDB Cloud) toujours activé,
// même si DB_SSL n'est pas défini.
const useSSL =
  process.env.DATABASE_URL
    ? true
    : process.env.DB_SSL === 'false'
      ? false
      : process.env.DB_SSL === 'true' || !isLocalHost || process.env.NODE_ENV === 'production';

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 4000, // TiDB Cloud écoute sur 4000
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: useSSL
    ? {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Support DATABASE_URL (ex: mysql://user:pass@host:4000/db) prioritaire sur Render
const pool = process.env.DATABASE_URL
  ? mysql.createPool({
      uri: process.env.DATABASE_URL,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 60000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    })
  : mysql.createPool(dbConfig);

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

// Fonction pour exécuter des requêtes (utilise pool.query pour une meilleure compatibilité)
export const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Erreur SQL:', error.message);
    throw error;
  }
};

// Fonction pour exécuter des requêtes préparées si nécessaire
export const execute = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Erreur SQL (execute):', error.message);
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
