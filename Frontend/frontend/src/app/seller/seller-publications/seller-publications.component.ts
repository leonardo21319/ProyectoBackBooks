// seller/seller-publications/seller-publications.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesHeaderComponent } from '../sales-header/sales-header.component';
import { ApiService } from '../../servicios/api.service';
import { Book } from '../../models/Book.model';

@Component({
  selector: 'app-seller-publications',
  standalone: true,
  imports: [CommonModule, FormsModule, SalesHeaderComponent],
  templateUrl: './seller-publications.component.html',
  styleUrls: ['./seller-publications.component.css'],
})
export class SellerPublicationsComponent implements OnInit {
  publications: Book[] = [];
  filteredPublications: Book[] = [];
  currentPublication: Book = this.emptyPublication;
  showNewPublicationModal = false;
  selectedImageFile: File | null = null;
  isEditMode = false;

  // Para detección de cambios
  private originalPublication: Book = this.emptyPublication;
  hasFormChanged = false;

  // Filtros
  filterCategory = 'todas';
  filterStatus = 'todos';
  filterTransaction = 'todas';
  sortBy = 'fecha_desc';
  searchTerm = '';

  // Estadísticas
  totalPublications = 0;
  availablePublications = 0;
  soldPublications = 0;
  reservedPublications = 0;

  categoriasMap = [
    { id: 1, value: '1', label: 'Ficción' },
    { id: 2, value: '2', label: 'Anime' },
    { id: 3, value: '3', label: 'Académico' },
    { id: 4, value: '4', label: 'Infantil' },
    { id: 5, value: '5', label: 'Cómic' },
    { id: 6, value: '6', label: 'Revista' },
    { id: 7, value: '7', label: 'Romantico' },
  ];

  transaccionesMap = [
    { id: 1, value: 'venta', label: 'Venta' },
    { id: 2, value: 'intercambio', label: 'Intercambio' },
    { id: 3, value: 'donacion', label: 'Donación' },
  ];

  get emptyPublication(): Book {
    return {
      id: 0,
      titulo: '',
      autor: '',
      editorial: '',
      isbn: '',
      portada: '',
      id_categoria: 0,
      id_estado_libro: 0,
      id_tipo_transaccion: 0,
      precio: 0,
      descripcion: '',
      numpaginas: 0,
      fecha_publicacion: '',
      disponibilidad: 0,
      estatus: 1,
      id_usuario: 0,
    };
  }

  public categories = this.categoriasMap;

  constructor(
    private router: Router,
    private ApiService: ApiService
  ) {}

  ngOnInit(): void {
    const decoded = this.ApiService.decodificarToken();
    if (decoded && decoded.id) {
      this.currentPublication.id_usuario = Number(decoded.id);
    }

    this.loadMockPublications();
    this.updateStats();
    this.applyFilters();
  }

  // MÉTODOS DE UTILIDAD
  getFileNameFromUrl(url: string): string {
    return url ? url.split('/').pop() || '' : '';
  }

  getCategoryName(id: number): string {
    return this.categoriasMap.find((c) => c.id === id)?.label || 'N/D';
  }

  getTransactionName(id: number): string {
    return this.transaccionesMap.find((t) => t.id === id)?.label || 'N/D';
  }

  getEstadoFisicoNombre(id_estado_libro: number): string {
    const map: { [key: number]: string } = {
      1: 'Nuevo',
      2: 'Usado',
      3: 'Desgastado',
    };
    return map[id_estado_libro] || 'Desconocido';
  }

