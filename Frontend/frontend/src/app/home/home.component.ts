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
    console.log('HomeComponent: Componente iniciado'); // SOLO AGREGAR LOG
    
    // MANTENER TU LÓGICA EXACTAMENTE IGUAL
    this.obtenerLibros();

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

  // MANTENER TU MÉTODO EXACTAMENTE IGUAL
  obtenerLibros() {
    console.log('HomeComponent: Obteniendo libros'); // SOLO AGREGAR LOG
    this.ApiService.obtenerLibros().subscribe(
      (data: Book[]) => {
        this.allBooks = data.map((book: Book) => {
          const portadaBase64 = this.bufferToBase64(book.portada);
          return {
            ...book,
            portada: portadaBase64,
          };
        });
        console.log('HomeComponent: Libros obtenidos:', this.allBooks.length); // SOLO AGREGAR LOG
      },
      (error) => {
        console.error('Error al obtener los libros:', error);
      }
    );
  }

  // MANTENER TU MÉTODO EXACTAMENTE IGUAL
  bufferToBase64(buffer: any): string {
    if (buffer && buffer.data) {
      return `data:image/png;base64,${Buffer.from(buffer.data).toString(
        'base64'
      )}`;
    }
    return '';
  }

  // MANTENER TU GETTER EXACTAMENTE IGUAL
  get books() {
    if (this.selectedCategory === 'Todas') {
      return this.allBooks;
    }
    return this.allBooks.filter(
      (book) => book.categoria_nombre === this.selectedCategory
    );
  }

  // SOLO AGREGAR LOGS PARA DEBUG
  onCategorySelected(category: string) {
    console.log('HomeComponent: Categoría seleccionada desde header:', category); // SOLO AGREGAR LOG
    this.selectedCategory = category;

    // MANTENER TU LÓGICA EXACTAMENTE IGUAL
    if (category === 'Todas') {
      this.router.navigate(['/home'], { replaceUrl: true });
    } else {
      this.router.navigate(['/home'], {
        queryParams: { category: category },
        replaceUrl: true,
      });
    }
  }

  // MANTENER TU MÉTODO EXACTAMENTE IGUAL
  onCartClicked() {
    this.toggleCartSidebar();
  }

  // MANTENER TU MÉTODO EXACTAMENTE IGUAL
  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde header:', searchTerm);
    
    this.router.navigate(['/home'], {
      queryParams: { search: searchTerm },
      replaceUrl: true,
    });
  }

  // MANTENER TODOS TUS MÉTODOS DEL CARRITO EXACTAMENTE IGUAL
  addToCart(book: any) {
    console.log('HomeComponent: Añadiendo al carrito:', book.titulo); // SOLO AGREGAR LOG
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

  // MANTENER TUS MÉTODOS DE GUARDADOS EXACTAMENTE IGUAL
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

  // MANTENER TUS MÉTODOS DE ACCIONES EXACTAMENTE IGUAL
  requestBook(book: any) {
    console.log('Solicitando donación de libro:', book.titulo);
    alert(`Solicitud enviada para: ${book.titulo}`);
  }

  makeOffer(book: any) {
    console.log('Hacer oferta para:', book.titulo);
  }

  getButtonAction(book: any) {
    console.log('HomeComponent: Acción para libro tipo:', book.tipo_transaccion_nombre); // SOLO AGREGAR LOG
    switch (book.tipo_transaccion_nombre) {
      case 'Venta':
        this.addToCart(book);
        break;
      case 'Donación':
        this.requestBook(book);
        break;
      case 'Intercambio':
        this.makeOffer(book);
        break;
    }
  }

  getButtonText(type: string): string {
    switch (type) {
      case 'Venta':
        return 'Añadir al carrito';
      case 'Donación':
        return 'Solicitar libro';
      case 'Intercambio':
        return 'Hacer oferta';
      default:
        return 'Acción';
    }
  }

  selectCategory(category: string) {
    console.log('HomeComponent: Categoría seleccionada directamente:', category); // SOLO AGREGAR LOG
    this.selectedCategory = category;

    // MANTENER TU LÓGICA EXACTAMENTE IGUAL
    if (category === 'Todas') {
      this.router.navigate(['/home'], { replaceUrl: true });
    } else {
      this.router.navigate(['/home'], {
        queryParams: { category: category },
        replaceUrl: true,
      });
    }
  }

  // MANTENER TU MÉTODO EXACTAMENTE IGUAL
  viewBookDetail(book: Book): void {
    console.log('Detalles del libro:', book);
    this.router.navigate(['/book-detail', book.id]);
  }

  goToCartPage() {
    this.closeCartSidebar();
    this.router.navigate(['/cart']);
    console.log('Navegando a la página completa del carrito');
  }

  goToOrders() {
    console.log('Ir a Mis pedidos desde home');
    this.router.navigate(['/profile'], {
      queryParams: { section: 'Mis pedidos' },
    });
  }
}