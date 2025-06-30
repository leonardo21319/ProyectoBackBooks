// ============================================
// 📁 CREAR: src/app/payment/payment.component.ts
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cartItems = 3; // Ejemplo
  savedItems = 0;
  
  // Datos del formulario de pago
  paymentData = {
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvc: '',
    country: 'Mexico',
    postalCode: '',
    email: '',
    name: '',
    address: '',
    city: '',
    state: ''
  };

  // Configuración de pago
  selectedPaymentMethod = 'card';
  paymentMethods = [
    { id: 'card', name: 'Tarjeta', icon: '💳', active: true },
    { id: 'klarna', name: 'Klarna', icon: 'K', active: false },
    { id: 'afterpay', name: 'Afterpay', icon: 'A', active: false },
    { id: 'affirm', name: 'Affirm', icon: 'a', active: false },
    { id: 'paypal', name: 'PayPal', icon: 'P', active: false }
  ];

  // Datos del pedido (simulados)
  orderSummary = {
    items: [
      {
        id: 1,
        title: 'Drácula',
        author: 'Bram Stoker',
        price: 190,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop'
      },
      {
        id: 4,
        title: 'El Señor de los Anillos',
        author: 'J.R.R. Tolkien',
        price: 350,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop'
      }
    ],
    subtotal: 730,
    shipping: 0,
    tax: 116.80,
    total: 846.80
  };

  // Estados del formulario
  isProcessing = false;
  showPaymentSuccess = false;
  showPaymentError = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('PaymentComponent: Componente iniciado');
    
    // Cargar datos del usuario si está autenticado
    this.loadUserData();
    
    // Manejar redirecciones por categorías/búsqueda desde el header
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        console.log('Categoría seleccionada desde payment:', params['category']);
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        console.log('Búsqueda desde payment:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  // Cargar datos del usuario
  loadUserData() {
    // TODO: Cargar desde el servicio de usuario
    this.paymentData.email = 'usuario@ejemplo.com';
    this.paymentData.name = 'Michael Kerr';
  }

  // Seleccionar método de pago
  selectPaymentMethod(methodId: string) {
    this.selectedPaymentMethod = methodId;
    console.log('Método de pago seleccionado:', methodId);
  }

  // Formatear número de tarjeta
  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    
    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substr(0, 19);
    }
    
    this.paymentData.cardNumber = formattedValue;
  }

  // Formatear fecha de expiración
  formatExpiration(event: any, field: 'month' | 'year') {
    let value = event.target.value.replace(/[^0-9]/gi, '');
    
    if (field === 'month') {
      if (value.length > 2) value = value.substr(0, 2);
      if (parseInt(value) > 12) value = '12';
      this.paymentData.expirationMonth = value;
    } else {
      if (value.length > 2) value = value.substr(0, 2);
      this.paymentData.expirationYear = value;
    }
  }

  // Formatear CVC
  formatCVC(event: any) {
    let value = event.target.value.replace(/[^0-9]/gi, '');
    if (value.length > 4) value = value.substr(0, 4);
    this.paymentData.cvc = value;
  }

  // Validar formulario
  validateForm(): boolean {
    if (this.selectedPaymentMethod === 'card') {
      if (!this.paymentData.cardNumber || this.paymentData.cardNumber.replace(/\s/g, '').length < 16) {
        this.showError('Número de tarjeta inválido');
        return false;
      }
      
      if (!this.paymentData.expirationMonth || !this.paymentData.expirationYear) {
        this.showError('Fecha de expiración requerida');
        return false;
      }
      
      if (!this.paymentData.cvc || this.paymentData.cvc.length < 3) {
        this.showError('CVC inválido');
        return false;
      }
    }

    if (!this.paymentData.email || !this.paymentData.name) {
      this.showError('Información de contacto requerida');
      return false;
    }

    if (!this.paymentData.postalCode || !this.paymentData.address) {
      this.showError('Información de facturación requerida');
      return false;
    }

    return true;
  }

  // Procesar pago
  async processPayment() {
    if (!this.validateForm()) {
      return;
    }

    this.isProcessing = true;
    console.log('Procesando pago...', this.paymentData);

    try {
      // Simular procesamiento de pago
      await this.simulatePaymentProcessing();
      
      // TODO: Integrar con API de pago real
      // const result = await this.paymentService.processPayment(this.paymentData);
      
      this.showPaymentSuccess = true;
      console.log('Pago procesado exitosamente');
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        this.router.navigate(['/profile'], { 
          queryParams: { section: 'Mis pedidos', paymentSuccess: true }
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error procesando pago:', error);
      this.showError('Error al procesar el pago. Intente nuevamente.');
    } finally {
      this.isProcessing = false;
    }
  }

  // Simular procesamiento de pago
  private simulatePaymentProcessing(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular éxito/fallo (90% éxito)
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Pago rechazado'));
        }
      }, 2000);
    });
  }

  // Mostrar error
  private showError(message: string) {
    this.errorMessage = message;
    this.showPaymentError = true;
    setTimeout(() => {
      this.showPaymentError = false;
    }, 5000);
  }

  // Cerrar popup de éxito
  closeSuccessPopup() {
    this.showPaymentSuccess = false;
    this.router.navigate(['/profile'], { 
      queryParams: { section: 'Mis pedidos' }
    });
  }

  // Cerrar popup de error
  closeErrorPopup() {
    this.showPaymentError = false;
  }

  // Regresar al carrito
  goBackToCart() {
    this.router.navigate(['/cart']);
  }

  // Manejar búsqueda desde header
  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde payment:', searchTerm);
    this.router.navigate(['/home'], { 
      queryParams: { search: searchTerm },
      replaceUrl: true 
    });
  }

  // Obtener icono de tarjeta según el número
  getCardIcon(): string {
    const number = this.paymentData.cardNumber.replace(/\s/g, '');
    
    if (number.startsWith('4')) return '💙'; // Visa
    if (number.startsWith('5')) return '🔴'; // Mastercard
    if (number.startsWith('3')) return '💚'; // American Express
    
    return '💳'; // Genérica
  }
}