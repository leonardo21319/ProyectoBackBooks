import pool from '../config/configDB.js';

export const registarTransaccion = async (transaccion) => {
  const sql = `
    INSERT INTO transaccion 
    (id_comprador, id_vendedor, id_libro, precio_acordado, metodo_pago, id_estado_transaccion, fecha_transaccion, fecha_entrega, comentarios)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `;

  const valores = [
    transaccion.id_comprador,
    transaccion.id_vendedor,
    transaccion.id_libro,
    transaccion.precio_acordado,
    transaccion.metodo_pago,
    transaccion.id_estado_transaccion,
    transaccion.fecha_transaccion,
    transaccion.fecha_entrega,
    transaccion.comentarios
  ];

  try {
    const resultado = await pool.query(sql, valores);
    return resultado.rows[0].id;
  } catch (error) {
    console.error('Error al guardar la transacción:', error);
    throw error;
  }
};
