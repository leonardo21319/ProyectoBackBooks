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
  isEditMode = false;

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
      id_usuario: 0, // <- Asegúrate de establecer dinámicamente el ID del usuario autenticado
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

  getCategoryName(id: number): string {
    return this.categoriasMap.find((c) => c.id === id)?.label || 'N/D';
  }
  getTransactionName(id: number): string {
    return this.transaccionesMap.find((t) => t.id === id)?.label || 'N/D';
  }
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

  getEstadoFisicoNombre(id_estado_libro: number): string {
    const map: { [key: number]: string } = {
      1: 'Nuevo',
      2: 'Usado',
      3: 'Desgastado',
    };
    return map[id_estado_libro] || 'Desconocido';
  }

  // Métodos del header
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

  applyFilters() {
    let filtered = [...this.publications];

    /* ---- Filtrar por categoría ---- */
    if (this.filterCategory !== 'todas') {
      filtered = filtered.filter(
        (b) => b.id_categoria === +this.filterCategory /* number vs string */
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

  // Gestión de publicaciones
  openNewPublicationModal() {
    const decoded = this.ApiService.decodificarToken();
    this.currentPublication = { ...this.emptyPublication };
    if (decoded && decoded.id) {
      this.currentPublication.id_usuario = Number(decoded.id);
    }
    this.isEditMode = false;
    this.showNewPublicationModal = true;
  }

  openEditPublicationModal(publication: Book) {
    this.currentPublication = { ...publication };
    this.isEditMode = true;
    this.showNewPublicationModal = true;
  }

  closeModal() {
    this.showNewPublicationModal = false;
    this.isEditMode = false;
    this.currentPublication = { ...this.emptyPublication };
  }

  savePublication() {
    if (!this.isFormValid()) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const fd = new FormData();
    fd.append('titulo', this.currentPublication.titulo);
    fd.append('isbn', this.currentPublication.isbn ?? '');
    fd.append('autor', this.currentPublication.autor);
    fd.append('editorial', this.currentPublication.editorial);
    fd.append('fecha_publicacion', this.currentPublication.fecha_publicacion);
    fd.append(
      'id_estado_libro',
      String(this.currentPublication.id_estado_libro)
    );
    fd.append('precio', String(this.currentPublication.precio));
    fd.append('descripcion', this.currentPublication.descripcion);
    fd.append('id_usuario', String(this.currentPublication.id_usuario));
    fd.append('id_categoria', String(this.currentPublication.id_categoria));
    fd.append(
      'disponibilidad',
      this.currentPublication.disponibilidad ? '1' : '0'
    );
    fd.append('estatus', String(this.currentPublication.estatus));
    fd.append(
      'id_tipo_transaccion',
      String(this.currentPublication.id_tipo_transaccion)
    );
    fd.append('numpaginas', String(this.currentPublication.numpaginas || 0));

    if (this.selectedImageFile) {
      fd.append('portada', this.selectedImageFile); // nombre 'portada' debe coincidir con upload.single('portada')
    }

    this.ApiService.registrarLibro(fd).subscribe({
      next: (res) => {
        alert('Libro registrado correctamente');
        this.publications.push(res);
        this.updateStats();
        this.applyFilters();
        this.closeModal();
      },
      error: (e) => {
        console.error('Error al registrar libro:', e);
        alert('Error al registrar el libro.');
      },
    });
  }

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
      fechaPublicacion: new Date().toISOString().split('T')[0],
    };
    this.publications.push(duplicatedPublication);
    this.updateStats();
    this.applyFilters();
    alert('📋 Publicación duplicada correctamente');
  }
  isFormValid(): boolean {
    return !!(
      this.currentPublication.titulo &&
      this.currentPublication.autor &&
      this.currentPublication.editorial &&
      this.currentPublication.descripcion &&
      this.currentPublication.numpaginas &&
      this.currentPublication.id_categoria &&
      this.currentPublication.id_tipo_transaccion
    );
  }

  // Métodos de utilidad
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

  // Navegación
  goToDashboard() {
    this.router.navigate(['/saleshome']);
  }

  goToBookDetail(bookId: number) {
    const libro = this.ApiService.obtenerLibroPorId(bookId);
    console.log('Libro encontrado:', libro);
    if (!libro) {
      console.error('Libro no encontrado con ID:', bookId);
      return;
    }
    this.router.navigate(['/book', bookId]);
  }

  selectedImageFile: File | null = null;

  // Manejo de imagen
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;

      // Opcional: mostrar vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentPublication.portada = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
