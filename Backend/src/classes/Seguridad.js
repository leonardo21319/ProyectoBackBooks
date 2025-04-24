import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPT_KEY, 'hex');
const iv = Buffer.alloc(16, 0); // Un IV fijo de 16 bytes en cero

export default class Seguridad {
  static async hash(contrasena) {
    return bcrypt.hash(contrasena, 10);
  }

  static async compararContrasena(contrasena, hash) {
    return bcrypt.compare(contrasena, hash);
  }

  static cifrar(textoplano) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(textoplano, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
      iv: iv.toString('hex'),
      valor: encrypted
    };
  }
  
  static descifrar(valor) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv); // Usa el iv ya definido
    let decrypted = decipher.update(valor, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  
}