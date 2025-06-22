// src/app/home/home.component.ts - COMPLETO Y ACTUALIZADO
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchTerm = '';
  cartItems = 0;
  savedItems = 0;
  selectedCategory = 'Todas';
  showCategoriesDropdown = false;
  showProfileDropdown = false;
  showCartSidebar = false; // Nueva propiedad para el carrito
  savedBooksIds: Set<number> = new Set(); // Para trackear libros guardados

  // Carrito de compras
  cartBooks: any[] = [];

  // Lista de categorías del dropdown
  categories = [
    'Literatura',
    'Ciencias y tecnología',
    'Historia y filosofía',
    'Economía y negocios',
    'Arte y cultura',
    'Desarrollo personal',
    'Ciencias sociales',
    'Idiomas y lingüística',
    'Cocina y alimentación',
    'Deportes y aventura',
    'Religión y espiritualidad',
    'Entretenimiento y hobbies',
    'Ciencia ficción'
  ];

  // 3 libros de muestra con diferentes tipos
  allBooks = [
    {
      id: 1,
      title: 'Drácula',
      author: 'Bram Stoker',
      price: 250,
      type: 'Venta',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
      category: 'Literatura',
      description: 'Clásico de la literatura gótica que ha inspirado generaciones.'
    },
    {
      id: 2,
      title: 'Fundamentos de programación Java',
      author: 'Varios Autores',
      price: 0,
      type: 'Donación',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      category: 'Ciencias y tecnología',
      description: 'Manual completo para aprender programación en Java desde cero.'
    },
    {
      id: 3,
      title: 'El Arte de la Guerra',
      author: 'Sun Tzu',
      price: 0,
      type: 'Intercambio',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
      category: 'Historia y filosofía',
      description: 'Tratado sobre estrategia militar y filosofía antigua china.'
    }
  ];

  constructor(private router: Router) {}

  // Getter para libros filtrados
  get books() {
    if (this.selectedCategory === 'Todas') {
      return this.allBooks;
    }
    return this.allBooks.filter(book => book.category === this.selectedCategory);
  }

  onSearch() {
    console.log('Buscando:', this.searchTerm);
    // 🔌 AQUÍ INTEGRAR BACKEND - Búsqueda
    // this.bookService.searchBooks(this.searchTerm).subscribe(...)
  }

  addToCart(book: any) {
    // Verificar si el libro ya está en el carrito
    const existingBook = this.cartBooks.find(item => item.id === book.id);
    
    if (existingBook) {
      existingBook.quantity += 1;
    } else {
      this.cartBooks.push({
        ...book,
        quantity: 1
      });
    }
    
    this.cartItems = this.cartBooks.reduce((total, item) => total + item.quantity, 0);
    console.log('Agregado al carrito:', book.title);
    console.log('Carrito actual:', this.cartBooks);
    // 🔌 AQUÍ INTEGRAR BACKEND - Agregar al carrito
    // this.cartService.addToCart(book.id).subscribe(...)
  }

  removeFromCart(book: any) {
    const index = this.cartBooks.findIndex(item => item.id === book.id);
    if (index > -1) {
      this.cartBooks.splice(index, 1);
      this.cartItems = this.cartBooks.reduce((total, item) => total + item.quantity, 0);
      console.log('Libro removido del carrito:', book.title);
      // 🔌 AQUÍ INTEGRAR BACKEND - Remover del carrito
      // this.cartService.removeFromCart(book.id).subscribe(...)
    }
  }

  updateQuantity(book: any, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(book);
    } else {
      const cartBook = this.cartBooks.find(item => item.id === book.id);
      if (cartBook) {
        cartBook.quantity = quantity;
        this.cartItems = this.cartBooks.reduce((total, item) => total + item.quantity, 0);
      }
    }
  }

  getCartSubtotal(): number {
    return this.cartBooks.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  toggleCartSidebar() {
    this.showCartSidebar = !this.showCartSidebar;
    // Cerrar otros dropdowns
    this.showCategoriesDropdown = false;
    this.showProfileDropdown = false;
  }

  closeCartSidebar() {
    this.showCartSidebar = false;
  }

  requestBook(book: any) {
    console.log('Solicitando donación de libro:', book.title);
    alert(`Solicitud enviada para: ${book.title}`);
    // 🔌 AQUÍ INTEGRAR BACKEND - Solicitar donación
    // this.donationService.requestBook(book.id).subscribe(...)
  }

  makeOffer(book: any) {
    console.log('Hacer oferta para:', book.title);
    // 🔌 AQUÍ INTEGRAR BACKEND - Crear oferta de intercambio
    // this.exchangeService.createOffer(book.id, offerData).subscribe(...)
  }

  addToSaved(book: any) {
    console.log('Estado actual - Libro ID:', book.id, 'Está guardado:', this.isBookSaved(book.id));
    console.log('IDs guardados actuales:', Array.from(this.savedBooksIds));
    
    if (this.isBookSaved(book.id)) {
      // Si ya está guardado, lo removemos
      this.savedBooksIds.delete(book.id);
      this.savedItems = this.savedBooksIds.size;
      console.log('✅ Libro removido de guardados:', book.title);
      console.log('📊 Nuevo contador:', this.savedItems);
      // 🔌 AQUÍ INTEGRAR BACKEND - Remover de favoritos
      // this.favoritesService.removeFromFavorites(book.id).subscribe(...)
    } else {
      // Si no está guardado, lo agregamos
      this.savedBooksIds.add(book.id);
      this.savedItems = this.savedBooksIds.size;
      console.log('⭐ Libro agregado a guardados:', book.title);
      console.log('📊 Nuevo contador:', this.savedItems);
      // 🔌 AQUÍ INTEGRAR BACKEND - Agregar a favoritos
      // this.favoritesService.addToFavorites(book.id).subscribe(...)
    }
    
    console.log('IDs guardados después del cambio:', Array.from(this.savedBooksIds));
  }

  // Método para verificar si un libro está guardado
  isBookSaved(bookId: number): boolean {
    const isSaved = this.savedBooksIds.has(bookId);
    console.log(`🔍 Verificando libro ${bookId}: ${isSaved ? 'GUARDADO' : 'NO GUARDADO'}`);
    return isSaved;
  }

  // Métodos para obtener el texto del botón según el tipo
  getButtonText(type: string): string {
    switch(type) {
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

  getButtonAction(book: any) {
    console.log('Tipo de libro:', book.type); // Para debug
    switch(book.type) {
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
        console.log('Tipo no reconocido:', book.type);
    }
  }

  // Métodos para categorías
  toggleCategoriesDropdown(event: Event) {
    event.stopPropagation();
    this.showCategoriesDropdown = !this.showCategoriesDropdown;
    this.showProfileDropdown = false;
  }

  closeDropdownOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container') && 
        !target.closest('.profile-btn-figma') && 
        !target.closest('.cart-sidebar') &&
        !target.closest('.nav-item-figma')) {
      this.showCategoriesDropdown = false;
      this.showProfileDropdown = false;
      this.showCartSidebar = false;
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.showCategoriesDropdown = false;
    console.log('Categoría seleccionada:', category);
  }

  // Métodos para el dropdown del perfil
  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
    this.showCategoriesDropdown = false;
  }

  goToProfile() {
    this.showProfileDropdown = false;
    console.log('Ir a Mi cuenta');
    // 🔌 AQUÍ INTEGRAR BACKEND - Navegar al perfil
    // this.router.navigate(['/profile']);
  }

  goToOrders() {
    this.showProfileDropdown = false;
    console.log('Ir a Mis pedidos');
    // 🔌 AQUÍ INTEGRAR BACKEND - Navegar a pedidos
    // this.router.navigate(['/orders']);
  }

  goToLogin() {
    this.showProfileDropdown = false;
    this.router.navigate(['/']);
  }

  goToSaved() {
    console.log('Navegando a guardados');
    this.router.navigate(['/saved']); // Redirección a la página de guardados
  }

  // Método ACTUALIZADO para el botón del header
  goToCart() {
    // Mantener el comportamiento actual del sidebar
    this.toggleCartSidebar();
  }

  // NUEVO: Método para ir a la página completa del carrito
  goToCartPage() {
    // Cerrar el sidebar primero
    this.closeCartSidebar();
    
    // Navegar a la página del carrito
    this.router.navigate(['/cart']);
    
    console.log('Navegando a la página completa del carrito');
  }
}