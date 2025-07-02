// ============================================
// 📁 ACTUALIZAR: src/app/servicios/cart.service.ts - SIN FILTRO DE TIPO
// ============================================

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  titulo: string;
  autor: string;
  precio: number;
  portada: string;
  quantity: number;
  tipo_transaccion_nombre: string;
  // ✨ CAMPOS ADICIONALES DEL BACKEND
  isbn?: string;
  editorial?: string;
  descripcion?: string;
  categoria_nombre?: string;
  estado_libro?: string;
  id_usuario?: number;
  fecha_publicacion?: string;
  numpaginas?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    console.log('🛒 CartService: Servicio inicializado - TODOS LOS LIBROS PERMITIDOS');
    // Cargar carrito desde localStorage al inicializar
    this.loadCartFromStorage();
  }

  // ✨ AGREGAR ITEM AL CARRITO - SIN FILTRO DE TIPO
  addToCart(book: any): void {
    console.log('🛒 CartService: Agregando libro al carrito:', book.titulo);
    console.log('🛒 CartService: Tipo de transacción:', book.tipo_transaccion_nombre);
    
    // ✨ REMOVIDO: Ya no validamos el tipo de transacción
    // Solo verificamos que tenga los datos básicos necesarios
    if (!book.id || !book.titulo) {
      console.warn('🛒 CartService: Libro sin datos básicos requeridos');
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.id === book.id);

    if (existingItem) {
      // Si ya existe, aumentar cantidad
      existingItem.quantity += 1;
      console.log('🛒 CartService: Cantidad aumentada a:', existingItem.quantity);
    } else {
      // ✨ MAPEAR DATOS DEL BACKEND AL FORMATO DEL CARRITO
      const newItem: CartItem = {
        id: book.id,
        titulo: book.titulo,
        autor: book.autor || 'Autor desconocido',
        precio: book.precio || 0, // ✨ Permitir precio 0 para donaciones
        portada: book.portada,
        quantity: 1,
        tipo_transaccion_nombre: book.tipo_transaccion_nombre || book.tipo_transaccion || 'Venta',
        // ✨ CAMPOS ADICIONALES
        isbn: book.isbn,
        editorial: book.editorial,
        descripcion: book.descripcion,
        categoria_nombre: book.categoria_nombre || book.categoria,
        estado_libro: book.estado_libro,
        id_usuario: book.id_usuario,
        fecha_publicacion: book.fecha_publicacion,
        numpaginas: book.numpaginas
      };
      
      currentItems.push(newItem);
      console.log('🛒 CartService: Nuevo item agregado:', newItem);
    }

    this.updateCart(currentItems);
  }

  // ✨ OBTENER ITEMS DEL CARRITO
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // ✨ REMOVER ITEM DEL CARRITO
  removeFromCart(bookId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const filteredItems = currentItems.filter(item => item.id !== bookId);
    this.updateCart(filteredItems);
    console.log('🛒 CartService: Item removido del carrito, ID:', bookId);
  }

  // ✨ ACTUALIZAR CANTIDAD DE UN ITEM
  updateQuantity(bookId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(bookId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.id === bookId);
    
    if (item) {
      item.quantity = quantity;
      this.updateCart(currentItems);
      console.log('🛒 CartService: Cantidad actualizada para ID:', bookId, 'Nueva cantidad:', quantity);
    }
  }

  // ✨ OBTENER TOTAL DEL CARRITO
  getCartTotal(): number {
    const items = this.cartItemsSubject.value;
    const total = items.reduce((total, item) => total + (item.precio * item.quantity), 0);
    console.log('🛒 CartService: Total calculado:', total);
    return total;
  }

  // ✨ OBTENER CANTIDAD TOTAL DE ITEMS
  getCartCount(): number {
    const items = this.cartItemsSubject.value;
    const count = items.reduce((total, item) => total + item.quantity, 0);
    return count;
  }

  // ✨ LIMPIAR CARRITO
  clearCart(): void {
    this.updateCart([]);
    console.log('🛒 CartService: Carrito limpiado completamente');
  }

  // ✨ VERIFICAR SI UN ITEM ESTÁ EN EL CARRITO
  isInCart(bookId: number): boolean {
    const items = this.cartItemsSubject.value;
    const isIn = items.some(item => item.id === bookId);
    return isIn;
  }

  // ✨ OBTENER ITEM ESPECÍFICO DEL CARRITO
  getCartItem(bookId: number): CartItem | undefined {
    const items = this.cartItemsSubject.value;
    return items.find(item => item.id === bookId);
  }

  // ✨ OBTENER RESUMEN DEL CARRITO
  getCartSummary(): { count: number; total: number; items: CartItem[] } {
    const items = this.cartItemsSubject.value;
    return {
      count: this.getCartCount(),
      total: this.getCartTotal(),
      items: items
    };
  }

  // ✨ MÉTODOS PRIVADOS
  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.cartCountSubject.next(this.getCartCount());
    this.saveCartToStorage(items);
    
    console.log('🛒 CartService: Carrito actualizado. Total items:', this.getCartCount());
    console.log('🛒 CartService: Total precio:', this.getCartTotal());
    console.log('🛒 CartService: Items completos:', items);
  }

  private saveCartToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem('bookstore_cart', JSON.stringify(items));
      console.log('🛒 CartService: Carrito guardado en localStorage con', items.length, 'items');
    } catch (error) {
      console.error('🛒 Error guardando carrito en localStorage:', error);
    }
  }

  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('bookstore_cart');
      if (savedCart) {
        const items: CartItem[] = JSON.parse(savedCart);
        // ✨ VALIDAR ITEMS CARGADOS
        const validItems = items.filter(item => 
          item.id && 
          item.titulo && 
          item.precio !== undefined && 
          item.quantity > 0
        );
        
        this.cartItemsSubject.next(validItems);
        this.cartCountSubject.next(this.getCartCount());
        console.log('🛒 CartService: Carrito cargado desde localStorage:', validItems.length, 'items válidos');
        
        if (validItems.length !== items.length) {
          console.warn('🛒 CartService: Se filtraron items inválidos del carrito guardado');
          this.saveCartToStorage(validItems); // Limpiar items inválidos
        }
      } else {
        console.log('🛒 CartService: No hay carrito guardado en localStorage');
      }
    } catch (error) {
      console.error('🛒 Error cargando carrito desde localStorage:', error);
      this.clearCart();
    }
  }
}