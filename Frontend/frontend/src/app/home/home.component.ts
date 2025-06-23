// ============================================
// 📁 src/app/home/home.component.ts - CÓDIGO COMPLETO ACTUALIZADO
// ============================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  cartItems = 0;
  savedItems = 0;
  selectedCategory = 'Todas';
  showCartSidebar = false;
  savedBooksIds: Set<number> = new Set();

  // Carrito de compras
  cartBooks: any[] = [];

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

  // ✨ MÉTODO ACTUALIZADO - Navegación según tipo de libro
  viewBookDetail(book: any) {
    console.log('Navegando al detalle del libro:', book.title, 'Tipo:', book.type);
    
    if (book.type === 'Venta') {
      // Libros de venta van a book-sale
      this.router.navigate(['/book', book.id]);
    } else if (book.type === 'Intercambio') {
      // Libros de intercambio van a book-exchange
      this.router.navigate(['/exchange', book.id]);
    } else if (book.type === 'Donación') {
      // Libros de donación van a book-donation
      this.router.navigate(['/donation', book.id]);
    } else {
      console.warn('Tipo de libro no reconocido:', book.type);
    }
  }

  // Métodos para eventos del header
  onCategorySelected(category: string) {
    this.selectedCategory = category;
    console.log('Categoría seleccionada:', category);
  }

  onCartClicked() {
    this.toggleCartSidebar();
  }

  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde header:', searchTerm);
    // 🔌 AQUÍ INTEGRAR BACKEND - Búsqueda
  }

  addToCart(book: any) {
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
  }

  removeFromCart(book: any) {
    const index = this.cartBooks.findIndex(item => item.id === book.id);
    if (index > -1) {
      this.cartBooks.splice(index, 1);
      this.cartItems = this.cartBooks.reduce((total, item) => total + item.quantity, 0);
      console.log('Libro removido del carrito:', book.title);
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
  }

  closeCartSidebar() {
    this.showCartSidebar = false;
  }

  requestBook(book: any) {
    console.log('Solicitando donación de libro:', book.title);
    alert(`Solicitud enviada para: ${book.title}`);
  }

  makeOffer(book: any) {
    console.log('Hacer oferta para:', book.title);
  }

  addToSaved(book: any) {
    if (this.isBookSaved(book.id)) {
      this.savedBooksIds.delete(book.id);
      this.savedItems = this.savedBooksIds.size;
      console.log('✅ Libro removido de guardados:', book.title);
    } else {
      this.savedBooksIds.add(book.id);
      this.savedItems = this.savedBooksIds.size;
      console.log('⭐ Libro agregado a guardados:', book.title);
    }
  }

  isBookSaved(bookId: number): boolean {
    return this.savedBooksIds.has(bookId);
  }

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
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    console.log('Categoría seleccionada:', category);
  }

  closeDropdownOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.cart-sidebar') &&
        !target.closest('.nav-item-figma')) {
      this.showCartSidebar = false;
    }
  }

  goToCartPage() {
    this.closeCartSidebar();
    this.router.navigate(['/cart']);
    console.log('Navegando a la página completa del carrito');
  }
}