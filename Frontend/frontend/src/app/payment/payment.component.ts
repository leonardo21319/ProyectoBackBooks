import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { CartService, CartItem } from '../servicios/cart.service';
import { ApiService } from '../servicios/api.service';

interface PaymentData {
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cvc: string;
  country: string;
  postalCode: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface UserData {
  email: string;
  fullName: string;
}

interface OrderSummary {
  items: {
    id: number;
    title: string;
    author: string;
    price: number;
    quantity: number;
    image: string;
    isbn?: string;
    editorial?: string;
    tipo_transaccion_nombre?: string;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
}

interface DecodedToken {
  rol: number;
  id: string;
  exp?: number;
  iat?: number;
  correo?: string;
  nombre?: string;
  apellido?: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  
  paymentData: PaymentData = {
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvc: '',
    country: 'Mexico',
    postalCode: '',
    name: '',
    address: '',
    city: '',
    state: ''
  };

  userData: UserData = {
    email: '',
    fullName: ''
  };

  paymentMethods = [
    { id: 'card', name: 'Tarjeta', icon: '💳', active: true },
    { id: 'klarna', name: 'Klarna', icon: 'K', active: false },
    { id: 'afterpay', name: 'Afterpay', icon: 'A', active: false },
    { id: 'affirm', name: 'Affirm', icon: 'a', active: false },
    { id: 'paypal', name: 'PayPal', icon: 'P', active: false }
  ];

  selectedPaymentMethod = 'card';
  orderSummary: OrderSummary = {
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0
  };

  isProcessing = false;
  showPaymentSuccess = false;
  showPaymentError = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    if (this.cartService.getCartCount() === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    this.loadUserData();
    this.loadCartData();
    
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  loadUserData() {
    const token = this.apiService.obtenerToken();
    if (token) {
      try {
        const decodedToken = this.apiService.decodificarToken();
        if (decodedToken) {
          this.userData = {
            email: this.getSafeTokenProperty(decodedToken, 'correo', 'email'),
            fullName: this.getUserFullName(decodedToken)
          };
        }
      } catch (error) {
        console.error('Error decodificando token:', error);
      }
    }
  }

  private getSafeTokenProperty(token: any, ...possibleProperties: string[]): string {
    for (const prop of possibleProperties) {
      if (token[prop]) {
        return token[prop];
      }
    }
    return '';
  }

  private getUserFullName(token: any): string {
    const nombre = this.getSafeTokenProperty(token, 'nombre', 'name');
    const apellido = this.getSafeTokenProperty(token, 'apellido', 'appaterno', 'lastName');
    return `${nombre} ${apellido}`.trim();
  }

  loadCartData() {
    const cartItems = this.cartService.getCartItems();
    
    const itemsData = cartItems.map(item => ({
      id: item.id,
      title: item.titulo,
      author: item.autor,
      price: item.precio,
      quantity: item.quantity,
      image: item.portada,
      isbn: item.isbn,
      editorial: item.editorial,
      tipo_transaccion_nombre: item.tipo_transaccion_nombre
    }));

    const subtotal = this.cartService.getCartTotal();
    const shipping = 0;
    const totalFinal = subtotal + shipping;

    this.orderSummary = {
      items: itemsData,
      subtotal: subtotal,
      shipping: shipping,
      total: totalFinal
    };
    
    this.cartItems = this.cartService.getCartCount();
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    
    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substr(0, 19);
    }
    
    this.paymentData.cardNumber = formattedValue;
    input.value = formattedValue;
  }

  formatExpiration(event: Event, field: 'month' | 'year'): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/gi, '');
    
    if (field === 'month') {
      if (value.length > 2) value = value.substr(0, 2);
      if (parseInt(value) > 12) value = '12';
      this.paymentData.expirationMonth = value;
    } else {
      if (value.length > 2) value = value.substr(0, 2);
      this.paymentData.expirationYear = value;
    }
    input.value = value;
  }

  formatCVC(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/gi, '');
    if (value.length > 4) value = value.substr(0, 4);
    this.paymentData.cvc = value;
    input.value = value;
  }

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

    if (!this.userData.email || !this.userData.email.includes('@')) {
      this.showError('Email inválido');
      return false;
    }

    if (!this.paymentData.name) {
      this.showError('Nombre requerido');
      return false;
    }

    if (!this.paymentData.address) {
      this.showError('Dirección requerida');
      return false;
    }

    return true;
  }

  async processPayment() {
    if (!this.validateForm()) {
      return;
    }

    this.isProcessing = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const pdfData = {
        user: {
          email: this.userData.email,
          fullName: this.userData.fullName
        },
        shippingInfo: {
          address: this.paymentData.address,
          city: this.paymentData.city,
          state: this.paymentData.state,
          country: this.paymentData.country,
          postalCode: this.paymentData.postalCode
        },
        order: {
          items: this.orderSummary.items,
          subtotal: this.orderSummary.subtotal,
          shipping: this.orderSummary.shipping,
          total: this.orderSummary.total,
          date: new Date().toLocaleDateString(),
          paymentMethod: this.paymentMethods.find(m => m.id === this.selectedPaymentMethod)?.name || 'Tarjeta',
          cardLastFour: this.paymentData.cardNumber.slice(-4).replace(/\s/g, '')
        }
      };

      console.log('Datos para PDF:', pdfData);
      
      this.cartService.clearCart();
      this.showPaymentSuccess = true;
      
      setTimeout(() => {
        this.router.navigate(['/profile'], { 
          queryParams: { section: 'Mis pedidos', paymentSuccess: true }
        });
      }, 3000);
      
    } catch (error: any) {
      console.error('Error procesando pago:', error);
      this.showError('Error al procesar el pago. Intente nuevamente.');
    } finally {
      this.isProcessing = false;
    }
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.showPaymentError = true;
    setTimeout(() => {
      this.showPaymentError = false;
    }, 5000);
  }

  closeSuccessPopup(): void {
    this.showPaymentSuccess = false;
    this.router.navigate(['/profile'], { 
      queryParams: { section: 'Mis pedidos' }
    });
  }

  closeErrorPopup(): void {
    this.showPaymentError = false;
  }

  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }

  onSearchPerformed(searchTerm: string): void {
    this.router.navigate(['/home'], { 
      queryParams: { search: searchTerm },
      replaceUrl: true 
    });
  }
}