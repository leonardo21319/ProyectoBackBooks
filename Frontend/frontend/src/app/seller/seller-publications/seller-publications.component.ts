// seller/seller-publications/seller-publications.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesHeaderComponent } from '../sales-header/sales-header.component';

interface Publication {
  id: number;
  titulo: string;
  autor: string;
  editorial: string;
  isbn: string;
  portada: string;
  categoria: 'ficcion' | 'no_ficcion' | 'academico' | 'infantil' | 'comic' | 'revista';
  estado: 'disponible' | 'vendido' | 'reservado';
  transaccion: 'venta' | 'intercambio' | 'donacion';
  precio?: number;
  descripcion: string;
  numPaginas: number;
  fechaPublicacion: string;
}

@Component({
  selector: 'app-seller-publications',
  standalone: true,
  imports: [CommonModule, FormsModule, SalesHeaderComponent],
  templateUrl: './seller-publications.component.html',
  styleUrls: ['./seller-publications.component.css'],
})
export class SellerPublicationsComponent implements OnInit {
  publications: Publication[] = [];
  filteredPublications: Publication[] = [];
  currentPublication: Publication = this.emptyPublication;
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

  // Categorías disponibles
  categories = [
    { value: 'ficcion', label: 'Ficción' },
    { value: 'no_ficcion', label: 'No Ficción' },
    { value: 'academico', label: 'Académico' },
    { value: 'infantil', label: 'Infantil' },
    { value: 'comic', label: 'Cómic' },
    { value: 'revista', label: 'Revista' }
  ];

  get emptyPublication(): Publication {
    return {
      id: 0,
      titulo: '',
      autor: '',
      editorial: '',
      isbn: '',
      portada: '',
      categoria: 'ficcion',
      estado: 'disponible',
      transaccion: 'venta',
      precio: 0,
      descripcion: '',
      numPaginas: 0,
      fechaPublicacion: ''
    };
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockPublications();
    this.updateStats();
    this.applyFilters();
  }

  loadMockPublications() {
    this.publications = [
      {
        id: 1,
        titulo: 'Cien Años de Soledad',
        autor: 'Gabriel García Márquez',
        editorial: 'Editorial Sudamericana',
        isbn: '9780307474728',
        portada: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
        categoria: 'ficcion',
        estado: 'disponible',
        transaccion: 'venta',
        precio: 250,
        descripcion: 'Una obra maestra del realismo mágico que narra la historia de la familia Buendía.',
        numPaginas: 417,
        fechaPublicacion: '2024-06-10'
      },
      {
        id: 2,
        titulo: 'El Arte de la Guerra',
        autor: 'Sun Tzu',
        editorial: 'Planeta',
        isbn: '9788441414259',
        portada: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
        categoria: 'no_ficcion',
        estado: 'vendido',
        transaccion: 'venta',
        precio: 180,
        descripcion: 'Tratado militar clásico sobre estrategia y táctica.',
        numPaginas: 320,
        fechaPublicacion: '2024-06-08'
      },
      {
        id: 3,
        titulo: 'Sapiens',
        autor: 'Yuval Noah Harari',
        editorial: 'Debate',
        isbn: '9788499926223',
        portada: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
        categoria: 'no_ficcion',
        estado: 'disponible',
        transaccion: 'intercambio',
        descripcion: 'Una breve historia de la humanidad desde la aparición del Homo sapiens.',
        numPaginas: 512,
        fechaPublicacion: '2024-06-05'
      },
      {
        id: 4,
        titulo: '1984',
        autor: 'George Orwell',
        editorial: 'Penguin Classics',
        isbn: '9788499890944',
        portada: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop',
        categoria: 'ficcion',
        estado: 'reservado',
        transaccion: 'venta',
        precio: 200,
        descripcion: 'Novela distópica sobre un futuro totalitario.',
        numPaginas: 328,
        fechaPublicacion: '2024-06-03'
      }
    ];
  }

  updateStats() {
    this.totalPublications = this.publications.length;
    this.availablePublications = this.publications.filter(pub => pub.estado === 'disponible').length;
    this.soldPublications = this.publications.filter(pub => pub.estado === 'vendido').length;
    this.reservedPublications = this.publications.filter(pub => pub.estado === 'reservado').length;
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

  // Filtros y búsqueda
  applyFilters() {
    let filtered = [...this.publications];

    // Filtrar por categoría
    if (this.filterCategory !== 'todas') {
      filtered = filtered.filter(pub => pub.categoria === this.filterCategory);
    }

    // Filtrar por estado
    if (this.filterStatus !== 'todos') {
      filtered = filtered.filter(pub => pub.estado === this.filterStatus);
    }

    // Filtrar por tipo de transacción
    if (this.filterTransaction !== 'todas') {
      filtered = filtered.filter(pub => pub.transaccion === this.filterTransaction);
    }

    // Filtrar por búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter(pub => 
        pub.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pub.autor.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pub.editorial.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pub.isbn.includes(this.searchTerm)
      );
    }

