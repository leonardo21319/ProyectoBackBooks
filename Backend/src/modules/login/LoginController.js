import Usuario from '../../classes/Usuario.js';
import {guardarUsuarioDB} from '../../models/UserModel.js';
export const RegistroControlador = async (req, res) => {    
    const listaUsuarios = await req.body;
    if (!Array.isArray(listaUsuarios)) {
        return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un arreglo' });
    }
    const resultados = [];
    for (const usuarioData of listaUsuarios) {
        try{
            const usuario = new guardarUsuarioDB(usuarioData);
            resultados.push({id: usuario.id, correo: usuario.correoInstitucional, exito: true});
        }
        catch (error) {
            resultados.push({correo: usuarioData.correoInstitucional, exito: false, error: error.message});
        }
    }
    res.json(resultados);   
}   