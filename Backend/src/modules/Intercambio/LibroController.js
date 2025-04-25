import Libro from '../../classes/Libro.js';
import { guardarLibroDB } from '../../models/LibroModel.js'; // Asumiendo que tienes esta función

export const RegistrarLibrosControlador = async (req, res) => {
  const listaLibros = req.body;

  if (!Array.isArray(listaLibros)) {
    return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un arreglo' });
  }

  const resultados = [];

  for (const libroData of listaLibros) {
    try {
      const libro = new Libro(libroData);
      await guardarLibroDB(libro);
      resultados.push({
        titulo: libro.titulo,
        exito: true
      });
    } catch (error) {
      resultados.push({
        titulo: libroData.titulo,
        exito: false,
        error: error.message
      });
    }
  }

  res.json(resultados);
};

export default RegistrarLibrosControlador;