    // Ordenar
    filtered = this.sortPublications(filtered);

    this.filteredPublications = filtered;
  }

  sortPublications(publications: Publication[]): Publication[] {
    return publications.sort((a, b) => {
      switch (this.sortBy) {
        case 'fecha_desc':
          return new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime();
        case 'fecha_asc':
          return new Date(a.fechaPublicacion).getTime() - new Date(b.fechaPublicacion).getTime();
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
    this.currentPublication = { ...this.emptyPublication };
    this.isEditMode = false;
    this.showNewPublicationModal = true;
  }

  openEditPublicationModal(publication: Publication) {
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
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (this.isEditMode) {
      // Actualizar publicación existente
      const index = this.publications.findIndex(pub => pub.id === this.currentPublication.id);
      if (index !== -1) {
        this.publications[index] = { ...this.currentPublication };
        console.log('Publicación actualizada:', this.currentPublication);
        alert('✅ Publicación actualizada correctamente');
      }
    } else {
      // Crear nueva publicación
      const newId = Math.max(...this.publications.map(pub => pub.id), 0) + 1;
      const newPublication = { ...this.currentPublication, id: newId };
      this.publications.push(newPublication);
      console.log('Nueva publicación creada:', newPublication);
      alert('✅ Publicación creada correctamente');
    }

    this.updateStats();
    this.applyFilters();
    this.closeModal();
  }

  deletePublication(publication: Publication) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${publication.titulo}"?`)) {
      this.publications = this.publications.filter(pub => pub.id !== publication.id);
      this.updateStats();
      this.applyFilters();
      console.log('Publicación eliminada:', publication);
      alert('🗑️ Publicación eliminada correctamente');
    }
  }

  duplicatePublication(publication: Publication) {
    const newId = Math.max(...this.publications.map(pub => pub.id), 0) + 1;
    const duplicatedPublication = { 
      ...publication, 
      id: newId, 
      titulo: `${publication.titulo} (Copia)`,
      fechaPublicacion: new Date().toISOString().split('T')[0]
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
      this.currentPublication.isbn &&
      this.currentPublication.categoria &&
      this.currentPublication.estado &&
      this.currentPublication.transaccion &&
      this.currentPublication.descripcion &&
      this.currentPublication.numPaginas > 0
    );
  }

  // Métodos de utilidad
  getStatusText(status: string): string {
    const statuses = {
      'disponible': 'Disponible',
      'vendido': 'Vendido',
      'reservado': 'Reservado'
    };
    return statuses[status as keyof typeof statuses] || status;
  }

  getStatusClass(status: string): string {
    const statusClasses = {
      'disponible': 'status-available',
      'vendido': 'status-sold',
      'reservado': 'status-reserved'
    };
    return statusClasses[status as keyof typeof statusClasses] || '';
  }

  getTransactionText(transaction: string): string {
    const transactions = {
      'venta': 'Venta',
      'intercambio': 'Intercambio',
      'donacion': 'Donación'
    };
    return transactions[transaction as keyof typeof transactions] || transaction;
  }

  getTransactionClass(transaction: string): string {
    const transactionClasses = {
      'venta': 'transaction-sale',
      'intercambio': 'transaction-exchange',
      'donacion': 'transaction-donation'
    };
    return transactionClasses[transaction as keyof typeof transactionClasses] || '';
  }

  getCategoryText(category: string): string {
    const categoryMap = this.categories.find(cat => cat.value === category);
    return categoryMap?.label || category;
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

  trackByPublicationId(index: number, publication: Publication): number {
    return publication.id;
  }

  // Navegación
  goToDashboard() {
    this.router.navigate(['/saleshome']);
  }

  goToBookDetail(bookId: number) {
    this.router.navigate(['/book', bookId]);
  }

  // Manejo de imagen
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Aquí normalmente subirías la imagen a un servidor
      // Por ahora solo simularemos con una URL
      this.currentPublication.portada = 'https://via.placeholder.com/300x400?text=Nueva+Imagen';
      console.log('Imagen seleccionada:', file.name);
    }
  }
}