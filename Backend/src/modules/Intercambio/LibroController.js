import Libro from "../../classes/Libro.js";
import Correo from "../../classes/Correo.js";

import {
  guardarLibroDB,
  obtenerLibroPorId,
  obtenerTodosLosLibros,
  eliminarLibroPorId,
  agregarMarcadorLibroDB,
  eliminarMarcador,
  obtenerMarcadoresPorUsuario,
} from "../../models/LibroModel.js";

/**
 * @swagger
 * /intercambio/cargarlibros:
 *   post:
 *     summary: Registra múltiples libros en el sistema.
 *     description: Registra una lista de libros en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 titulo:
 *                   type: string
 *                   description: Título del libro.
 *                 autor:
 *                   type: string
 *                   description: Autor del libro.
 *                 isbn:
 *                   type: string
 *                   description: ISBN del libro.
 *                 descripcion:
 *                   type: string
 *                   description: Descripción del libro.
 *                 precio:
 *                   type: number
 *                   format: float
 *                   description: Precio del libro.
 *                 portada:
 *                   type: string
 *                   description: Imagen del libro en formato base64.
 *                 estatus:
 *                   type: integer
 *                   description: Estatus del libro (1 para nuevo, 2 para usado).
 *                 categoria:
 *                   type: string
 *                   description: Categoría del libro.
 *     responses:
 *       200:
 *         description: Libros registrados exitosamente.
 *       400:
 *         description: Error de validación de datos.
 *       500:
 *         description: Error en el servidor al procesar la solicitud.
 */
export const RegistrarLibrosControlador = async (req, res) => {
  try {
    const libroData = {
      titulo: req.body.titulo,
      isbn: req.body.isbn || null,
      autor: req.body.autor,
      editorial: req.body.editorial,
      fecha_publicacion: req.body.fecha_publicacion,
      id_estado_libro: Number(req.body.id_estado_libro),
      precio: Number(req.body.precio),
      descripcion: req.body.descripcion,
      id_usuario: Number(req.body.id_usuario),
      id_categoria: Number(req.body.id_categoria),
      disponibilidad:Number(req.body.disponibilidad),
      estatus: Number(req.body.estatus),
      id_tipo_transaccion: Number(req.body.id_tipo_transaccion),
      numpaginas: Number(req.body.numpaginas),
      portada: req.file ? `/uploads/portadas/${req.file.filename}` : null,
    };

    const libro = new Libro(libroData);
    await guardarLibroDB(libro);

    res.status(201).json(libro);
  } catch (err) {
    console.error("Error al registrar libro:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /intercambio/obtenerlibros:
 *   get:
 *     summary: Obtiene todos los libros registrados en el sistema.
 *     description: Recupera una lista de todos los libros disponibles en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de libros obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titulo:
 *                     type: string
 *                   autor:
 *                     type: string
 *                   isbn:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   precio:
 *                     type: number
 *                   estatus:
 *                     type: integer
 *                   categoria:
 *                     type: string
 *                   disponibilidad:
 *                     type: string
 *                   tipo_transaccion:
 *                     type: string
 *       500:
 *         description: Error al obtener los libros.
 */
export const obtenerLibrosControlador = async (req, res) => {
  try {
    const libros = await obtenerTodosLosLibros();
    console.log("Libros obtenidos:", libros);
    res.json(libros);
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * @swagger
 * /intercambio/obtenerlibros/{id}:
 *   get:
 *     summary: Obtiene un libro específico por su ID.
 *     description: Recupera los detalles de un libro utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del libro a obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Libro encontrado.
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
 *         description: Libro no encontrado.
 *       500:
 *         description: Error al obtener el libro.
 */
export const obtenerLibroPorIdControlador = async (req, res) => {
  const { id } = req.params;

  try {
    const libro = await obtenerLibroPorId(id);
    console.log(libro)
    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    res.json(libro);
  } catch (error) {
    console.error("Error al obtener el libro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const actualizarLibroControlador = async (req, res) => {
  const { id } = req.params;
  const libroData = req.body;

  try {
    const libro = await obtenerLibroPorId(id);
    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    // Actualizar los campos del libro
    Object.assign(libro, libroData);

    // Guardar el libro actualizado en la base de datos
    await guardarLibroDB(libro);

    res.json({ message: "Libro actualizado exitosamente", libro });
  } catch (error) {
    console.error("Error al actualizar el libro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

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
export const eliminarLibroControlador = async (req, res) => {
  const { id } = req.params;

  try {
    const libro = await obtenerLibroPorId(id);
    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    await eliminarLibroPorId(id);
    res.json({ message: "Libro eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el libro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

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
export const agregarMarcadorLibroControlador = async (req, res) => {
  const { idLibro, idUsuario } = req.body;

  try {
    const resultado = await agregarMarcadorLibroDB(idLibro, idUsuario);
    res.json({ message: "Marcador agregado exitosamente", resultado });
  } catch (error) {
    console.error("Error al agregar marcador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

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
export const eliminarMarcadorLibroControlador = async (req, res) => {
  const { idLibro, idUsuario } = req.body;

  try {
    const resultado = await eliminarMarcador(idUsuario, idLibro);
    if (resultado) {
      res.json({ message: "Marcador eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "Marcador no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar marcador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

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
export const obtenerMarcadoresPorUsuarioControlador = async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const marcadores = await obtenerMarcadoresPorUsuario(idUsuario);
    res.json(marcadores);
  } catch (error) {
    console.error("Error al obtener marcadores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};





export const aceptarIntercambioControlador = async (req, res) => {
  const { idLibro, correoComprador, nombreComprador, nombreVendedor, tituloLibro } = req.body;

  try {
    // Aquí podrías actualizar el estado de la oferta en la BD si ya tienes esa lógica
    await Correo.mandarCorreo({
      to: correoComprador,
      subject: '¡Tu oferta fue aceptada!',
      html: `
        <p>Hola ${nombreComprador},</p>
        <p><strong>${nombreVendedor}</strong> ha aceptado tu oferta por el libro <em>${tituloLibro}</em>.</p>
        <p>Ponte en contacto para coordinar el intercambio.</p>
      `
    });

    res.status(200).json({ mensaje: 'Correo enviado al comprador exitosamente.' });
  } catch (error) {
    console.error('Error al aceptar intercambio:', error);
    res.status(500).json({ error: 'Error al procesar la aceptación del intercambio.' });
  }
};

