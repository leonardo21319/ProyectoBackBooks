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

    this.cargarLibros();

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

  cargarLibros(): void {
    this.ApiService.obtenerLibros().subscribe({
      next: (libros) => {
        console.log('Libros obtenidos:', libros);
        this.allBooks = libros.map((libro: any) => ({
          ...libro,
          portada: libro.portada
            ? `http://localhost:3000${libro.portada}`
            : 'assets/default-cover.jpg',
          tipo_transaccion_nombre: libro.tipo_transaccion,
          categoria_nombre: libro.categoria,
        }));
        console.log('Total de libros cargados:', this.allBooks.length);
      },
      error: () => {
        this.router.navigate(['/home']);
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

  onCategorySelected(category: string) {
    console.log(
      'HomeComponent: Categoría seleccionada desde header:',
      category
    );
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

  addToSaved(book: Book) {
    const userId = this.ApiService.getUserId();
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario');
      return;
    }
    console.log('Guardando libro en marcadores:', book.titulo);
    this.ApiService.agregarLibroMarcador(book.id, userId).subscribe({
      next: (res) => {
        console.log('Libro guardado en marcadores:', res);
        this.savedBooksIds.add(book.id);
      },
      error: (e) => {
        console.error('Error al guardar libro en marcadores:', e);
        alert('Error al guardar el libro en marcadores. Inténtalo de nuevo.');
      },
    });
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
    alert(
      `Función de intercambio para "${book.titulo}" próximamente disponible`
    );
  }

  getButtonAction(book: any) {
    console.log(
      'HomeComponent: Acción para libro tipo:',
      book.tipo_transaccion_nombre
    );
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
    console.log(
      'HomeComponent: Categoría seleccionada directamente:',
      category
    );
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
    console.log(
      'Navegando al detalle del libro:',
      book.titulo,
      'Tipo:',
      book.tipo_transaccion_nombre
    );

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
