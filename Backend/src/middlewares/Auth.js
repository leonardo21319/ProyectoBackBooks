import Autenticacion from "../classes/Autenticacion";
import {has as  isBlacklisted } from "../config/configBlackList.js";

const VerificarUsuario = async (req, res) => {   

    const auth  = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  if (isBlacklisted(token)) {
    return res.status(401).json({ error: 'Token revocado' });
  }

  try {
    req.user = Autenticacion.verificarToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export default VerificarUsuario;