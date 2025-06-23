// src/app/cart/cart.component.ts - SIMPLIFICADO CON HEADER COMPARTIDO
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component'; // Importar header compartido

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent], // Agregar HeaderComponent
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
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

  constructor(private router: Router, private route: ActivatedRoute) {
    this.updateCartCount();
  }

  ngOnInit() {
    // Verificar si hay parámetros de categoría en la URL
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        // Si se selecciona una categoría desde cart, navegar a home
        console.log('Categoría seleccionada desde cart:', params['category']);
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        // Si se hace una búsqueda desde cart, navegar a home
        console.log('Búsqueda desde cart:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
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