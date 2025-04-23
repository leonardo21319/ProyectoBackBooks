import pool from '../config/configDB.js';

export const guardarUsuarioDB = async (usuario) => {
  const contrasenaHasheada = await usuario.hash(usuario.contrasena);

  const sql = `
    INSERT INTO usuario 
    (correo_institucional, nombre, apellido_paterno, apellido_materno, contraseña, id_rol, calificacion, fecha_registro, estatus)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `;

  const valores = [
    usuario.correoInstitucional,
    usuario.nombre,
    usuario.apellidoPaterno,
    usuario.apellidoMaterno,
    contrasenaHasheada,
    usuario.rol?.id ?? 3,
    usuario.calificacion,
    usuario.fechaRegistro,
    usuario.estatus ? 1 : 0
  ];

  try {
    const resultado = await pool.query(sql, valores);
    usuario.id = resultado.rows[0].id;
    return usuario;
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    throw error;
  }
};
