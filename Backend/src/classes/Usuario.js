import bcrypt from 'bcryptjs';

class Usuario {
  constructor(datos) {
    this.id = datos.id;
    this.correoInstitucional = datos.correoInstitucional;
    this.nombre = datos.nombre;
    this.apellidoPaterno = datos.apellidoPaterno;
    this.apellidoMaterno = datos.apellidoMaterno;
    this.contrasena = datos.contrasena;
    this.rol = datos.rol;
    this.calificacion = datos.calificacion ?? 0;
    this.fechaRegistro = datos.fechaRegistro || new Date();
    this.estatus = datos.estatus ?? true;
  }

  async hash(contrasena) {
    return bcrypt.hash(contrasena, 10);
  }

  getNombreCompleto() {
    return `${this.nombre} ${this.apellidoPaterno} ${this.apellidoMaterno}`;
  }

  cambiarRol(nuevoRol) {
    this.rol = nuevoRol;
  }
}

export default Usuario;
