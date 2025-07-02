// ============================================
// 📁 ACTUALIZAR: src/app/save/save.component.ts - ERRORES CORREGIDOS
// ============================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../shared/header/header.component';
import { SavedService } from '../servicios/saved.service';
import { Book } from '../models/Book.model';
import { ApiService } from '../servicios/api.service';
@Component({
  selector: 'app-save',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css'],
})
export class SaveComponent implements OnInit, OnDestroy {
  cartItems = 0;
  savedItems = 0;
  savedBooks: Book[] = [];
  selectedCategory = 'Todas';

  private savedBooksSubscription?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private savedService: SavedService,
    private ApiService: ApiService
  ) {}

  ngOnInit() {
    console.log('SaveComponent: Componente iniciado');

    // Suscribirse a los cambios en libros guardados
    this.savedBooksSubscription = this.savedService.savedBooks$.subscribe(
      (books) => {
        this.savedBooks = books;
        this.savedItems = books.length;
        console.log('Libros guardados actualizados:', books.length);
      }
    );

    // Manejar redirecciones por categorías/búsqueda desde el header
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        console.log('Categoría seleccionada desde saved:', params['category']);
        this.router.navigate(['/home'], {
          queryParams: { category: params['category'] },
          replaceUrl: true,
        });
      }
      if (params['search']) {
        console.log('Búsqueda desde saved:', params['search']);
        this.router.navigate(['/home'], {
          queryParams: { search: params['search'] },
          replaceUrl: true,
        });
      }
    });
  }

  ngOnDestroy() {
    // Limpiar suscripciones
    if (this.savedBooksSubscription) {
      this.savedBooksSubscription.unsubscribe();
    }
  }

  // Filtrar libros por categoría
  get filteredBooks(): Book[] {
    if (this.selectedCategory === 'Todas') {
      return this.savedBooks;
    }
    return this.savedBooks.filter(
      (book) => book.categoria_nombre === this.selectedCategory
    );
  }

  // ✅ CORREGIDO - Obtener categorías disponibles SIN undefined
  get availableCategories(): string[] {
    const categories = new Set(
      this.savedBooks
        .map((book) => book.categoria_nombre)
        .filter(
          (category): category is string =>
            category !== undefined && category !== null
        )
    );
    return Array.from(categories).sort();
  }

  // ✅ NUEVO - Método para contar libros por categoría (usado en template)
  getCategoryCount(category: string): number {
    if (category === 'Todas') {
      return this.savedBooks.length;
    }
    return this.savedBooks.filter((book) => book.categoria_nombre === category)
      .length;
  }

  // Cambiar categoría seleccionada
  onCategorySelected(category: string) {
    console.log('Categoría seleccionada en saved:', category);
    this.selectedCategory = category;
  }

  // Remover libro de guardados
  removeFromSaved(book: Book) {
    this.savedService.removeFromSaved(book.id);
    this.showSuccessMessage(`"${book.titulo}" removido de guardados`);
  }

  // Verificar si un libro está guardado (siempre true en esta página)
  isBookSaved(bookId: number): boolean {
    return this.savedService.isBookSaved(bookId);
  }

  // Agregar al carrito
  addToCart(book: Book) {
    if (book.tipo_transaccion_nombre === 'Venta') {
      this.cartItems++;
      console.log('Libro agregado al carrito:', book.titulo);
      this.showSuccessMessage(`"${book.titulo}" agregado al carrito`);
    }
  }

  // Solicitar libro (donación)
  requestBook(book: Book) {
    console.log('Solicitando donación de libro:', book.titulo);
    this.showSuccessMessage(`Solicitud enviada para: "${book.titulo}"`);
  }

  // Hacer oferta (intercambio)
  makeOffer(book: Book) {
    console.log('Navegando a hacer oferta para:', book.titulo);
    this.router.navigate(['/exchange', book.id, 'offer']);
  }

  // Acción del botón según tipo de transacción
  getButtonAction(book: Book) {
    const tipoTransaccion = book.tipo_transaccion_nombre || 'Venta';

    switch (tipoTransaccion) {
      case 'Venta':
        this.addToCart(book);
        break;
      case 'Donación':
        this.requestBook(book);
        break;
      case 'Intercambio':
        this.makeOffer(book);
        break;
      default:
        this.addToCart(book);
        break;
    }
  }

  // Texto del botón según tipo de transacción
  getButtonText(type: string | undefined): string {
    const tipoTransaccion = type || 'Venta';

    switch (tipoTransaccion) {
      case 'Venta':
        return 'Añadir al carrito';
      case 'Donación':
        return 'Solicitar libro';
      case 'Intercambio':
        return 'Hacer oferta';
      default:
        return 'Añadir al carrito';
    }
  }

  // Ver detalles del libro
  viewBookDetail(book: Book): void {
    console.log('Navegando al detalle del libro:', book.titulo);

    const tipoTransaccion = book.tipo_transaccion_nombre || 'Venta';

    if (tipoTransaccion === 'Venta') {
      this.router.navigate(['/book', book.id]);
    } else if (tipoTransaccion === 'Intercambio') {
      this.router.navigate(['/exchange', book.id]);
    } else if (tipoTransaccion === 'Donación') {
      this.router.navigate(['/donation', book.id]);
    } else {
      this.router.navigate(['/book', book.id]);
    }
  }

  // Ver información del vendedor/propietario
  viewSellerInfo(book: Book): void {
    // Determinar el ID del usuario según el tipo de transacción
    let userId = 1; // Valor por defecto

    // Simular obtención del ID del usuario desde el libro
    if (book.id_usuario) {
      userId = book.id_usuario;
    }

    console.log('Navegando a información del usuario ID:', userId);
    this.router.navigate(['/seller', userId]);
  }

  // Limpiar todos los guardados
  clearAllSaved() {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar todos los libros guardados?'
      )
    ) {
      this.savedService.clearAllSaved();
      this.showSuccessMessage('Todos los libros guardados han sido eliminados');
    }
  }

  // Ir a explorar libros
  goToExplore() {
    this.router.navigate(['/home']);
  }

  // Mostrar mensaje de éxito
  private showSuccessMessage(message: string) {
    console.log('✅', message);
    // TODO: Implementar sistema de notificaciones
  }

  // Manejar búsqueda desde header
  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde saved:', searchTerm);
    this.router.navigate(['/home'], {
      queryParams: { search: searchTerm },
      replaceUrl: true,
    });
  }

  obtenerLibrosGuardados(): Book[] {
    return this.ApiService.obtenerLibros().pipe(
      catchError((error) => {
        console.error('Error al obtener libros guardados:', error);
        return throwError(() => new Error('Error al obtener libros guardados'));
      })
    );
  }
}
