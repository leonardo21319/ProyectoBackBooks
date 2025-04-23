import bd from '../config/configDB.js'
import conexion from '../config/configDB.js'
export const guardarUsuarioDB = async (usuario) => {

    const contrasenaHassheada = await usuario.hash(usuario.contrasena);
    usuario.contrasena = contrasenaHassheada;
    usuario.fechaCreacion = new Date().toISOString().slice(0, 19).replace('T', ' ');
    usuario.estatus = usuario.estatus || 1;
    
    const sql = 
    'INSERT INTO usuarios (nombre, correo_institucional, contrasena) VALUES ($1, $2, $3) RETURNING id';

}