import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export default class Seguridad {
  static  algorithm = 'aes-256-cbc';
  static  key = Buffer.from(process.env.ENCRYPT_KEY, 'hex');
  static  iv = Buffer.alloc(16, 0); // Un IV
  static  blacklist = new Map(); 

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
    const decipher = crypto.createDecipheriv(algorithm, key, iv); 
    let decrypted = decipher.update(valor, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  static agregarTokenBlacklist(token) {
    Seguridad.blacklist.set(token, Date.now()); 
  }
  
  static verificarTokenBlacklist(token) {
    return Seguridad.blacklist.has(token); // Verifica si el token está en la blacklist
  }

  static limpiarBlacklist(token) {
    Seguridad.blacklist.clear();
  }
}