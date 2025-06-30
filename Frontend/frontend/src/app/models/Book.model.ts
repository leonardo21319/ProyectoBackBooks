export interface Book {
  id: number;
  titulo: string;
  isbn: string | null;
  autor: string;
  editorial: string;
  fecha_publicacion: string;
  id_estado_libro: number;
  precio: number;
  descripcion: string;
  portada: string;
  id_usuario: number;
  id_categoria: number;
  disponibilidad: number;

  estatus: number;
  id_tipo_transaccion: number;
  categoria_nombre?: string;
  estado_libro?: string;
  tipo_transaccion_nombre?: string;
  numpaginas?: number;
}
