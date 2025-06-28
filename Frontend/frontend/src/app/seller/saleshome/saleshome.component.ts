import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesHeaderComponent } from '../sales-header/sales-header.component';

import { Book } from '../../models/Book.model';

// Interfaz simplificada para los libros del vendedor
interface VendorBook {
  id: number;
  titulo: string;
  autor: string;
  descripcion: string;
  precio: number;
  categoria_nombre: string;
  tipo_transaccion_nombre: string;
  portada: string;
  estado: 'activo' | 'vendido' | 'pausado';
  fecha_creacion: string;
  ventas?: number;
}

@Component({
  selector: 'app-saleshome',
  standalone: true,
  imports: [CommonModule, FormsModule, SalesHeaderComponent],
  templateUrl: './saleshome.component.html',
  styleUrls: ['./saleshome.component.css'],
})
export class SaleshomeComponent implements OnInit {
  // Variables del vendedor
  vendorBooks: VendorBook[] = [];
  allVendorBooks: VendorBook[] = [];
  selectedCategory = 'Todas';
  showBookDetails = false;
  selectedBook: VendorBook | null = null;

  // Estadísticas del vendedor
  totalBooks = 0;
  activeBooks = 0;
  soldBooks = 0;
  pendingOrders = 5;
  monthlyEarnings = 1250.50;

  // Filtros
  filterStatus = 'Todos'; // Todos, Activos, Vendidos, Pausados
  sortBy = 'fecha_desc'; // fecha_desc, precio_asc, precio_desc, titulo_asc

  constructor(
    private router: Router,
    private route: ActivatedRoute
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
    // Datos de ejemplo para el vendedor
    this.allVendorBooks = [
      {
        id: 1,
        titulo: 'Cien Años de Soledad',
        autor: 'Gabriel García Márquez',
        descripcion: 'Una obra maestra del realismo mágico que narra la historia de la familia Buendía.',
        precio: 299.99,
        categoria_nombre: 'Literatura',
        tipo_transaccion_nombre: 'Venta',
        portada: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
        estado: 'activo' as const,
        fecha_creacion: '2024-05-15',
        ventas: 3
      },
      {
        id: 2,
        titulo: 'El Principito',
        autor: 'Antoine de Saint-Exupéry',
        descripcion: 'Un cuento poético que ha conquistado a lectores de todas las edades.',
        precio: 189.50,
        categoria_nombre: 'Infantil',
        tipo_transaccion_nombre: 'Venta',
        portada: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
        estado: 'vendido' as const,
        fecha_creacion: '2024-04-20',
        ventas: 5
      },
      {
        id: 3,
        titulo: 'Sapiens',
        autor: 'Yuval Noah Harari',
        descripcion: 'Una breve historia de la humanidad desde los orígenes hasta el presente.',
        precio: 0,
        categoria_nombre: 'Historia',
        tipo_transaccion_nombre: 'Donación',
        portada: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
        estado: 'activo' as const,
        fecha_creacion: '2024-06-01',
        ventas: 0
      },
      {
        id: 4,
        titulo: '1984',
        autor: 'George Orwell',
        descripcion: 'Una distopía sobre el totalitarismo y la manipulación del poder.',
        precio: 245.00,
        categoria_nombre: 'Ciencia Ficción',
        tipo_transaccion_nombre: 'Intercambio',
        portada: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop',
        estado: 'pausado' as const,
        fecha_creacion: '2024-03-10',
        ventas: 1
      },
      {
        id: 5,
        titulo: 'Don Quijote de la Mancha',
        autor: 'Miguel de Cervantes',
        descripcion: 'Las aventuras del ingenioso hidalgo que luchó contra molinos de viento.',
        precio: 359.99,
        categoria_nombre: 'Literatura',
        tipo_transaccion_nombre: 'Venta',
        portada: 'https://images.unsplash.com/photo-1521123845560-14093637aa5d?w=300&h=400&fit=crop',
        estado: 'activo' as const,
        fecha_creacion: '2024-06-10',
        ventas: 2
      },
      {
        id: 6,
        titulo: 'El Arte de la Guerra',
        autor: 'Sun Tzu',
        descripcion: 'Estrategias militares aplicables a los negocios y la vida.',
        precio: 199.00,
        categoria_nombre: 'Filosofía',
        tipo_transaccion_nombre: 'Venta',
        portada: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
        estado: 'vendido' as const,
        fecha_creacion: '2024-02-28',
        ventas: 4
      }
    ];

    this.vendorBooks = this.allVendorBooks;
    this.updateStats();
    console.log('Datos mock cargados:', this.allVendorBooks);
  }

  updateStats() {
    this.totalBooks = this.allVendorBooks.length;
    this.activeBooks = this.allVendorBooks.filter(book => book.estado === 'activo').length;
    this.soldBooks = this.allVendorBooks.filter(book => book.estado === 'vendido').length;
  }

  // Getter para libros filtrados
  get filteredBooks() {
    let books = this.allVendorBooks;

    // Filtrar por categoría
    if (this.selectedCategory !== 'Todas') {
      books = books.filter(book => book.categoria_nombre === this.selectedCategory);
    }

    // Filtrar por estado
    if (this.filterStatus !== 'Todos') {
      const statusMap: { [key: string]: string } = {
        'Activos': 'activo',
        'Vendidos': 'vendido',
        'Pausados': 'pausado'
      };
      books = books.filter(book => book.estado === statusMap[this.filterStatus]);
    }

    // Ordenar
    books = this.sortBooks(books);

    return books;
  }

  sortBooks(books: VendorBook[]): VendorBook[] {
    return books.sort((a, b) => {
      switch (this.sortBy) {
        case 'fecha_desc':
          return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
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
      this.vendorBooks = this.allVendorBooks.filter(book =>
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

  editBook(book: VendorBook) {
    console.log('Editar libro:', book.titulo);
    alert(`✏️ Editando: ${book.titulo}`);
    // this.router.navigate(['/edit-book', book.id]);
  }

  viewBookDetails(book: VendorBook) {
    this.selectedBook = book;
    this.showBookDetails = true;
    console.log('Ver detalles del libro:', book.titulo);
  }

  toggleBookStatus(book: VendorBook) {
    const newStatus = book.estado === 'activo' ? 'pausado' : 'activo';
    console.log(`Cambiar estado de "${book.titulo}" a: ${newStatus}`);
    
    // Simular cambio de estado
    book.estado = newStatus;
    this.updateStats();
    
    const statusText = newStatus === 'activo' ? 'activado' : 'pausado';
    alert(`📊 "${book.titulo}" ha sido ${statusText}`);
  }

  deleteBook(book: VendorBook) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${book.titulo}"?`)) {
      console.log('Eliminar libro:', book.titulo);
      
      // Simular eliminación
      this.allVendorBooks = this.allVendorBooks.filter(b => b.id !== book.id);
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
    alert('👤 Ir a perfil de vendedor...');
    // this.router.navigate(['/vendor-profile']);
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
  getStatusClass(status: string): string {
    switch (status) {
      case 'activo':
        return 'status-active';
      case 'vendido':
        return 'status-sold';
      case 'pausado':
        return 'status-paused';
      default:
        return 'status-default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'activo':
        return 'Activo';
      case 'vendido':
        return 'Vendido';
      case 'pausado':
        return 'Pausado';
      default:
        return status;
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}