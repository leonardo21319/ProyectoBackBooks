import express from "express";
import {
  LoginControlador,
  RegistroControlador,
  LogoutControlador,
} from "./LoginController.js";
import VerificarUsuario from "../../middlewares/Auth.js";

const router = express.Router();

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
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre completo del usuario.
 *               correo:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario.
 *               id_rol:
 *                 type: integer
 *                 description: ID del rol del usuario (por ejemplo, 1 para Admin, 2 para Usuario).
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente.
 *       400:
 *         description: Error de validación o datos duplicados.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/registro", RegistroControlador);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión en el sistema.
 *     description: Este endpoint permite a los usuarios iniciar sesión y obtener un token JWT.
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
 *         description: Inicio de sesión exitoso, se devuelve un token JWT.
 *       400:
 *         description: Credenciales incorrectas.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/login", LoginControlador);

/**
 * @swagger
 * /auth/cerrarSesion:
 *   post:
 *     summary: Cierra sesión del usuario.
 *     description: Este endpoint cierra la sesión de un usuario, invalidando su token JWT.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente.
 *       400:
 *         description: Token no válido o caducado.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/cerrarSesion", VerificarUsuario, LogoutControlador);

export default router;
