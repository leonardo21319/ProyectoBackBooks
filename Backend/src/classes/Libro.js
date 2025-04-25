class Libro {
    constructor({
      id,
      titulo,
      ISBN,
      autor,
      editorial,
      fecha_publicacion,
      id_estado_libro,
      precio,
      descripcion,
      portada,
      id_usuario,
      id_categoria,
      disponibilidad,
      estatus,
      id_tipo_transaccion
    }) {
      this.id = id;
      this.titulo = titulo;
      this.ISBN = ISBN;
      this.autor = autor;
      this.editorial = editorial;
      this.fecha_publicacion = fecha_publicacion;
      this.id_estado_libro = id_estado_libro;
      this.precio = precio;
      this.descripcion = descripcion;
      this.portada = portada;
      this.id_usuario = id_usuario;
      this.id_categoria = id_categoria;
      this.disponibilidad = disponibilidad;
      this.estatus = estatus;
      this.id_tipo_transaccion = id_tipo_transaccion;
    }
  }
  