import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Seguridad from '../classes/Seguridad.js'; // por si luego agregas hash/verify

dotenv.config(); 

class Autenticacion {
    static generarToken(usuario) {
      const payload = {
        id: usuario.id,
        correo: usuario.correo_institucional, 
        rol: usuario.rol
      };
  
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
      return token;

    }

    static verificarToken(token) {
        try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          return decoded;
        } catch (error) {
          throw new Error('Token inválido o expirado', error);
        }
      }

    }   
  
  export default Autenticacion;