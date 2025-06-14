import { config } from 'dotenv';
import { Pool } from 'pg';

config();

const pool = new Pool({
  user: process.env.DB_USER,         
  password: process.env.DB_PASS,     
  database: process.env.DB_NAME,     
  host: process.env.DB_HOST,         
  port: process.env.DB_PORT,         
});

export default pool;
