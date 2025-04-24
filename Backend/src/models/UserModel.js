import e from 'express';
import pool from '../config/configDB.js';
import crypto from 'crypto';
import Seguridad from '../classes/Seguridad.js';

export const guardarUsuarioDB = async (usuario) => {
  const contrasenaHasheada = await usuario.hash(usuario.contrasena);
  const { valor: correoEncriptado } = Seguridad.cifrar(usuario.correoInstitucional);
  const sql = `
    INSERT INTO usuario 
    (correo_institucional, nombre, apellido_paterno, apellido_materno, contrasena, id_rol, calificacion, fecha_registro, estatus)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `;

  const valores = [
    correoEncriptado,
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

export const obtenerUsuarioPorCorreo = async (correoTextoPlano) => {
  try {
    const resultado = await pool.query(
      'SELECT id, correo_institucional, nombre, apellido_paterno, apellido_materno, contrasena, id_rol, calificacion, estatus FROM usuario'
    );

    for (const row of resultado.rows) {
      const correoDescifrado = Seguridad.descifrar(row.correo_institucional);

      if (correoDescifrado === correoTextoPlano) {
        return row; // Usuario encontrado
      }
    }

    return null; // Usuario no encontrado
  } catch (error) {
    console.error('Error al buscar usuario por correo:', error);
    throw error;
  }
};