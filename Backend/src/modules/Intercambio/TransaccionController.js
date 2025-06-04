import Transaccion from '../../classes/Transaccion.js';
import { registarTransaccion } from '../../models/TransaccionModel.js'; // Asumiendo que tienes esta función

export const RegistrarTransaccionControlador = async (req, res) => {
    const datos = req.body;
  
    if (!Array.isArray(datos)) {
      return res.status(400).json({ error: 'El cuerpo debe ser un arreglo de transacciones' });
    }
  
    const resultados = [];
  
    for (const transaccion of datos) {
      try {
        const idInsertado = await registarTransaccion(transaccion);
        resultados.push({ id: idInsertado, exito: true });
      } catch (error) {
        resultados.push({ exito: false, error: error.message });
      }
    }
  
    res.status(200).json(resultados);
  };

export default RegistrarTransaccionControlador;