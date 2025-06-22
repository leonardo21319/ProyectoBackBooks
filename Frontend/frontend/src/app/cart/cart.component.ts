// src/app/cart/cart.component.ts - SIMPLIFICADO CON HEADER COMPARTIDO
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component'; // Importar header compartido

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent], // Agregar HeaderComponent
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems = 1; // Número para el badge
  savedItems = 0;

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
  ];

  constructor(private router: Router) {
    this.updateCartCount();
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
    }
  }

  updateCartCount() {
    this.cartItems = this.cartBooks.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartBooks.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  goToCheckout() {
    console.log('Ir a checkout');
    // 🔌 AQUÍ INTEGRAR BACKEND - Navegar a checkout
  }
}