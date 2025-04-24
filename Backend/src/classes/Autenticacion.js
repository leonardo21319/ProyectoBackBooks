import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Seguridad from '../classes/Seguridad.js'; // por si luego agregas hash/verify

dotenv.config(); // Asegúrate de tener esto

class Autenticacion {
    static generarToken(usuario) {
      const payload = {
        id: usuario.id,
        correo: usuario.correo_institucional, // o como lo tengas definido
        rol: usuario.rol
      };
  
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
      return token;
    }
  }
  
  export default Autenticacion;