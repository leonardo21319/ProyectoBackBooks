

class Usuario {
    constructor({
      id,
      correoInstitucional,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      contrasena,
      rol,
      calificacion,
      fechaRegistro = new Date(),
      estatus = true,
      librosPublicados = [],
      transaccionesComoComprador = [],
      transaccionesComoVendedor = []
    }) {
      this.id = id;
      this.correoInstitucional = correoInstitucional;
      this.nombre = nombre;
      this.apellidoPaterno = apellidoPaterno;
      this.apellidoMaterno = apellidoMaterno;
      this.contrasena = contrasena;
      this.rol = rol; // Objeto Rol
      this.calificacion = calificacion;
      this.fechaRegistro = fechaRegistro;
      this.estatus = estatus;
  
      // Relaciones
      this.librosPublicados = librosPublicados;
      this.transaccionesComoComprador = transaccionesComoComprador;
      this.transaccionesComoVendedor = transaccionesComoVendedor;
    }
  
    // Métodos
  
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
  const nuevoUsuario = new Usuario({
    id: 1,
    correoInstitucional: 'leonardo.dominguez@escom.ipn.mx',
    nombre: 'Leonardo',
    apellidoPaterno: 'Dominguez',
    apellidoMaterno: 'Olvera',
    contrasena: 'segura123',
    rol: { id: 2, nombre: 'Comprador' },
    calificacion: 4.8
  });
  
  console.log(nuevoUsuario.getNombreCompleto()); // Leonardo Dominguez Olvera
  