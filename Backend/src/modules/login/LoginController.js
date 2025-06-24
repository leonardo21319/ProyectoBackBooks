import Usuario from "../../classes/Usuario.js";
import {
  guardarUsuarioDB,
  obtenerUsuarioPorCorreo,
} from "../../models/UserModel.js";
import Seguridad from "../../classes/Seguridad.js";
import Autenticacion from "../../classes/Autenticacion.js";
import jwt from "jsonwebtoken";

// Controlador para el registro de usuarios
/**
 * @swagger
 * /auth/registro:
 *   post:
 *     summary: Registra un nuevo usuario.
 *     description: Este endpoint permite registrar un nuevo usuario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             items:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                   description: Nombre completo del usuario.
 *                 correoInstitucional:
 *                   type: string
 *                   description: Correo institucional del usuario.
 *                 contrasena:
 *                   type: string
 *                   description: Contraseña del usuario.
 *                 id_rol:
 *                   type: integer
 *                   description: ID del rol del usuario (1 para Admin, 2 para Usuario).
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente.
 *       400:
 *         description: Error en los datos de entrada, se espera un arreglo de usuarios.
 *       500:
 *         description: Error en el servidor.
 */
export const RegistroControlador = async (req, res) => {
  const listaUsuarios = req.body;

  if (!Array.isArray(listaUsuarios)) {
    return res
      .status(400)
      .json({ error: "El cuerpo de la solicitud debe ser un arreglo" });
  }

  const resultados = [];

  for (const usuarioData of listaUsuarios) {
    try {
      const usuario = new Usuario(usuarioData);
      await guardarUsuarioDB(usuario);
      resultados.push({
        id: usuario.id,
        correo: usuario.correoInstitucional,
        exito: true,
      });
    } catch (error) {
      resultados.push({
        correo: usuarioData.correoInstitucional,
        exito: false,
        error: error.message,
      });
    }
  }

  res.json(resultados);
};

// Controlador para el inicio de sesión
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión en el sistema y obtiene un token JWT.
 *     description: Este endpoint permite que los usuarios inicien sesión y obtengan un token JWT para acceder a recursos protegidos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario.
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, se devuelve el token JWT.
 *       400:
 *         description: Error en las credenciales, correo o contraseña incorrectos.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
export const LoginControlador = async (req, res) => {
  const { correo, contrasena } = req.body.data;
  console.log(req.body.data);
  if (!correo || !contrasena) {
    return res
      .status(400)
      .json({ error: "Correo y contraseña son requeridos" });
  }
  //Recibe id, el correo y la contraseña del usuario
  const usuario = await obtenerUsuarioPorCorreo(correo);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const contrasenaValida = await Seguridad.compararContrasena(
    contrasena,
    usuario.contrasena
  );
  if (!contrasenaValida) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }
  Seguridad.limpiarBlacklist();
  const token = Autenticacion.generarToken(usuario);

  res.status(200).json({ data: token });
};

// Controlador para cerrar sesión
/**
 * @swagger
 * /auth/cerrarSesion:
 *   post:
 *     summary: Cierra la sesión del usuario invalidando el token JWT.
 *     description: Este endpoint permite cerrar sesión del usuario, invalidando el token JWT y evitando su uso posterior.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada con éxito.
 *       400:
 *         description: Token no válido o no proporcionado.
 *       500:
 *         description: Error en el servidor.
 */
export const LogoutControlador = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1] || req.body.token;

  if (!token) {
    return res.status(401).json({
      error: "Token no proporcionado",
      code: "NO_TOKEN",
    });
  }

  try {
    // Limpiar tokens expirados primero
    await Autenticacion.limpiarTokensExpirados();

    // Verificar si el token es válido (pero no lanzar error si no lo es)
    let decoded;
    try {
      decoded = jwt.decode(token);
    } catch (decodeError) {
      console.error("Error decodificando token:", decodeError);
    }

    // Invalidar el token de todos modos
    await Autenticacion.invalidarToken(token);

    res.status(200).json({
      success: true,
      message: "Sesión cerrada con éxito",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({
      success: false,
      error: "Error al cerrar sesión",
      code: "LOGOUT_ERROR",
      details: error.message,
    });
  }
};