  // MÉTODOS DE EVENTOS DE FORMULARIO
  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    
    if (file) {
      this.selectedImageFile = file;
      this.hasFormChanged = true;
      console.log('📷 Archivo seleccionado:', file.name);
    }
  }

  onInputChange(field: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target?.value !== undefined) {
      this.onFieldChange(field, target.value);
    }
  }

  onSelectChange(field: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target?.value !== undefined) {
      const numericValue = parseInt(target.value, 10);
      this.onFieldChange(field, numericValue);
    }
  }

  onNumberInputChange(field: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target?.value !== undefined) {
      const numericValue = parseFloat(target.value) || 0;
      this.onFieldChange(field, numericValue);
    }
  }

  onTextareaChange(field: string, event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    if (target?.value !== undefined) {
      this.onFieldChange(field, target.value);
    }
  }

  onDateChange(field: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target?.value !== undefined) {
      this.onFieldChange(field, target.value);
    }
  }

  // DETECCIÓN DE CAMBIOS
  onFieldChange(field: string, value: any): void {
    // Verificar que currentPublication existe
    if (!this.currentPublication) {
      console.error('currentPublication no está definido');
      return;
    }

    // Actualizar el campo de forma segura
    (this.currentPublication as any)[field] = value;
    
    // Detectar cambios inmediatamente
    this.detectFormChanges();
    
    console.log(`✏️ Campo ${field} cambiado a:`, value);
    console.log(`📊 Estado actual - Hay cambios: ${this.hasFormChanged}, Puede guardar: ${this.canSave()}`);
  }

  detectFormChanges(): void {
    if (!this.isEditMode) {
      this.hasFormChanged = true;
      console.log('Modo nuevo - cambios automáticamente detectados');
      return;
    }

    // Verificar que originalPublication existe
    if (!this.originalPublication || !this.currentPublication) {
      this.hasFormChanged = true;
      console.log('Publicaciones no definidas - marcando como cambiado');
      return;
    }

    // Comparar con la publicación original de forma segura
    const hasChanges = (
      (this.currentPublication?.titulo ?? '') !== (this.originalPublication?.titulo ?? '') ||
      (this.currentPublication?.autor ?? '') !== (this.originalPublication?.autor ?? '') ||
      (this.currentPublication?.editorial ?? '') !== (this.originalPublication?.editorial ?? '') ||
      (this.currentPublication?.isbn ?? '') !== (this.originalPublication?.isbn ?? '') ||
      (this.currentPublication?.descripcion ?? '') !== (this.originalPublication?.descripcion ?? '') ||
      (this.currentPublication?.id_categoria ?? 0) !== (this.originalPublication?.id_categoria ?? 0) ||
      (this.currentPublication?.id_estado_libro ?? 0) !== (this.originalPublication?.id_estado_libro ?? 0) ||
      (this.currentPublication?.id_tipo_transaccion ?? 0) !== (this.originalPublication?.id_tipo_transaccion ?? 0) ||
      (this.currentPublication?.precio ?? 0) !== (this.originalPublication?.precio ?? 0) ||
      (this.currentPublication?.numpaginas ?? 0) !== (this.originalPublication?.numpaginas ?? 0) ||
      (this.currentPublication?.disponibilidad ?? 0) !== (this.originalPublication?.disponibilidad ?? 0) ||
      (this.currentPublication?.fecha_publicacion ?? '') !== (this.originalPublication?.fecha_publicacion ?? '') ||
      this.selectedImageFile !== null
    );

    this.hasFormChanged = hasChanges;
    
    console.log('Detectando cambios:', {
      hasChanges,
      titulo: `"${this.currentPublication?.titulo}" vs "${this.originalPublication?.titulo}"`,
      categoria: `${this.currentPublication?.id_categoria} vs ${this.originalPublication?.id_categoria}`,
      transaccion: `${this.currentPublication?.id_tipo_transaccion} vs ${this.originalPublication?.id_tipo_transaccion}`,
      archivo: this.selectedImageFile ? 'Archivo seleccionado' : 'Sin archivo'
    });
  }

  // CARGA Y GESTIÓN DE DATOS
  loadMockPublications() {
    this.ApiService.obtenerLibros().subscribe({
      next: (libros) => {
        this.publications = libros.map((libro: any) => ({
          ...libro,
          portada: libro.portada
            ? `http://localhost:3000${libro.portada}`
            : 'assets/default-cover.jpg',
        }));
        this.applyFilters();
        this.updateStats();
      },
      error: (error) => {
        console.error('Error al obtener libros:', error);
        alert('Error al obtener libros');
      },
    });
  }

  updateStats() {
    this.totalPublications = this.publications.length;

    this.availablePublications = this.publications.filter(
      (pub) => pub.disponibilidad === 1
    ).length;

    this.soldPublications = this.publications.filter(
      (pub) => pub.disponibilidad === 0 && pub.estatus > 0 && pub.estatus === 2
    ).length;

    this.reservedPublications = this.publications.filter(
      (pub) => pub.disponibilidad === 0 && pub.estatus > 0 && pub.estatus === 3
    ).length;
  }

  // MÉTODOS DEL HEADER
  onCategorySelected(category: string) {
    console.log('Categoría seleccionada desde publicaciones:', category);
    this.filterCategory = category.toLowerCase();
    this.applyFilters();
  }

  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde publicaciones:', searchTerm);
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  // FILTROS Y ORDENAMIENTO
  applyFilters() {
    let filtered = [...this.publications];

    /* ---- Filtrar por categoría ---- */
    if (this.filterCategory !== 'todas') {
      filtered = filtered.filter(
        (b) => b.id_categoria === +this.filterCategory
      );
    }

    /* ---- Filtrar por estatus comercial ---- */
    if (this.filterStatus !== 'todos') {
      if (this.filterStatus === 'disponible') {
        filtered = filtered.filter((b) => b.disponibilidad);
      } else if (this.filterStatus === 'vendido') {
        filtered = filtered.filter((b) => !b.disponibilidad && b.estatus === 2);
      } else if (this.filterStatus === 'reservado') {
        filtered = filtered.filter((b) => !b.disponibilidad && b.estatus === 3);
      }
    }

    /* ---- Filtrar por tipo de transacción ---- */
    if (this.filterTransaction !== 'todas') {
      filtered = filtered.filter(
        (b) => b.id_tipo_transaccion === +this.filterTransaction
      );
    }

    /* ---- Búsqueda libre ---- */
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.titulo.toLowerCase().includes(term) ||
          b.autor.toLowerCase().includes(term) ||
          b.editorial.toLowerCase().includes(term) ||
          (b.isbn ?? '').includes(term)
      );
    }

    /* ---- Ordenar ---- */
    filtered = this.sortPublications(filtered);
    this.filteredPublications = filtered;
  }

  sortPublications(publications: Book[]): Book[] {
    return publications.sort((a, b) => {
      switch (this.sortBy) {
        case 'fecha_desc':
          return (
            new Date(b.fecha_publicacion).getTime() -
            new Date(a.fecha_publicacion).getTime()
          );
        case 'fecha_asc':
          return (
            new Date(a.fecha_publicacion).getTime() -
            new Date(b.fecha_publicacion).getTime()
          );
        case 'titulo_asc':
          return a.titulo.localeCompare(b.titulo);
        case 'titulo_desc':
          return b.titulo.localeCompare(a.titulo);
        case 'precio_asc':
          return (a.precio || 0) - (b.precio || 0);
        case 'precio_desc':
          return (b.precio || 0) - (a.precio || 0);
        default:
          return 0;
      }
    });
  }

  changeFilter(filterType: string, value: string) {
    switch (filterType) {
      case 'category':
        this.filterCategory = value;
        break;
      case 'status':
        this.filterStatus = value;
        break;
      case 'transaction':
        this.filterTransaction = value;
        break;
      case 'sort':
        this.sortBy = value;
        break;
    }
    this.applyFilters();
  }

  // GESTIÓN DE MODAL
  openNewPublicationModal() {
    const decoded = this.ApiService.decodificarToken();
    this.currentPublication = { ...this.emptyPublication };
    
    if (decoded && decoded.id) {
      this.currentPublication.id_usuario = Number(decoded.id);
    }
    
    // Para nueva publicación, establecer valores por defecto
    this.currentPublication.id_categoria = 1;
    this.currentPublication.id_estado_libro = 1;
    this.currentPublication.id_tipo_transaccion = 1;
    this.currentPublication.disponibilidad = 1;
    this.currentPublication.estatus = 1;
    
    this.originalPublication = { ...this.emptyPublication };
    this.isEditMode = false;
    this.showNewPublicationModal = true;
    this.selectedImageFile = null;
    this.hasFormChanged = false;
    
    // Prevenir scroll del body
    document.body.classList.add('modal-open');
  }

  openEditPublicationModal(publication: Book): void {
    if (!publication) {
      console.error('No se puede editar: publicación no válida');
      return;
    }

    // Crear copia profunda para la edición
    this.currentPublication = {
      ...publication,
      id_categoria: Number(publication.id_categoria) || 0,
      id_estado_libro: Number(publication.id_estado_libro) || 1,
      id_tipo_transaccion: Number(publication.id_tipo_transaccion) || 0,
      fecha_publicacion: publication.fecha_publicacion?.split('T')[0] ?? '',
      numpaginas: Number(publication.numpaginas) || 0,
      disponibilidad: Number(publication.disponibilidad) || 1,
      precio: Number(publication.precio) || 0,
      portada: publication.portada
        ? publication.portada.startsWith('http')
          ? publication.portada
          : `http://localhost:3000${publication.portada}`
        : 'assets/default-cover.jpg',
    };

    // Guardar copia original para comparar cambios
    this.originalPublication = { ...this.currentPublication };
    
    this.isEditMode = true;
    this.showNewPublicationModal = true;
    this.selectedImageFile = null;
    this.hasFormChanged = false;
    
    // Prevenir scroll del body
    document.body.classList.add('modal-open');

    console.log('Datos cargados para edición:', this.currentPublication);
  }

  closeModal() {
    this.showNewPublicationModal = false;
    this.isEditMode = false;
    this.currentPublication = { ...this.emptyPublication };
    this.originalPublication = { ...this.emptyPublication };
    this.selectedImageFile = null;
    this.hasFormChanged = false;
    
    // Restaurar scroll del body
    document.body.classList.remove('modal-open');
  }

  // VALIDACIÓN
  isFormValid(): boolean {
    // Usar optional chaining y nullish coalescing para evitar errores
    const titulo = this.currentPublication?.titulo?.trim() || '';
    const autor = this.currentPublication?.autor?.trim() || '';
    const editorial = this.currentPublication?.editorial?.trim() || '';
    const descripcion = this.currentPublication?.descripcion?.trim() || '';
    const numpaginas = this.currentPublication?.numpaginas ?? 0;
    const id_categoria = this.currentPublication?.id_categoria ?? 0;
    const id_tipo_transaccion = this.currentPublication?.id_tipo_transaccion ?? 0;
    const id_estado_libro = this.currentPublication?.id_estado_libro ?? 0;
    const disponibilidad = this.currentPublication?.disponibilidad ?? 0;
    const precio = this.currentPublication?.precio ?? 0;

    const isValid = !!(
      titulo &&
      autor &&
      editorial &&
      descripcion &&
      numpaginas > 0 &&
      id_categoria > 0 &&
      id_tipo_transaccion > 0 &&
      id_estado_libro > 0 &&
      disponibilidad > 0
    );

    // Para venta, verificar que tenga precio
    if (id_tipo_transaccion === 1) {
      return isValid && precio > 0;
    }

    return isValid;
  }

  canSave(): boolean {
    // Verificar validez del formulario primero
    if (!this.isFormValid()) {
      return false;
    }
    
    // En modo edición, solo permitir guardar si hay cambios
    if (this.isEditMode) {
      return this.hasFormChanged;
    }
    
    // En modo nuevo, siempre permitir si es válido
    return true;
  }

  // GUARDADO
  savePublication(): void {
    console.log('🚀 Iniciando guardado de publicación...');
    
    if (!this.isFormValid()) {
      alert('❌ Por favor, completa todos los campos obligatorios correctamente.');
      return;
    }

    if (this.isEditMode && !this.hasFormChanged) {
      alert('ℹ️ No hay cambios para guardar.');
      return;
    }

    // Verificar que currentPublication existe
    if (!this.currentPublication) {
      alert('❌ Error: No hay datos para guardar.');
      return;
    }

    console.log('📊 Estado antes de guardar:', {
      isEditMode: this.isEditMode,
      hasFormChanged: this.hasFormChanged,
      bookId: this.currentPublication.id,
      titulo: this.currentPublication.titulo
    });

    // Preparar FormData con verificaciones seguras
    const fd = new FormData();
    fd.append('titulo', this.currentPublication.titulo?.trim() ?? '');
    fd.append('isbn', this.currentPublication.isbn?.trim() ?? '');
    fd.append('autor', this.currentPublication.autor?.trim() ?? '');
    fd.append('editorial', this.currentPublication.editorial?.trim() ?? '');
    fd.append('fecha_publicacion', this.currentPublication.fecha_publicacion ?? '');
    fd.append('id_estado_libro', String(this.currentPublication.id_estado_libro ?? 1));
    fd.append('precio', String(this.currentPublication.precio ?? 0));
    fd.append('descripcion', this.currentPublication.descripcion?.trim() ?? '');
    fd.append('id_usuario', String(this.currentPublication.id_usuario ?? 0));
    fd.append('id_categoria', String(this.currentPublication.id_categoria ?? 1));
    fd.append('disponibilidad', String(this.currentPublication.disponibilidad ?? 1));
    fd.append('estatus', String(this.currentPublication.estatus ?? 1));
    fd.append('id_tipo_transaccion', String(this.currentPublication.id_tipo_transaccion ?? 1));
    fd.append('numpaginas', String(this.currentPublication.numpaginas ?? 0));

    // Solo agregar portada si se seleccionó una nueva
    if (this.selectedImageFile) {
      fd.append('portada', this.selectedImageFile);
      console.log('📷 Archivo de imagen agregado:', this.selectedImageFile.name);
    }

    if (this.isEditMode) {
      // EDITAR LIBRO EXISTENTE
      const bookId = this.currentPublication.id;
      if (!bookId || bookId === 0) {
        alert('❌ Error: ID de libro no válido para edición.');
        return;
      }

      console.log(`📝 Actualizando libro ID: ${bookId}`);

      this.ApiService.actualizarLibro(bookId, fd).subscribe({
        next: (res) => {
          console.log('✅ Respuesta del servidor al actualizar:', res);
          
          if (res) {
            // Encontrar y actualizar el libro en la lista local
            const index = this.publications.findIndex(pub => pub.id === bookId);
            if (index !== -1) {
              // Actualizar con los datos de respuesta
              this.publications[index] = {
                ...this.publications[index],
                ...res,
                portada: res.portada
                  ? `http://localhost:3000${res.portada}`
                  : this.publications[index].portada,
              };
              
              console.log('📖 Libro actualizado en la lista local');
            }
            
            // Actualizar estadísticas y filtros
            this.updateStats();
            this.applyFilters();
            
            // Mostrar mensaje de éxito
            alert('✅ Libro actualizado correctamente');
            
            // Cerrar modal
            this.closeModal();
          } else {
            console.error('❌ Respuesta vacía del servidor');
            alert('❌ Error: Respuesta vacía del servidor.');
          }
        },
        error: (error) => {
          console.error('❌ Error al actualizar libro:', error);
          alert(`❌ Error al actualizar el libro: ${error.message || 'Error desconocido'}`);
        },
      });
    } else {
      // CREAR LIBRO NUEVO
      console.log('📚 Creando nuevo libro');

      this.ApiService.registrarLibro(fd).subscribe({
        next: (res) => {
          console.log('✅ Respuesta del servidor al crear:', res);
          
          if (res) {
            const libroConPortada = {
              ...res,
              portada: res.portada
                ? `http://localhost:3000${res.portada}`
                : 'assets/default-cover.jpg',
            };
            
            // Agregar a la lista
            this.publications.push(libroConPortada);
            console.log('📖 Nuevo libro agregado a la lista');
            
            // Actualizar estadísticas y filtros
            this.updateStats();
            this.applyFilters();
            
            // Mostrar mensaje de éxito
            alert('✅ Libro creado correctamente');
            
            // Cerrar modal
            this.closeModal();
          } else {
            console.error('❌ Respuesta vacía del servidor');
            alert('❌ Error: Respuesta vacía del servidor.');
          }
        },
        error: (error) => {
          console.error('❌ Error al crear libro:', error);
          alert(`❌ Error al crear el libro: ${error.message || 'Error desconocido'}`);
        },
      });
    }
  }

  // ACCIONES SOBRE PUBLICACIONES
  deletePublication(publication: Book) {
    if (
      confirm(`¿Estás seguro de que quieres eliminar "${publication.titulo}"?`)
    ) {
      this.publications = this.publications.filter(
        (pub) => pub.id !== publication.id
      );
      this.updateStats();
      this.applyFilters();
      console.log('Publicación eliminada:', publication);
      alert('🗑️ Publicación eliminada correctamente');
    }
  }

  duplicatePublication(publication: Book) {
    const newId = Math.max(...this.publications.map((pub) => pub.id), 0) + 1;
    const duplicatedPublication = {
      ...publication,
      id: newId,
      titulo: `${publication.titulo} (Copia)`,
      fecha_publicacion: new Date().toISOString().split('T')[0],
    };
    this.publications.push(duplicatedPublication);
    this.updateStats();
    this.applyFilters();
    alert('📋 Publicación duplicada correctamente');
  }

  // MÉTODOS DE UTILIDAD PARA MOSTRAR DATOS
  getStatusText(status: string): string {
    const statuses = {
      disponible: 'Disponible',
      vendido: 'Vendido',
      reservado: 'Reservado',
    };
    return statuses[status as keyof typeof statuses] || status;
  }

  getStatusClass(status: string): string {
    const statusClasses = {
      disponible: 'status-available',
      vendido: 'status-sold',
      reservado: 'status-reserved',
    };
    return statusClasses[status as keyof typeof statusClasses] || '';
  }

  getTransactionText(transaction: string): string {
    const transactions = {
      venta: 'Venta',
      intercambio: 'Intercambio',
      donacion: 'Donación',
    };
    return (
      transactions[transaction as keyof typeof transactions] || transaction
    );
  }

  getTransactionClass(transaction: string): string {
    const transactionClasses = {
      venta: 'transaction-sale',
      intercambio: 'transaction-exchange',
      donacion: 'transaction-donation',
    };
    return (
      transactionClasses[transaction as keyof typeof transactionClasses] || ''
    );
  }

  getCategoryText(category: string): string {
    const categoryMap = this.categoriasMap.find(
      (cat) => cat.value === category
    );
    return categoryMap?.label || category;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  trackByPublicationId(index: number, book: Book): number {
    return book.id;
  }

  // NAVEGACIÓN
  goToDashboard() {
    this.router.navigate(['/saleshome']);
  }

  goToBookDetail(bookId: number): void {
    // Verificación de ID válido
    if (!bookId || bookId <= 0) {
      console.error('ID de libro no válido:', bookId);
      return;
    }

    // Alternativa: Usar optional chaining y buscar en la lista local
    const libroLocal = this.publications.find(pub => pub.id === bookId);
    
    if (libroLocal) {
      console.log('Libro encontrado en lista local:', libroLocal.titulo);
      this.router.navigate(['/book', bookId]);
    } else {
      console.log('Libro no encontrado en lista local, navegando directamente...');
      this.router.navigate(['/book', bookId]);
    }
  }
}