import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesHeaderComponent } from '../sales-header/sales-header.component';
import { ApiService } from '../../servicios/api.service';
import { Book } from '../../models/Book.model';

// Interfaz simplificada para los libros del vendedor

@Component({
  selector: 'app-saleshome',
  standalone: true,
  imports: [CommonModule, FormsModule, SalesHeaderComponent],
  templateUrl: './saleshome.component.html',
  styleUrls: ['./saleshome.component.css'],
})
export class SaleshomeComponent implements OnInit {
  // Variables del vendedor
  vendorBooks: Book[] = [];
  allVendorBooks: Book[] = [];
  selectedCategory = 'Todas';
  showBookDetails = false;
  selectedBook: Book | null = null;

  // Estadísticas del vendedor
  totalBooks = 0;
  activeBooks = 0;
  soldBooks = 0;
  pendingOrders = 5;
  monthlyEarnings = 1250.5;

  // Filtros
  filterStatus = 'Todos'; // Todos, Activos, Vendidos, Pausados
  sortBy = 'fecha_desc'; // fecha_desc, precio_asc, precio_desc, titulo_asc

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ApiService: ApiService
  ) {}

  ngOnInit(): void {
    this.cargarDatosMock();

    // Verificar parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['status']) {
        this.filterStatus = params['status'];
      }
    });
  }

  cargarDatosMock() {
    this.ApiService.obtenerLibros().subscribe({
      next: (libros) => {
        console.log('Libros obtenidos:', libros);
        this.vendorBooks = libros.map((libro: any) => ({
          ...libro,
          portada: libro.portada
            ? `http://localhost:3000${libro.portada}`
            : 'assets/default-cover.jpg',
          estado_libro: libro.estado_libro || 'activo', // Esto garantiza que nunca sea undefined
        }));
        this.allVendorBooks = [...this.vendorBooks]; //   Initialize allVendorBooks
        this.updateStats(); // Update statistics
      },
      error: (error) => {
        console.error('Error al obtener libros:', error);
        alert('Error al obtener libros');
      },
    });
  }

  updateStats() {
    this.totalBooks = this.allVendorBooks.length;
    this.activeBooks = this.allVendorBooks.filter(
      (book) => book.estado_libro === 'activo'
    ).length;
    this.soldBooks = this.allVendorBooks.filter(
      (book) => book.estado_libro === 'vendido'
    ).length;
  }

  // Getter para libros filtrados
  get filteredBooks() {
    let books = this.vendorBooks;

    // Filtrar por categoría
    if (this.selectedCategory !== 'Todas') {
      books = books.filter(
        (book) => book.categoria_nombre === this.selectedCategory
      );
    }

    // Filtrar por estado
    if (this.filterStatus !== 'Todos') {
      const statusMap: { [key: string]: string } = {
        Activos: 'activo',
        Vendidos: 'vendido',
        Pausados: 'pausado',
      };
      books = books.filter(
        (book) => book.estado_libro === statusMap[this.filterStatus]
      );
    }

    // Ordenar
    books = this.sortBooks(books);

    return books;
  }

  sortBooks(books: Book[]): Book[] {
    return books.sort((a, b) => {
      switch (this.sortBy) {
        case 'fecha_desc':
          return (
            new Date(b.fecha_publicacion).getTime() -
            new Date(a.fecha_publicacion).getTime()
          );
        case 'precio_asc':
          return (a.precio || 0) - (b.precio || 0);
        case 'precio_desc':
          return (b.precio || 0) - (a.precio || 0);
        case 'titulo_asc':
          return a.titulo.localeCompare(b.titulo);
        default:
          return 0;
      }
    });
  }

  // Métodos del header
  onCategorySelected(category: string) {
    this.selectedCategory = category;
    this.updateURL();
  }

  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda en mis libros:', searchTerm);
    if (searchTerm) {
      this.vendorBooks = this.allVendorBooks.filter(
        (book) =>
          book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.vendorBooks = this.allVendorBooks;
    }
  }

  // Métodos para gestión de libros (simulados)
  addNewBook() {
    console.log('Agregar nuevo libro');
    alert('🚀 Redirigiendo a formulario de agregar libro...');
    // this.router.navigate(['/add-book']);
  }

  editBook(book: Book) {
    console.log('Editar libro:', book.titulo);
    alert(`✏️ Editando: ${book.titulo}`);
    // this.router.navigate(['/edit-book', book.id]);
  }

  viewBookDetails(book: Book) {
    this.selectedBook = book;
    this.showBookDetails = true;
    console.log('Ver detalles del libro:', book.titulo);
    console.log('Detalles del libro:', book);
  }

  toggleBookStatus(book: Book) {
    const newStatus = book.estado_libro === 'activo' ? 'pausado' : 'activo';
    console.log(`Cambiar estado de "${book.titulo}" a: ${newStatus}`);

    // Simular cambio de estado
    book.estado_libro = newStatus;
    this.updateStats();

    const statusText = newStatus === 'activo' ? 'activado' : 'pausado';
    alert(`📊 "${book.titulo}" ha sido ${statusText}`);
  }

  deleteBook(book: Book) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${book.titulo}"?`)) {
      console.log('Eliminar libro:', book.titulo);

      // Simular eliminación
      this.allVendorBooks = this.allVendorBooks.filter((b) => b.id !== book.id);
      this.vendorBooks = this.allVendorBooks;
      this.updateStats();

      alert(`🗑️ "${book.titulo}" ha sido eliminado`);
    }
  }

  // Métodos de filtrado y ordenamiento
  changeFilter(status: string) {
    this.filterStatus = status;
    this.updateURL();
  }

  changeSorting(sortBy: string) {
    this.sortBy = sortBy;
  }

  updateURL() {
    const queryParams: any = {};

    if (this.selectedCategory !== 'Todas') {
      queryParams.category = this.selectedCategory;
    }

    if (this.filterStatus !== 'Todos') {
      queryParams.status = this.filterStatus;
    }

    this.router.navigate(['/saleshome'], {
      queryParams: Object.keys(queryParams).length > 0 ? queryParams : {},
      replaceUrl: true,
    });
  }

  // Métodos para navegación (simulados)
  goToOrders() {
    console.log('Ir a pedidos');
    alert('📦 Ir a página de pedidos...');
    // this.router.navigate(['/vendor-orders']);
  }

  goToAnalytics() {
    console.log('Ir a analíticas');
    alert('📊 Ir a página de analíticas...');
    // this.router.navigate(['/vendor-analytics']);
  }

  goToProfile() {
    console.log('Ir a perfil de vendedor');
    this.router.navigate(['/seller-profile']);
  }

  closeBookDetails() {
    this.showBookDetails = false;
    this.selectedBook = null;
  }

  // Método para cerrar sesión
  logout() {
    console.log('Cerrando sesión...');
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      // Limpiar cualquier dato de sesión guardado
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      sessionStorage.clear();

      // Redirigir al login
      this.router.navigate(['/login']);

      alert('👋 Sesión cerrada exitosamente');
    }
  }

  // Métodos de utilidad
  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'activo':
        return 'status-active';
      case 'vendido':
        return 'status-sold';
      case 'pausado':
        return 'status-paused';
      default:
        return 'status-default'; // Para manejar undefined o cualquier otro valor no esperado
    }
  }

  getStatusText(status: string | undefined): string {
    // Si el estado es undefined, devolvemos un valor predeterminado
    if (!status) {
      return 'Desconocido'; // O cualquier valor predeterminado que prefieras
    }

    switch (status) {
      case 'activo':
        return 'Activo';
      case 'vendido':
        return 'Vendido';
      case 'pausado':
        return 'Pausado';
      default:
        return 'Desconocido'; // Valor por defecto si no coincide con ninguno
    }
  }

  getEstadoFisicoNombre(id_estado_libro: number): string {
    const map: { [key: number]: string } = {
      1: 'Nuevo',
      2: 'Usado',
      3: 'Desgastado',
    };
    return map[id_estado_libro] || 'Desconocido';
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
}
