export class Usuario {
    constructor(datos) {
      this.id = datos.id;
      this.correoInstitucional = datos.correoInstitucional;
      this.nombre = datos.nombre;
      this.apellidoPaterno = datos.apellidoPaterno;
      this.apellidoMaterno = datos.apellidoMaterno;
      this.contrasena = datos.contrasena;
      this.rol = datos.rol;
      this.calificacion = datos.calificacion;
      this.fechaRegistro = datos.fechaRegistro;
      this.estatus = datos.estatus ?? true;
    }
  
    getNombreCompleto() {
      return `${this.nombre} ${this.apellidoPaterno} ${this.apellidoMaterno}`;
    }
  
    agregarLibro(libro) {
      this.librosPublicados.push(libro);
    }
  
    registrarTransaccionComoComprador(transaccion) {
      this.transaccionesComoComprador.push(transaccion);
    }
  
    registrarTransaccionComoVendedor(transaccion) {
      this.transaccionesComoVendedor.push(transaccion);
    }
  
    cambiarRol(nuevoRol) {
      this.rol = nuevoRol;
    }
  }