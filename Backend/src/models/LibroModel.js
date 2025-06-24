import pool from "../config/configDB.js";

// Funciones para manejar libros en la base de datos
export const guardarLibroDB = async (libro) => {
  console.log("Guardando libro:", libro);
  const sql = `
    INSERT INTO libros 
    (titulo, isbn, autor, editorial, fecha_publicacion, precio, descripcion, portada, id_usuario, id_categoria, disponibilidad, estatus, id_estado_libro, id_tipo_transaccion)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING id
  `;

  const valores = [
    libro.titulo,
    libro.isbn,
    libro.autor,
    libro.editorial,
    libro.fecha_publicacion,
    libro.precio,
    libro.descripcion,
    libro.portada,
    libro.id_usuario,
    libro.id_categoria,
    libro.disponibilidad,
    libro.estatus,
    libro.id_estado_libro,
    libro.id_tipo_transaccion,
  ];

  try {
    const resultado = await pool.query(sql, valores);
    libro.id = resultado.rows[0].id;
    return libro;
  } catch (error) {
    console.error("Error al guardar libro:", error);
    throw error;
  }
};
// Función para agregar un marcador de libro a la base de datos
export const agregarMarcadorLibroDB = async (idUsuario, idLibro) => {
  const sql = `
    INSERT INTO marcadores (user_id, book_id)
    VALUES ($1, $2)
    RETURNING id
  `;

  const valores = [idUsuario, idLibro];

  try {
    const resultado = await pool.query(sql, valores);
    return resultado.rows[0].id;
  } catch (error) {
    console.error("Error al agregar marcador al libro:", error);
    throw error;
  }
};
// Función para verificar si un libro ya está marcado por un usuario
export const eliminarMarcador = async (userId, bookId) => {
  try {
    const resultado = await pool.query(
      "DELETE FROM marcadores WHERE user_id = $1 AND book_id = $2",
      [userId, bookId]
    );
    return resultado.rowCount > 0; // Retorna true si se eliminó correctamente
  } catch (error) {
    console.error("Error al eliminar marcador:", error);
    throw error;
  }
};
// Función para obtener todos los marcadores de un usuario
export const obtenerMarcadoresPorUsuario = async (userId) => {
  const sql = `
    SELECT m.id, m.user_id, m.book_id, l.titulo, l.isbn, l.autor, l.editorial, l.fecha_publicacion, l.precio, l.descripcion, l.portada
    FROM marcadores m
    JOIN libros l ON m.book_id = l.id
    WHERE m.user_id = $1
  `;

  try {
    const resultado = await pool.query(sql, [userId]);
    return resultado.rows;
  } catch (error) {
    console.error("Error al obtener marcadores por usuario:", error);
    throw error;
  }
};
// Función para obtener todos los libros de la base de datos
export const obtenerTodosLosLibros = async () => {
  const sql = `
    SELECT 
      l.id, 
      l.titulo, 
      l.isbn, 
      l.autor, 
      l.editorial, 
      l.fecha_publicacion, 
      l.precio, 
      l.descripcion, 
      l.portada, 
      l.id_usuario, 
      l.disponibilidad, 
      l.estatus,
      l.id_tipo_transaccion, 
      l.id_categoria,
      c.nombre AS categoria_nombre, 
      e.nombre AS estado_libro_nombre, 
      t.nombre AS tipo_transaccion_nombre
    FROM libros l
    JOIN categoria c ON l.id_categoria = c.id
    JOIN estado_libro e ON l.id_estado_libro = e.id
    JOIN tipo_transaccion t ON l.id_tipo_transaccion = t.id
  `;

  try {
    const resultado = await pool.query(sql);
    return resultado.rows;
  } catch (error) {
    console.error("Error al obtener todos los libros:", error);
    throw error;
  }
};
// Función para obtener un libro por su ID
export const obtenerLibroPorId = async (id) => {
  const sql = `
    SELECT l.id, l.titulo, l.isbn, l.autor, l.editorial, l.fecha_publicacion, l.precio, l.descripcion, l.portada,
           c.nombre AS categoria, e.nombre AS estado_libro, t.nombre AS tipo_transaccion
    FROM libros l
    JOIN categorias c ON l.id_categoria = c.id
    JOIN estados_libro e ON l.id_estado_libro = e.id
    JOIN tipos_transaccion t ON l.id_tipo_transaccion = t.id
    WHERE l.id = $1
  `;

  try {
    const resultado = await pool.query(sql, [id]);
    return resultado.rows[0];
  } catch (error) {
    console.error("Error al obtener libro por ID:", error);
    throw error;
  }
};
