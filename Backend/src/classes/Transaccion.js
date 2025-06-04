class Transaccion {
    constructor({
      id,
      id_comprador,
      id_vendedor,
      id_libro,
      precio_acordado,
      metodo_pago,
      id_estado_transaccion,
      fecha_transaccion,
      fecha_entrega,
      comentarios
    }) {
      this.id = id;
      this.id_comprador = id_comprador;
      this.id_vendedor = id_vendedor;
      this.id_libro = id_libro;
      this.precio_acordado = precio_acordado;
      this.metodo_pago = metodo_pago;
      this.id_estado_transaccion = id_estado_transaccion;
      this.fecha_transaccion = fecha_transaccion;
      this.fecha_entrega = fecha_entrega;
      this.comentarios = comentarios;
    }
  }
  