import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component'; // Importar header compartido
import { ApiService } from '../servicios/api.service';
import { Book } from '../models/Book.model'; // Asegúrate de que la ruta del modelo esté correcta

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent], // Agregar HeaderComponent
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

  // Variable para almacenar los libros obtenidos
  allBooks: Book[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ApiService: ApiService
  ) {}

  ngOnInit(): void {
    // Llamada para obtener los libros
    this.obtenerLibros();

    // Verificar si hay parámetros de categoría o búsqueda en la URL
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        console.log('Categoría desde URL:', params['category']);
      }
      if (params['search']) {
        // Aquí puedes manejar la búsqueda si es necesario
        console.log('Búsqueda desde URL:', params['search']);
      }
    });
  }

  obtenerLibros() {
    this.ApiService.obtenerLibros().subscribe(
      (data: Book[]) => {
        // Transformar la propiedad portada y asegurar que la imagen sea utilizable
        this.allBooks = data.map((book: Book) => {
          // Convertir Buffer a base64 para la portada
          const portadaBase64 = this.bufferToBase64(book.portada);
          return {
            ...book,
            portada: portadaBase64, // Se asegura de que la propiedad portada sea de tipo string
          };
        });
        console.log('Libros obtenidos:', this.allBooks);
      },
      (error) => {
        console.error('Error al obtener los libros:', error);
      }
    );
  }

  // Convertir el buffer de portada a base64
  bufferToBase64(buffer: any): string {
    if (buffer && buffer.data) {
      return `data:image/png;base64,${Buffer.from(buffer.data).toString(
        'base64'
      )}`;
    }
    return '';
  }

  // Getter para libros filtrados
  get books() {
    if (this.selectedCategory === 'Todas') {
      return this.allBooks;
    }
    return this.allBooks.filter(
      (book) => book.categoria_nombre === this.selectedCategory // Corrige a categoria_nombre si es necesario
    );
  }

  // Métodos para eventos del header
  onCategorySelected(category: string) {
    this.selectedCategory = category;
    console.log('Categoría seleccionada:', category);

    // Actualizar la URL para reflejar la categoría seleccionada
    if (category === 'Todas') {
      // Si es "Todas", limpiar los query params
      this.router.navigate(['/'], { replaceUrl: true });
    } else {
      // Actualizar URL con la categoría
      this.router.navigate(['/'], {
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
    // 🔌 AQUÍ INTEGRAR BACKEND - Búsqueda local
    // Puedes filtrar los libros por el término de búsqueda

    // Actualizar URL con el término de búsqueda
    this.router.navigate(['/'], {
      queryParams: { search: searchTerm },
      replaceUrl: true,
    });
  }

  // Métodos para gestionar el carrito
  addToCart(book: any) {
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
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  toggleCartSidebar() {
    this.showCartSidebar = !this.showCartSidebar;
  }

  closeCartSidebar() {
    this.showCartSidebar = false;
  }

  // Función para manejar libros guardados
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
    console.log('Solicitando donación de libro:', book.title);
    alert(`Solicitud enviada para: ${book.title}`);
  }

  makeOffer(book: any) {
    console.log('Hacer oferta para:', book.title);
  }
  getButtonAction(book: any) {
    switch (book.type) {
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
    this.selectedCategory = category;
    console.log('Categoría seleccionada directamente:', category);

    // Actualizar URL
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
    console.log('Detalles del libro:', book);
    this.router.navigate(['/book-detail', book.id]);
  }

  goToCartPage() {
    this.closeCartSidebar();
    this.router.navigate(['/cart']);
    console.log('Navegando a la página completa del carrito');
  }

  // Método para navegar a pedidos si se necesita desde home
  goToOrders() {
    console.log('Ir a Mis pedidos desde home');
    this.router.navigate(['/profile'], {
      queryParams: { section: 'Mis pedidos' },
    });
  }
}
