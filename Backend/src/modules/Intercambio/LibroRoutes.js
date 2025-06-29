import express from "express";
import {
  RegistrarLibrosControlador,
  obtenerLibrosControlador,
  obtenerLibroPorIdControlador,
  actualizarLibroControlador,
  eliminarLibroControlador,
  agregarMarcadorLibroControlador,
  eliminarMarcadorLibroControlador,
  obtenerMarcadoresPorUsuarioControlador,
} from "../Intercambio/LibroController.js";
import upload from "../../middlewares/guardarPortada.js"; // Importar configuración de multer
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
router.post(
  "/cargarlibros",
  upload.single("portada"),
  RegistrarLibrosControlador
);

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
/**
 * @swagger
 * /intercambio/eliminarlibro/{id}:
 *   delete:
 *     summary: Elimina un libro del sistema.
 *     description: Permite eliminar un libro específico utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Libro eliminado exitosamente.
 *       404:
 *         description: Libro no encontrado.
 *       500:
 *         description: Error en el servidor al procesar la solicitud.
 */
router.delete("/eliminarlibro/:id", eliminarLibroControlador);

/**
 * @swagger
 * /intercambio/agregarmarcador:
 *   post:
 *     summary: Agrega un marcador a un libro.
 *     description: Permite agregar un marcador a un libro específico por ID de libro y usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idLibro:
 *                 type: integer
 *                 description: ID del libro al que se agregará el marcador.
 *               idUsuario:
 *                 type: integer
 *                 description: ID del usuario que marca el libro.
 *     responses:
 *       200:
 *         description: Marcador agregado exitosamente.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/agregarmarcador", agregarMarcadorLibroControlador);

/**
 * @swagger
 * /intercambio/eliminarmarcador:
 *   post:
 *     summary: Elimina un marcador de un libro.
 *     description: Permite eliminar un marcador de un libro específico utilizando el ID de libro y usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idLibro:
 *                 type: integer
 *                 description: ID del libro del que se eliminará el marcador.
 *               idUsuario:
 *                 type: integer
 *                 description: ID del usuario que desea eliminar el marcador.
 *     responses:
 *       200:
 *         description: Marcador eliminado exitosamente.
 *       404:
 *         description: Marcador no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/eliminarmarcador", eliminarMarcadorLibroControlador);

/**
 * @swagger
 * /intercambio/obtenermarcadores/{idUsuario}:
 *   get:
 *     summary: Obtiene todos los marcadores de un usuario.
 *     description: Recupera la lista de todos los marcadores asociados a un usuario específico por su ID.
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         description: ID del usuario cuyos marcadores serán recuperados.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de marcadores obtenida con éxito.
 *       404:
 *         description: No se encontraron marcadores para este usuario.
 *       500:
 *         description: Error al obtener los marcadores.
 */
router.get(
  "/obtenermarcadores/:idUsuario",
  obtenerMarcadoresPorUsuarioControlador
);

export default router;
