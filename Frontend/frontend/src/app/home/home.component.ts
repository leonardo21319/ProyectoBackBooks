// ============================================
// 📁 ACTUALIZAR: src/app/home/home.component.ts - COMPLETO CON PAYMENT
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { ApiService } from '../servicios/api.service';
import { Book } from '../models/Book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  selectedCategory = 'Todas';
  showCartSidebar = false;
  savedBooksIds: Set<number> = new Set();
  cartBooks: any[] = [];
  allBooks: Book[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ApiService: ApiService
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent: Componente iniciado');
    
    // ✨ TEMPORALMENTE COMENTADO - Usar libros de prueba
    // this.obtenerLibros();
    
    // ✨ CARGAR LIBROS DE PRUEBA TEMPORALES
    this.cargarLibrosDePrueba();

    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        console.log('Categoría desde URL:', params['category']);
      }
      if (params['search']) {
        console.log('Búsqueda desde URL:', params['search']);
      }
    });
  }

  // ✨ MÉTODO TEMPORAL PARA LIBROS DE PRUEBA
  cargarLibrosDePrueba(): void {
    this.allBooks = [
      {
        id: 1,
        titulo: "Drácula",
        isbn: "9786254449970",
        autor: "Bram Stoker",
        editorial: "Pinky Penguin",
        fecha_publicacion: "1897-05-26",
        id_estado_libro: 1,
        precio: 190.00,
        descripcion: "Una obra maestra del género gótico. La historia se desarrolla a través de cartas, diarios y recortes de periódicos.",
        portada: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'><rect width='200' height='300' fill='%23f0f8ff'/><circle cx='100' cy='150' r='40' fill='%236A93B2'/><text x='100' y='250' font-family='Arial' font-size='12' text-anchor='middle' fill='%232F4653'>Drácula</text></svg>",
        id_usuario: 1,
        id_categoria: 1,
        disponibilidad: 0,
        estatus: 1,
        id_tipo_transaccion: 1,
        categoria_nombre: "Literatura",
        estado_libro: "Usado",
        tipo_transaccion_nombre: "Venta"
      },
      {
        id: 2,
        titulo: "Fundamentos de programación Java",
        isbn: "9788441539580",
        autor: "Varios Autores",
        editorial: "ANAYA Multimedia",
        fecha_publicacion: "2023-01-15",
        id_estado_libro: 1,
        precio: 0,
        descripcion: "Manual completo para aprender programación en Java desde cero. Incluye conceptos básicos y ejercicios prácticos.",
        portada: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'><rect width='200' height='300' fill='%23e6f3ff'/><circle cx='100' cy='150' r='40' fill='%23007bff'/><text x='100' y='240' font-family='Arial' font-size='10' text-anchor='middle' fill='%232F4653'>Java</text><text x='100' y='255' font-family='Arial' font-size='10' text-anchor='middle' fill='%232F4653'>Programming</text></svg>",
        id_usuario: 2,
        id_categoria: 3,
        disponibilidad: 1,
        estatus: 1,
        id_tipo_transaccion: 2,
        categoria_nombre: "Ciencias y tecnología",
        estado_libro: "Nuevo",
        tipo_transaccion_nombre: "Donación"
      },
      {
        id: 3,
        titulo: "El Arte de la Guerra",
        isbn: "9788441421240",
        autor: "Sun Tzu",
        editorial: "EDAF",
        fecha_publicacion: "2020-03-10",
        id_estado_libro: 2,
        precio: 0,
        descripcion: "Tratado sobre estrategia militar escrito por Sun Tzu en el siglo VI a.C. Influye en el pensamiento militar y empresarial.",
        portada: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'><rect width='200' height='300' fill='%23fff5e6'/><circle cx='100' cy='150' r='40' fill='%23fd7e14'/><text x='100' y='245' font-family='Arial' font-size='11' text-anchor='middle' fill='%232F4653'>El Arte de</text><text x='100' y='260' font-family='Arial' font-size='11' text-anchor='middle' fill='%232F4653'>la Guerra</text></svg>",
        id_usuario: 3,
        id_categoria: 2,
        disponibilidad: 0,
        estatus: 1,
        id_tipo_transaccion: 3,
        categoria_nombre: "Historia y filosofía",
        estado_libro: "Usado",
        tipo_transaccion_nombre: "Intercambio"
      },
      {
        id: 4,
        titulo: "El Señor de los Anillos",
        isbn: "9788445000663",
        autor: "J.R.R. Tolkien",
        editorial: "Minotauro",
        fecha_publicacion: "1954-07-29",
        id_estado_libro: 1,
        precio: 350.00,
        descripcion: "La Comunidad del Anillo es la primera parte de El Señor de los Anillos, la gran obra de J.R.R. Tolkien.",
        portada: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'><rect width='200' height='300' fill='%23f0f8ff'/><circle cx='100' cy='150' r='40' fill='%236A93B2'/><text x='100' y='240' font-family='Arial' font-size='10' text-anchor='middle' fill='%232F4653'>El Señor de</text><text x='100' y='255' font-family='Arial' font-size='10' text-anchor='middle' fill='%232F4653'>los Anillos</text></svg>",
        id_usuario: 3,
        id_categoria: 1,
        disponibilidad: 0,
        estatus: 1,
        id_tipo_transaccion: 1,
        categoria_nombre: "Literatura",
        estado_libro: "Nuevo",
        tipo_transaccion_nombre: "Venta"
      },
      {
        id: 5,
        titulo: "Cien años de soledad",
        isbn: "9788437604947",
        autor: "Gabriel García Márquez",
        editorial: "Cátedra",
        fecha_publicacion: "1967-06-05",
        id_estado_libro: 2,
        precio: 280.00,
        descripcion: "La historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.",
        portada: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'><rect width='200' height='300' fill='%23f0f8ff'/><circle cx='100' cy='150' r='40' fill='%236A93B2'/><text x='100' y='240' font-family='Arial' font-size='9' text-anchor='middle' fill='%232F4653'>Cien años de</text><text x='100' y='255' font-family='Arial' font-size='9' text-anchor='middle' fill='%232F4653'>soledad</text></svg>",
        id_usuario: 2,
        id_categoria: 1,
        disponibilidad: 0,
        estatus: 1,
        id_tipo_transaccion: 1,
        categoria_nombre: "Literatura",
        estado_libro: "Usado",
        tipo_transaccion_nombre: "Venta"
      }
    ];
    
    console.log('HomeComponent: Libros de prueba cargados:', this.allBooks.length);
  }

  // ✨ MÉTODO ORIGINAL COMENTADO TEMPORALMENTE
  /*
  obtenerLibros() {
    console.log('HomeComponent: Obteniendo libros');
    this.ApiService.obtenerLibros().subscribe(
      (data: Book[]) => {
        this.allBooks = data.map((book: Book) => {
          const portadaBase64 = this.bufferToBase64(book.portada);
          return {
            ...book,
            portada: portadaBase64,
          };
        });
        console.log('HomeComponent: Libros obtenidos:', this.allBooks.length);
      },
      (error) => {
        console.error('Error al obtener los libros:', error);
      }
    );
  }

  bufferToBase64(buffer: any): string {
    if (buffer && buffer.data) {
      return `data:image/png;base64,${Buffer.from(buffer.data).toString(
        'base64'
      )}`;
    }
    return '';
  }
  */

  get books() {
    if (this.selectedCategory === 'Todas') {
      return this.allBooks;
    }
    return this.allBooks.filter(
      (book) => book.categoria_nombre === this.selectedCategory
    );
  }

  onCategorySelected(category: string) {
    console.log('HomeComponent: Categoría seleccionada desde header:', category);
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
    this.toggleCartSidebar();
  }

  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde header:', searchTerm);
    
    this.router.navigate(['/home'], {
      queryParams: { search: searchTerm },
      replaceUrl: true,
    });
  }

  addToCart(book: any) {
    console.log('HomeComponent: Añadiendo al carrito:', book.titulo);
    const existingBook = this.cartBooks.find((item) => item.id === book.id);
    if (existingBook) {
      existingBook.quantity += 1;
    } else {
      this.cartBooks.push({
        ...book,
        quantity: 1,
      });
    }
    this.cartItems = this.cartBooks.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  removeFromCart(book: any) {
    const index = this.cartBooks.findIndex((item) => item.id === book.id);
    if (index > -1) {
      this.cartBooks.splice(index, 1);
      this.cartItems = this.cartBooks.reduce(
        (total, item) => total + item.quantity,
        0
      );
    }
  }

  updateQuantity(book: any, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(book);
    } else {
      const cartBook = this.cartBooks.find((item) => item.id === book.id);
      if (cartBook) {
        cartBook.quantity = quantity;
        this.cartItems = this.cartBooks.reduce(
          (total, item) => total + item.quantity,
          0
        );
      }
    }
  }

  getCartSubtotal(): number {
    return this.cartBooks.reduce(
      (total, item) => total + (item.precio || 0) * item.quantity,
      0
    );
  }

  toggleCartSidebar() {
    this.showCartSidebar = !this.showCartSidebar;
  }

  closeCartSidebar() {
    this.showCartSidebar = false;
  }

  addToSaved(book: any) {
    if (this.isBookSaved(book.id)) {
      this.savedBooksIds.delete(book.id);
      this.savedItems = this.savedBooksIds.size;
    } else {
      this.savedBooksIds.add(book.id);
      this.savedItems = this.savedBooksIds.size;
    }
  }

  isBookSaved(bookId: number): boolean {
    return this.savedBooksIds.has(bookId);
  }

  closeDropdownOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.cart-sidebar') &&
      !target.closest('.nav-item-figma')
    ) {
      this.showCartSidebar = false;
    }
  }

  requestBook(book: any) {
    console.log('Solicitando donación de libro:', book.titulo);
    alert(`Solicitud enviada para: ${book.titulo}`);
  }

  makeOffer(book: any) {
    console.log('Hacer oferta para:', book.titulo);
    alert(`Función de intercambio para "${book.titulo}" próximamente disponible`);
  }

  getButtonAction(book: any) {
    console.log('HomeComponent: Acción para libro tipo:', book.tipo_transaccion_nombre);
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

  selectCategory(category: string) {
    console.log('HomeComponent: Categoría seleccionada directamente:', category);
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
    console.log('Navegando al detalle del libro:', book.titulo, 'Tipo:', book.tipo_transaccion_nombre);
    
    const tipoTransaccion = book.tipo_transaccion_nombre || 'Venta';
    
    if (tipoTransaccion === 'Venta') {
      this.router.navigate(['/book', book.id]);
    } else if (tipoTransaccion === 'Intercambio') {
      this.router.navigate(['/exchange', book.id]);
    } else if (tipoTransaccion === 'Donación') {
      this.router.navigate(['/donation', book.id]);
    } else {
      console.warn('Tipo de libro no reconocido:', tipoTransaccion);
      this.router.navigate(['/book', book.id]);
    }
  }

  goToCartPage() {
    this.closeCartSidebar();
    this.router.navigate(['/cart']);
    console.log('Navegando a la página completa del carrito');
  }

  // ✨ NUEVO MÉTODO - Ir directamente a pago desde el sidebar
  goToPayment() {
    console.log('Navegando directamente a pago desde sidebar');
    this.closeCartSidebar();
    this.router.navigate(['/payment']);
  }

  goToOrders() {
    console.log('Ir a Mis pedidos desde home');
    this.router.navigate(['/profile'], {
      queryParams: { section: 'Mis pedidos' },
    });
  }
}