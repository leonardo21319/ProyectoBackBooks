// src/app/cart/cart.component.ts - COMPLETO
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  searchTerm = '';
  cartItems = 1; // Número para el badge
  savedItems = 0;
  showCategoriesDropdown = false;
  showProfileDropdown = false;

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

  // Libros en el carrito (simulando datos)
  cartBooks = [
    {
      id: 1,
      title: 'Drácula',
      author: 'Bram Stoker',
      price: 190,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop'
    }
    // Se pueden agregar más libros aquí
  ];

  constructor(private router: Router) {
    // Inicializar contador de carrito al cargar
    this.updateCartCount();
  }

  onSearch() {
    console.log('Buscando:', this.searchTerm);
    // 🔌 AQUÍ INTEGRAR BACKEND - Búsqueda
  }

  // Métodos del carrito
  updateQuantity(book: any, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(book);
    } else {
      book.quantity = quantity;
      this.updateCartCount();
    }
  }

  removeFromCart(book: any) {
    const index = this.cartBooks.findIndex(item => item.id === book.id);
    if (index > -1) {
      this.cartBooks.splice(index, 1);
      this.updateCartCount();
      console.log('Libro removido del carrito:', book.title);
      // 🔌 AQUÍ INTEGRAR BACKEND - Remover del carrito
    }
  }

  updateCartCount() {
    this.cartItems = this.cartBooks.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartBooks.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Métodos de navegación
  goToHome() {
    this.router.navigate(['/home']);
  }

  goToSaved() {
    this.router.navigate(['/saved']);
  }

  goToCart() {
    // Ya estamos en carrito
  }

  goToCheckout() {
    console.log('Ir a checkout');
    // 🔌 AQUÍ INTEGRAR BACKEND - Navegar a checkout
    // this.router.navigate(['/checkout']);
  }

  // Métodos para dropdowns
  toggleCategoriesDropdown(event: Event) {
    event.stopPropagation();
    this.showCategoriesDropdown = !this.showCategoriesDropdown;
    this.showProfileDropdown = false;
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
    this.showCategoriesDropdown = false;
  }

  closeDropdownOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container') && 
        !target.closest('.profile-btn-figma')) {
      this.showCategoriesDropdown = false;
      this.showProfileDropdown = false;
    }
  }

  selectCategory(category: string) {
    this.showCategoriesDropdown = false;
    console.log('Categoría seleccionada:', category);
    // Navegar a home con filtro
    this.router.navigate(['/home'], { queryParams: { category: category } });
  }

  // Métodos del perfil
  goToProfile() {
    this.showProfileDropdown = false;
    console.log('Ir a Mi cuenta');
    // 🔌 AQUÍ INTEGRAR BACKEND - Navegar al perfil
  }

  goToOrders() {
    this.showProfileDropdown = false;
    console.log('Ir a Mis pedidos');
    // 🔌 AQUÍ INTEGRAR BACKEND - Navegar a pedidos
  }

  goToLogin() {
    this.showProfileDropdown = false;
    this.router.navigate(['/']);
  }
}