// ============================================
// 📁 ACTUALIZAR: src/app/cart/cart.component.ts - CON SERVICIO DE CARRITO
// ============================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../shared/header/header.component';
import { CartService, CartItem } from '../servicios/cart.service'; // ✨ IMPORT DEL SERVICIO

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems = 0;
  savedItems = 0;
  cartBooks: CartItem[] = []; // ✨ USAR INTERFAZ DEL SERVICIO

  // ✨ SUSCRIPCIONES PARA CLEANUP
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private cartService: CartService // ✨ INYECTAR SERVICIO DE CARRITO
  ) {}

  ngOnInit() {
    console.log('CartComponent: Componente iniciado');

    // ✨ SUSCRIBIRSE A LOS CAMBIOS DEL CARRITO
    this.cartSubscription.add(
      this.cartService.cartItems$.subscribe(items => {
        this.cartBooks = items;
        console.log('CartComponent: Items del carrito actualizados:', items.length);
      })
    );

    // ✨ SUSCRIBIRSE AL CONTADOR DEL CARRITO
    this.cartSubscription.add(
      this.cartService.cartCount$.subscribe(count => {
        this.cartItems = count;
        console.log('CartComponent: Cart count actualizado:', count);
      })
    );

    // Manejar navegación desde parámetros
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        console.log('Categoría seleccionada desde cart:', params['category']);
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        console.log('Búsqueda desde cart:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  ngOnDestroy(): void {
    // ✨ LIMPIAR SUSCRIPCIONES
    this.cartSubscription.unsubscribe();
  }

  // ✨ ACTUALIZADO: Usar servicio de carrito
  updateQuantity(book: CartItem, quantity: number) {
    console.log('CartComponent: Actualizando cantidad:', book.titulo, quantity);
    this.cartService.updateQuantity(book.id, quantity);
  }

  // ✨ ACTUALIZADO: Usar servicio de carrito
  removeFromCart(book: CartItem) {
    console.log('CartComponent: Removiendo del carrito:', book.titulo);
    this.cartService.removeFromCart(book.id);
    this.showSuccessMessage(`"${book.titulo}" removido del carrito`);
  }

  // ✨ ACTUALIZADO: Usar servicio de carrito para el total
  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  // ✨ NAVEGAR A PAGO
  goToCheckout() {
    if (this.cartBooks.length === 0) {
      alert('Tu carrito está vacío. Agrega algunos libros antes de continuar.');
      return;
    }
    
    console.log('CartComponent: Navegando a la página de pago');
    this.router.navigate(['/payment']);
  }

  // ✨ NAVEGAR A HOME
  goToHome() {
    console.log('CartComponent: Navegando a home');
    this.router.navigate(['/home']);
  }

  // ✨ LIMPIAR CARRITO (OPCIONAL)
  clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
      this.cartService.clearCart();
      this.showSuccessMessage('Carrito vaciado');
    }
  }

  // ✨ MÉTODO AUXILIAR: Mostrar mensajes
  private showSuccessMessage(message: string) {
    console.log('✅', message);
    // TODO: Implementar sistema de notificaciones toast
    // this.toastr.success(message);
  }
}