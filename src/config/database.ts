import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then((connection: any) => {
    console.log('Conectado ao banco de dados MySQL com sucesso!');
    connection.release();
  })
  .catch((err: any) => {
    console.error('Erro ao conectar no banco de dados:', err);
  });

export default pool;