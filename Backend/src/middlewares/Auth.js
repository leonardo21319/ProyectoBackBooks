import pool from "../config/configDB.js";
import Autenticacion from "../classes/Autenticacion.js";
// Middleware para verificar el usuario autenticado
const VerificarUsuario = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1] || req.body.token;

  if (!token) {
    return res.status(401).json({
      error: "Token no proporcionado",
      code: "NO_TOKEN",
    });
  }

  try {
    // Verificar blacklist
    const resultado = await pool.query(
      "SELECT 1 FROM token_blacklist WHERE token = $1",
      [token]
    );

    if (resultado.rows.length > 0) {
      return res.status(401).json({
        error: "Token inválido o expirado",
        code: "TOKEN_INVALID",
      });
    }

    // Verificar JWT
    const decoded = Autenticacion.verificarToken(token);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error("Error en verificación de token:", error);
    res.status(401).json({
      error: "Token inválido",
      code: "TOKEN_VERIFICATION_FAILED",
      details: error.message,
    });
  }
};
export default VerificarUsuario;
