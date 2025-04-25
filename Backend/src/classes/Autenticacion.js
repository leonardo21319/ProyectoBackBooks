import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../config/configDB.js';

dotenv.config();

class Autenticacion {
  static generarToken(usuario) {
    const payload = {
      id: usuario.id,
      correo: usuario.correo_institucional,
      rol: usuario.rol
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
  }

  static async verificarToken(token) {
    const resultado = await pool.query('SELECT * FROM token_blacklist WHERE token = $1', [token]);
    if (resultado.rows.length > 0) {
      throw new Error('Token invalidado');
    }

    return jwt.verify(token, process.env.SECRET_KEY);
  }

  static async invalidarToken(token) {
    const decoded = jwt.decode(token);
    const fechaExp = new Date(decoded.exp * 1000); // timestamp UNIX a fecha JS

    await pool.query(
      'INSERT INTO token_blacklist (token, fecha_expiracion) VALUES ($1, $2)',
      [token, fechaExp]
    );
  }
}

export default Autenticacion;
