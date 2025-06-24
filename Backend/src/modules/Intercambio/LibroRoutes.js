import express from "express";
import {
  RegistrarLibrosControlador,
  obtenerLibrosControlador,
  obtenerLibroPorIdControlador,
  actualizarLibroControlador,
} from "../Intercambio/LibroController.js";

const router = express.Router();

/**
 * @swagger
 * /intercambio/cargarlibros:
 *   post:
 *     summary: Registra libros en el sistema.
 *     description: Permite registrar libros en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               isbn:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *                 format: float
 *               categoria:
 *                 type: string
 *               disponibilidad:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Libro registrado correctamente
 *       400:
 *         description: Datos incorrectos
 *       500:
 *         description: Error en el servidor
 */
router.post("/cargarlibros", RegistrarLibrosControlador);

/**
 * @swagger
 * /intercambio/obtenerlibros:
 *   get:
 *     summary: Obtiene todos los libros registrados.
 *     description: Recupera una lista de todos los libros en el sistema.
 *     responses:
 *       200:
 *         description: Lista de libros obtenida con éxito
 *       500:
 *         description: Error en el servidor
 */
router.get("/obtenerlibros", obtenerLibrosControlador);

/**
 * @swagger
 * /intercambio/obtenerlibros/{id}:
 *   get:
 *     summary: Obtiene un libro por su ID.
 *     description: Recupera un libro específico utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Libro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 titulo:
 *                   type: string
 *                 autor:
 *                   type: string
 *                 isbn:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 precio:
 *                   type: number
 *                   format: float
 *       404:
 *         description: Libro no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get("/obtenerlibros/:id", obtenerLibroPorIdControlador);

/**
 * @swagger
 * /intercambio/actualizarlibro/{id}:
 *   put:
 *     summary: Actualiza un libro existente en el sistema.
 *     description: Permite actualizar los detalles de un libro utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               isbn:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *                 format: float
 *               categoria:
 *                 type: string
 *               disponibilidad:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Libro actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 titulo:
 *                   type: string
 *                 autor:
 *                   type: string
 *                 isbn:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 precio:
 *                   type: number
 *                   format: float
 *       400:
 *         description: Datos incorrectos o libro no encontrado.
 *       404:
 *         description: Libro no encontrado.
 *       500:
 *         description: Error en el servidor
 */
router.put("/actualizarlibro/:id", actualizarLibroControlador);

export default router;
