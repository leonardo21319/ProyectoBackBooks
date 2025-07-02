// ============================================
// 📁 REEMPLAZAR COMPLETO: src/app/payment/payment.component.ts - SIN IMPUESTOS
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { PaymentService } from '../servicios/payment.service';
import { PDFService } from '../servicios/pdf.service';
import { ApiService } from '../servicios/api.service';
import { PaymentData, PaymentRequest, OrderSummary } from '../models/Payment.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cartItems = 3;
  savedItems = 0;
  
  // Datos del formulario de pago
  paymentData: PaymentData = {
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

  // ✨ DATOS DEL PEDIDO SIN IMPUESTOS
  orderSummary: OrderSummary = {
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0
  };

  // Estados del formulario
  isProcessing = false;
  showPaymentSuccess = false;
  showPaymentError = false;
  errorMessage = '';
  
  // ✨ NUEVAS PROPIEDADES
  completedOrderId = '';
  pdfDownloadUrl = '';
  currentUser: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private pdfService: PDFService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    console.log('PaymentComponent: Componente iniciado');
    
    // ✨ CARGAR DATOS DEL USUARIO AUTENTICADO
    this.loadUserData();
    
    // ✨ CARGAR DATOS DEL CARRITO
    this.loadCartData();
    
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

  // ✨ CARGAR DATOS DEL USUARIO
  loadUserData() {
    this.currentUser = this.apiService.decodificarToken();
    if (this.currentUser) {
      this.paymentData.email = this.currentUser.correo || '';
      this.paymentData.name = `${this.currentUser.nombre || ''} ${this.currentUser.appaterno || ''}`.trim();
      console.log('PaymentComponent: Datos de usuario cargados', this.currentUser);
    }
  }

  // ✨ CARGAR DATOS DEL CARRITO SIN IMPUESTOS
  loadCartData() {
    // TODO: Reemplazar con datos reales del carrito
    
    // Calcular totales
    const itemsData = [
      {
        id: 1,
        title: 'Drácula',
        author: 'Bram Stoker',
        price: 190,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
        isbn: '9786254449970',
        editorial: 'Pinky Penguin'
      },
      {
        id: 4,
        title: 'El Señor de los Anillos',
        author: 'J.R.R. Tolkien',
        price: 350,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
        isbn: '9788445000663',
        editorial: 'Minotauro'
      }
    ];

    // Calcular subtotal
    const subtotal = itemsData.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 0; // Envío gratis
    const totalFinal = subtotal + shipping;

    // ✨ ESTRUCTURA CORRECTA SIN IMPUESTOS
    this.orderSummary = {
      items: itemsData,
      subtotal: subtotal,
      shipping: shipping,
      total: totalFinal
    };
    
    this.cartItems = this.orderSummary.items.reduce((total, item) => total + item.quantity, 0);
    console.log('PaymentComponent: Datos del carrito cargados SIN IMPUESTOS', this.orderSummary);
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

  // ✨ VALIDAR FORMULARIO MEJORADO
  validateForm(): boolean {
    if (this.selectedPaymentMethod === 'card') {
      // Usar validación del servicio
      if (!this.paymentService.validateCardData(
        this.paymentData.cardNumber,
        this.paymentData.expirationMonth,
        this.paymentData.expirationYear,
        this.paymentData.cvc
      )) {
        this.showError('Datos de tarjeta inválidos');
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

  // ✨ PROCESAR PAGO CON BACKEND
  async processPayment() {
    if (!this.validateForm()) {
      return;
    }

    if (!this.currentUser) {
      this.showError('Usuario no autenticado');
      return;
    }

    this.isProcessing = true;
    console.log('PaymentComponent: Procesando pago...', this.paymentData);

    try {
      // Preparar datos para el backend
      const paymentRequest: PaymentRequest = {
        paymentData: this.paymentData,
        orderSummary: this.orderSummary,
        userId: this.currentUser.id_usuario,
        paymentMethod: this.selectedPaymentMethod
      };

      // ✨ LLAMAR AL BACKEND
      const response = await this.paymentService.processPayment(paymentRequest).toPromise();
      
      if (response?.success) {
        this.completedOrderId = response.orderId || '';
        this.pdfDownloadUrl = response.pdfUrl || '';
        
        console.log('PaymentComponent: Pago procesado exitosamente', response);
        this.showPaymentSuccess = true;
        
        // ✨ DESCARGAR PDF AUTOMÁTICAMENTE
        if (this.completedOrderId) {
          setTimeout(async () => {
            try {
              await this.downloadTicketPDF();
            } catch (error) {
              console.error('Error descargando PDF:', error);
            }
          }, 1000);
        }
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/profile'], { 
            queryParams: { section: 'Mis pedidos', paymentSuccess: true }
          });
        }, 3000);
        
      } else {
        throw new Error(response?.message || 'Error procesando pago');
      }
      
    } catch (error: any) {
      console.error('PaymentComponent: Error procesando pago:', error);
      this.showError(error.error?.message || error.message || 'Error al procesar el pago. Intente nuevamente.');
    } finally {
      this.isProcessing = false;
    }
  }

  // ✨ DESCARGAR TICKET PDF
  async downloadTicketPDF() {
    if (!this.completedOrderId) {
      console.error('No hay orden completada para descargar');
      return;
    }

    try {
      const fileName = this.pdfService.generateFileName(this.completedOrderId, this.paymentData.name);
      await this.pdfService.downloadPDFTicket(this.completedOrderId, fileName);
      console.log('PaymentComponent: PDF descargado exitosamente');
    } catch (error) {
      console.error('PaymentComponent: Error descargando PDF:', error);
      this.showError('Error descargando el ticket. Puedes intentar descargarlo desde "Mis pedidos".');
    }
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
    const cardType = this.paymentService.getCardType(this.paymentData.cardNumber);
    
    switch (cardType) {
      case 'visa': return '💙';
      case 'mastercard': return '🔴';
      case 'amex': return '💚';
      case 'discover': return '🟠';
      default: return '💳';
    }
  }
}