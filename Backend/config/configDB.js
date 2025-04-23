import { config } from 'dotenv';
import { Pool } from 'pg';

config();

const pool = new Pool({
  user: process.env.DB_USER,         // Nombre de usuario
  password: process.env.DB_PASS,     // Contraseña
  database: process.env.DB_NAME,     // Nombre de la base de datos
  host: process.env.DB_HOST,         // Dirección del servidor (por ejemplo, localhost)
  port: process.env.DB_PORT,         // Puerto (por defecto 5432)
});

export default pool;
