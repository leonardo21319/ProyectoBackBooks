import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/configDB.js";
import Seguridad from "./Seguridad.js";

dotenv.config();

class Autenticacion {
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Genera un token de acceso para el usuario.
   *     description: Este endpoint genera un token JWT que expira en 1 hora para el usuario que se autentique.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: integer
   *               id_rol:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Token generado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       400:
   *         description: Error en la autenticación
   */
  static generarToken(usuario) {
    const payload = {
      id: usuario.id,
      rol: usuario.id_rol,
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
  }

  /**
   * @swagger
   * /auth/verify:
   *   post:
   *     summary: Verifica si el token es válido y no ha sido invalidado.
   *     description: Este endpoint verifica el token proporcionado, asegurándose de que no esté en la blacklist.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *     responses:
   *       200:
   *         description: Token es válido y no ha sido invalidado
   *       401:
   *         description: Token inválido o invalidado
   */
  static async verificarToken(token) {
    if (!token) throw new Error("Token no proporcionado");

    // Verificar blacklist
    const client = await pool.connect();
    try {
      const resultado = await client.query(
        "SELECT 1 FROM token_blacklist WHERE token = $1",
        [token]
      );

      if (resultado.rows.length > 0) {
        throw new Error("Token invalidado");
      }

      return jwt.verify(token, process.env.SECRET_KEY);
    } finally {
      client.release();
    }
  }

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Invalidar el token proporcionado.
   *     description: Este endpoint marca el token como invalidado y lo agrega a la blacklist.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *     responses:
   *       200:
   *         description: Token invalidado correctamente
   *       400:
   *         description: Error al invalidar el token
   */
  static async invalidarToken(token) {
    if (!token) throw new Error("Token no proporcionado");

    const client = await pool.connect();
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) {
        throw new Error("Token inválido");
      }

      const fechaExp = new Date(decoded.exp * 1000);

      // Verificar si el token ya está en la blacklist
      const existe = await client.query(
        "SELECT 1 FROM token_blacklist WHERE token = $1",
        [token]
      );

      if (existe.rows.length === 0) {
        await client.query(
          "INSERT INTO token_blacklist (token, fecha_expiracion) VALUES ($1, $2)",
          [token, fechaExp]
        );
      }
    } finally {
      client.release();
    }
  }

  /**
   * @swagger
   * /auth/cleanup:
   *   delete:
   *     summary: Elimina los tokens expirados de la blacklist.
   *     description: Este endpoint elimina los tokens de la blacklist que han expirado.
   *     responses:
   *       200:
   *         description: Tokens expirados eliminados correctamente
   */
  static async limpiarTokensExpirados() {
    const client = await pool.connect();
    try {
      await client.query(
        "DELETE FROM token_blacklist WHERE fecha_expiracion < NOW()"
      );
    } finally {
      client.release();
    }
  }
}

export default Autenticacion;
