// ============================================
// 📁 ACTUALIZAR: src/app/home/home.component.ts - SIN FILTRO DE VENTA
// ============================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../shared/header/header.component';
import { ApiService } from '../servicios/api.service';
import { CartService } from '../servicios/cart.service';
import { Book } from '../models/Book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  cartItems = 0;
  savedItems = 0;
  selectedCategory = 'Todas';
  savedBooksIds: Set<number> = new Set();
  allBooks: Book[] = [];

  private cartSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ApiService: ApiService,
    public cartService: CartService
  ) {
    console.log('🏠 ===== CONSTRUCTOR INICIADO =====');
    console.log('🏠 HomeComponent: Constructor ejecutado');
    console.log('🏠 HomeComponent: CartService existe:', !!this.cartService);
  }

  ngOnInit(): void {
    console.log('🏠 ===== NGONINIT INICIADO =====');

    // Verificar CartService
    if (!this.cartService) {
      console.error('🏠 ngOnInit: ❌ CartService no está disponible!');
      return;
    }

    // Suscribirse al contador del carrito
    console.log('🏠 ngOnInit: Suscribiéndose al cartCount$...');
    this.cartSubscription = this.cartService.cartCount$.subscribe({
      next: (count) => {
        console.log('🏠 ngOnInit: Cart count actualizado a:', count);
        this.cartItems = count;
      },
      error: (error) => {
        console.error('🏠 ngOnInit: Error en suscripción cartCount$:', error);
      }
    });

    // Cargar libros
    this.cargarLibros();

    // Manejar parámetros de URL
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        console.log('🏠 Categoría desde URL:', params['category']);
      }
      if (params['search']) {
        console.log('🏠 Búsqueda desde URL:', params['search']);
      }
    });

    console.log('🏠 ===== NGONINIT TERMINADO =====');
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    console.log('🏠 HomeComponent: Componente destruido');
  }

  cargarLibros(): void {
    console.log('🏠 cargarLibros: Iniciando carga desde API...');
    this.ApiService.obtenerLibros().subscribe({
      next: (libros) => {
        console.log('🏠 cargarLibros: Datos RAW del backend:', libros);
        console.log('🏠 cargarLibros: Cantidad recibida:', libros.length);
        
        this.allBooks = libros.map((libro: any) => ({
          ...libro,
          portada: libro.portada
            ? `http://localhost:3000${libro.portada}`
            : 'assets/default-cover.jpg',
          tipo_transaccion_nombre: libro.tipo_transaccion,
          categoria_nombre: libro.categoria,
        }));
        
        console.log('🏠 cargarLibros: Libros PROCESADOS:', this.allBooks.length);
        console.log('🏠 cargarLibros: Primer libro PROCESADO:', this.allBooks[0]);
        
        // Verificar tipos de libros
        const ventaBooks = this.allBooks.filter(book => book.tipo_transaccion_nombre === 'Venta');
        const donacionBooks = this.allBooks.filter(book => book.tipo_transaccion_nombre === 'Donación');
        const intercambioBooks = this.allBooks.filter(book => book.tipo_transaccion_nombre === 'Intercambio');
        
        console.log('🏠 cargarLibros: Libros de VENTA:', ventaBooks.length);
        console.log('🏠 cargarLibros: Libros de DONACIÓN:', donacionBooks.length);
        console.log('🏠 cargarLibros: Libros de INTERCAMBIO:', intercambioBooks.length);
      },
      error: (error) => {
        console.error('🏠 cargarLibros: Error:', error);
      },
    });
  }

  get books() {
    if (this.selectedCategory === 'Todas') {
      return this.allBooks;
    }
    return this.allBooks.filter(
      (book) => book.categoria_nombre === this.selectedCategory
    );
  }

  // ✨ MÉTODOS DEBUG MANTENIDOS
  logCartItems() {
    console.log('🏠 Items en carrito:', this.cartService?.getCartItems());
  }

  logCartCount() {
    console.log('🏠 Contador de carrito:', this.cartService?.getCartCount());
  }

  getCartServiceStatus(): string {
    return !!this.cartService ? '✅ OK' : '❌ ERROR';
  }

  testCartService() {
    console.log('🏠 ===== TEST CART SERVICE =====');
    console.log('🏠 CartService existe:', !!this.cartService);
    
    if (!this.cartService) {
      console.error('🏠 Test: CartService no disponible');
      alert('❌ CartService no está disponible');
      return;
    }
    
    const testBook = {
      id: 999,
      titulo: 'Libro de Prueba',
      autor: 'Autor Test',
      precio: 100,
      tipo_transaccion_nombre: 'Venta',
      portada: 'test.jpg',
      isbn: 'test-123',
      editorial: 'Editorial Test'
    };
    
    console.log('🏠 Test: Agregando libro de prueba:', testBook);
    
    try {
      this.cartService.addToCart(testBook);
      console.log('🏠 Test: addToCart() ejecutado sin errores');
      
      const items = this.cartService.getCartItems();
      const count = this.cartService.getCartCount();
      console.log('🏠 Test: Items después de agregar:', items);
      console.log('🏠 Test: Count después de agregar:', count);
      
      alert(`✅ Test exitoso! Items: ${count}`);
    } catch (error) {
      console.error('🏠 Test: Error en addToCart:', error);
      alert('❌ Error en test: ' + error);
    }
    
    console.log('🏠 ===== TEST TERMINADO =====');
  }

  getButtonAction(book: any) {
    console.log('🏠 ===== BUTTON ACTION INICIADO =====');
    console.log('🏠 Libro clickeado:', book.titulo);
    console.log('🏠 ID del libro:', book.id);
    console.log('🏠 Tipo de transacción:', book.tipo_transaccion_nombre);
    console.log('🏠 Precio:', book.precio);
    
    const tipoTransaccion = book.tipo_transaccion_nombre || 'Venta';
    console.log('🏠 Tipo normalizado:', tipoTransaccion);

    switch (tipoTransaccion) {
      case 'Venta':
        console.log('🏠 EJECUTANDO: addToCart para venta');
        this.addToCart(book);
        break;
      case 'Donación':
        console.log('🏠 EJECUTANDO: requestBook para donación');
        this.requestBook(book);
        break;
      case 'Intercambio':
        console.log('🏠 EJECUTANDO: makeOffer para intercambio');
        this.makeOffer(book);
        break;
      default:
        console.log('🏠 EJECUTANDO: addToCart por defecto');
        this.addToCart(book);
        break;
    }
    
    console.log('🏠 ===== BUTTON ACTION TERMINADO =====');
  }

  // ✨ MÉTODO SIMPLIFICADO - SIN VALIDACIÓN DE TIPO
  addToCart(book: any) {
    console.log('🏠 ===== ADD TO CART INICIADO =====');
    console.log('🏠 addToCart: Libro recibido:', book.titulo);
    console.log('🏠 addToCart: Tipo de transacción:', book.tipo_transaccion_nombre);
    console.log('🏠 addToCart: CartService disponible:', !!this.cartService);
    
    if (!this.cartService) {
      console.error('🏠 addToCart: ❌ CartService no disponible');
      alert('Error: Servicio de carrito no disponible');
      return;
    }

    // ✨ REMOVIDO: Ya no validamos el tipo de transacción
    console.log('🏠 addToCart: ✅ Sin validaciones de tipo, agregando directamente...');

    try {
      // Estado anterior
      const beforeCount = this.cartService.getCartCount();
      console.log('🏠 addToCart: ANTES - Count:', beforeCount);
      
      // Llamar al servicio
      this.cartService.addToCart(book);
      console.log('🏠 addToCart: ✅ cartService.addToCart() ejecutado');
      
      // Estado posterior
      const afterCount = this.cartService.getCartCount();
      console.log('🏠 addToCart: DESPUÉS - Count:', afterCount);
      
      // Verificar que se agregó
      if (afterCount > beforeCount) {
        console.log('🏠 addToCart: ✅ Libro agregado exitosamente');
        alert(`✅ "${book.titulo}" agregado al carrito`);
      } else {
        console.warn('🏠 addToCart: ⚠️ No se detectó cambio en el contador');
        alert(`⚠️ No se pudo agregar "${book.titulo}"`);
      }
      
    } catch (error) {
      console.error('🏠 addToCart: ❌ Error:', error);
      alert('❌ Error al agregar al carrito: ' + error);
    }
    
    console.log('🏠 ===== ADD TO CART TERMINADO =====');
  }

  // ✨ MÉTODOS SIMPLIFICADOS PARA OTROS TIPOS
  requestBook(book: any) {
    console.log('🏠 Solicitando libro:', book.titulo);
    // ✨ OPCIÓN: También agregar al carrito si lo deseas
    // this.addToCart(book); 
    alert(`Solicitud enviada para: ${book.titulo}`);
  }

  makeOffer(book: any) {
    console.log('🏠 Haciendo oferta para:', book.titulo);
    // ✨ OPCIÓN: También agregar al carrito si lo deseas
    // this.addToCart(book);
    this.router.navigate(['/exchange', book.id, 'offer']);
  }

  // Resto de métodos mantenidos igual...
  onCategorySelected(category: string) {
    this.selectedCategory = category;
    if (category === 'Todas') {
      this.router.navigate(['/home'], { replaceUrl: true });
    } else {
      this.router.navigate(['/home'], {
        queryParams: { category: category },
        replaceUrl: true,
      });
    }
  }

  onCartClicked() {
    this.router.navigate(['/cart']);
  }

  onSearchPerformed(searchTerm: string) {
    this.router.navigate(['/home'], {
      queryParams: { search: searchTerm },
      replaceUrl: true,
    });
  }

  addToSaved(book: Book) {
    const userId = this.ApiService.getUserId();
    if (!userId) {
      console.error('🏠 No se pudo obtener el ID del usuario');
      return;
    }
    
    this.ApiService.agregarLibroMarcador(book.id, userId).subscribe({
      next: (res) => {
        this.savedBooksIds.add(book.id);
        this.savedItems = this.savedBooksIds.size;
        alert(`"${book.titulo}" guardado en favoritos`);
      },
      error: (e) => {
        console.error('🏠 Error al guardar libro:', e);
        alert('Error al guardar el libro en marcadores');
      },
    });
  }

  isBookSaved(bookId: number): boolean {
    return this.savedBooksIds.has(bookId);
  }

  isInCart(bookId: number): boolean {
    return this.cartService ? this.cartService.isInCart(bookId) : false;
  }

  getButtonText(type: string | undefined): string {
    const tipoTransaccion = type || 'Venta';
    switch (tipoTransaccion) {
      case 'Venta': return 'Añadir al carrito';
      case 'Donación': return 'Solicitar libro';
      case 'Intercambio': return 'Hacer oferta';
      default: return 'Añadir al carrito';
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'Todas') {
      this.router.navigate(['/home'], { replaceUrl: true });
    } else {
      this.router.navigate(['/home'], {
        queryParams: { category: category },
        replaceUrl: true,
      });
    }
  }

  viewBookDetail(book: Book): void {
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

  closeDropdownOnOutsideClick(event: Event) {
    // Vacío por ahora
  }
}