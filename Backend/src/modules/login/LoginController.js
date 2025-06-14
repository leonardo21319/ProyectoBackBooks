import Usuario from "../../classes/Usuario.js";
import {
  guardarUsuarioDB,
  obtenerUsuarioPorCorreo,
} from "../../models/UserModel.js";
import Seguridad from "../../classes/Seguridad.js";
import Autenticacion from "../../classes/Autenticacion.js";

export const RegistroControlador = async (req, res) => {
  const listaUsuarios = req.body;

  if (!Array.isArray(listaUsuarios)) {
    return res
      .status(400)
      .json({ error: "El cuerpo de la solicitud debe ser un arreglo" });
  }

  const resultados = [];

  for (const usuarioData of listaUsuarios) {
    try {
      const usuario = new Usuario(usuarioData);
      await guardarUsuarioDB(usuario);
      resultados.push({
        id: usuario.id,
        correo: usuario.correoInstitucional,
        exito: true,
      });
    } catch (error) {
      resultados.push({
        correo: usuarioData.correoInstitucional,
        exito: false,
        error: error.message,
      });
    }
  }

  res.json(resultados);
};

// Controlador para el inicio de sesión
export const LoginControlador = async (req, res) => {
  const { correo, contrasena } = req.body.data;
  console.log(req.body.data);
  if (!correo || !contrasena) {
    return res
      .status(400)
      .json({ error: "Correo y contraseña son requeridos" });
  }
  //Recibe id, el correo y la contraseña del usuario
  const usuario = await obtenerUsuarioPorCorreo(correo);
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const contrasenaValida = await Seguridad.compararContrasena(
    contrasena,
    usuario.contrasena
  );
  if (!contrasenaValida) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  const token = Autenticacion.generarToken(usuario);
  console.log(token);
  res.status(200).json({ data: token });
};

export const LogoutControlador = async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    await Autenticacion.invalidarToken(token);
    res.status(200).json({ message: "Sesión cerrada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};
