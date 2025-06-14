import { config } from "dotenv";
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.DB_SSL_CA
      ? fs.readFileSync(path.join(__dirname, process.env.DB_SSL_CA)).toString()
      : undefined,
  },
});

export default pool;
