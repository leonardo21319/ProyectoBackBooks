import Libro from "../../classes/Libro.js";
import {
  guardarLibroDB,
  obtenerLibroPorId,
  obtenerTodosLosLibros,
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
  const listaLibros = req.body;
  console.log("Lista de libros recibida:", listaLibros);
  if (!Array.isArray(listaLibros)) {
    return res
      .status(400)
      .json({ error: "El cuerpo de la solicitud debe ser un arreglo" });
  }

  const resultados = [];

  await Promise.all(
    listaLibros.map(async (libroData) => {
      try {
        if (libroData.portada && typeof libroData.portada === "string") {
          const base64 = libroData.portada.includes(",")
            ? libroData.portada.split(",")[1]
            : libroData.portada;

          if (!base64.match(/^[A-Za-z0-9+/=]*$/)) {
            throw new Error("La imagen tiene una secuencia base64 no válida");
          }

          libroData.portada = Buffer.from(base64, "base64");
        } else {
          libroData.portada = null;
        }

        if (typeof libroData.estatus !== "number" || isNaN(libroData.estatus)) {
          throw new Error("El valor de estatus debe ser un número entero");
        }

        const valoresValidosEstatus = [1, 2]; // Ejemplo: 1 = NUEVO, 2 = USADO
        if (!valoresValidosEstatus.includes(libroData.estatus)) {
          throw new Error("El valor de estatus no es válido");
        }

        const libro = new Libro(libroData);
        await guardarLibroDB(libro);

        resultados.push({ titulo: libro.titulo, exito: true });
      } catch (error) {
        resultados.push({
          titulo: libroData.titulo || "—",
          exito: false,
          error: error.message,
        });
      }
    })
  );

  res.json(resultados);
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
