import pool from '../config/configDB.js';
import Autenticacion from "../classes/Autenticacion.js";
//import {has as  isBlacklisted } from "../config/configBlackList.js";


const VerificarUsuario = async (req, res) => {   
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    // Verificar si está en la blacklist
    const resultado = await pool.query('SELECT 1 FROM token_blacklist WHERE token = $1', [token]);
    if (resultado.rows.length > 0) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // Verificar JWT
    const decoded = Autenticacion.verificarToken(token);
    req.usuario = decoded; // Se puede usar en el controlador
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export default VerificarUsuario;