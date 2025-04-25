import pool from '../config/configDB.js';

export const guardarLibroDB = async (libro) => {
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
    libro.id_tipo_transaccion
  ];

  try {
    const resultado = await pool.query(sql, valores);
    libro.id = resultado.rows[0].id;
    return libro;
  } catch (error) {
    console.error('Error al guardar libro:', error);
    throw error;
  }
};
