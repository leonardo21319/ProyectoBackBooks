import Usuario from '../../classes/Usuario.js';
import { guardarUsuarioDB, obtenerUsuarioPorCorreo } from '../../models/UserModel.js';
import Seguridad from '../../classes/Seguridad.js';
export const RegistroControlador = async (req, res) => {
  const listaUsuarios = req.body;

  if (!Array.isArray(listaUsuarios)) {
    return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un arreglo' });
  }

  const resultados = [];

  for (const usuarioData of listaUsuarios) {
    try {
      const usuario = new Usuario(usuarioData);
      await guardarUsuarioDB(usuario);
      resultados.push({
        id: usuario.id,
        correo: usuario.correoInstitucional,
        exito: true
      });
    } catch (error) {
      resultados.push({
        correo: usuarioData.correoInstitucional,
        exito: false,
        error: error.message
      });
    }
  }

  
  res.json(resultados);
};



// Controlador para el inicio de sesión
export const LoginControlador = async (req, res) => {

  const { correo, contrasena } = req.body.data;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  const usuario = await obtenerUsuarioPorCorreo(correo);
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const contrasenaValida = await Seguridad.compararContrasena(contrasena, usuario.contrasena);
  if (!contrasenaValida) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  const token = Autenticacion.generarToken(usuario);
  res.status(200).json({ data: token });
}