// ============================================
// 📁 CREAR NUEVO: src/app/rate-order/rate-order.component.ts
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-rate-order',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './rate-order.component.html',
  styleUrls: ['./rate-order.component.css']
})
export class RateOrderComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  orderId: string | null = null;
  rating: number = 0;
  comment: string = '';
  showSuccessPopup: boolean = false;
  
  // Datos del pedido a calificar
  orderData = {
    id: 1,
    bookTitle: 'Drácula',
    bookAuthor: 'Bram Stoker',
    bookImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
    seller: 'Michael Benito Kerr Thatcher',
    sellerId: 1,
    orderDate: '08-06-2025',
    orderType: 'Venta',
    totalAmount: 190,
    status: 'Completado'
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtener el ID del pedido desde la ruta
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('id');
      if (this.orderId) {
        const numericId = parseInt(this.orderId, 10);
        if (isNaN(numericId)) {
          console.error('ID de pedido inválido:', this.orderId);
          this.router.navigate(['/profile']);
          return;
        }
        this.loadOrderDetails(this.orderId);
      } else {
        console.error('No se proporcionó ID de pedido');
        this.router.navigate(['/profile']);
      }
    });

    // Manejar redirecciones por categorías/búsqueda desde el header
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        console.log('Categoría seleccionada desde rate-order:', params['category']);
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        console.log('Búsqueda desde rate-order:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  loadOrderDetails(orderId: string) {
    console.log('Cargando detalles del pedido para calificar ID:', orderId);
    
    const numericId = parseInt(orderId, 10);
    
    // Datos simulados de pedidos
    const ordersData = {
      1: {
        id: 1,
        bookTitle: 'Drácula',
        bookAuthor: 'Bram Stoker',
        bookImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
        seller: 'Michael Benito Kerr Thatcher',
        sellerId: 1,
        orderDate: '08-06-2025',
        orderType: 'Venta',
        totalAmount: 190,
        status: 'Completado'
      },
      2: {
        id: 2,
        bookTitle: 'Fundamentos de programación Java',
        bookAuthor: 'Varios Autores',
        bookImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
        seller: 'Ana García López',
        sellerId: 2,
        orderDate: '05-06-2025',
        orderType: 'Donación',
        totalAmount: 0,
        status: 'Completado'
      },
      3: {
        id: 3,
        bookTitle: 'El Arte de la Guerra',
        bookAuthor: 'Sun Tzu',
        bookImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
        seller: 'Carlos Mendez Rivera',
        sellerId: 3,
        orderDate: '02-06-2025',
        orderType: 'Intercambio',
        totalAmount: 0,
        status: 'Completado'
      }
    };

    const orderDetails = ordersData[numericId as keyof typeof ordersData];
    if (orderDetails) {
      this.orderData = orderDetails;
    } else {
      console.warn('Pedido no encontrado, usando datos por defecto');
    }

    // 🔌 AQUÍ INTEGRAR BACKEND - Cargar datos del pedido
    // this.orderService.getOrderById(orderId).subscribe(...)
  }

  // ✨ Método para establecer calificación
  setRating(stars: number) {
    this.rating = stars;
    console.log('Calificación establecida:', stars);
  }

  // ✨ Obtener array de estrellas para mostrar
  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  // ✨ Verificar si una estrella debe estar llena
  isStarFilled(starNumber: number): boolean {
    return starNumber <= this.rating;
  }

  submitRating() {
    if (this.rating === 0) {
      alert('Por favor, selecciona una calificación antes de enviar.');
      return;
    }

    console.log('Enviando calificación para pedido:', this.orderData.bookTitle);
    console.log('Calificación:', this.rating);
    console.log('Comentario:', this.comment);
    
    // Simular envío de calificación
    const ratingData = {
      orderId: this.orderData.id,
      bookTitle: this.orderData.bookTitle,
      seller: this.orderData.seller,
      sellerId: this.orderData.sellerId,
      rating: this.rating,
      comment: this.comment,
      timestamp: new Date().toISOString()
    };

    // 🔌 AQUÍ INTEGRAR BACKEND - Enviar calificación
    // this.ratingService.submitRating(ratingData).subscribe({
    //   next: (response) => {
    //     this.showSuccessPopup = true;
    //   },
    //   error: (error) => {
    //     console.error('Error enviando calificación:', error);
    //     this.showErrorMessage('Error al enviar la calificación. Inténtalo de nuevo.');
    //   }
    // });

    // ✨ Mostrar popup de éxito
    this.showSuccessPopup = true;
  }

  // ✨ Cerrar popup y regresar al perfil
  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.router.navigate(['/profile'], {
      queryParams: { section: 'Mis pedidos' }
    });
  }

  cancel() {
    console.log('Cancelando calificación');
    this.router.navigate(['/profile'], {
      queryParams: { section: 'Mis pedidos' }
    });
  }

  goBack() {
    this.cancel();
  }

  // ✨ Navegar a información del vendedor
  viewSellerInfo() {
    console.log('Navegando a información del vendedor ID:', this.orderData.sellerId);
    this.router.navigate(['/seller', this.orderData.sellerId]);
  }

  private showSuccessMessage(message: string) {
    console.log('✅', message);
  }

  private showErrorMessage(message: string) {
    console.error('❌', message);
  }

  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde rate-order:', searchTerm);
    this.router.navigate(['/home'], { 
      queryParams: { search: searchTerm },
      replaceUrl: true 
    });
  }
}