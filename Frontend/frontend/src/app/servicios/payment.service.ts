// ============================================
// 📁 CREAR: src/app/servicios/payment.service.ts
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PaymentRequest, PaymentResponse, Order } from '../models/Payment.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments';

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  // Procesar pago y generar ticket PDF
  processPayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    console.log('PaymentService: Procesando pago', paymentRequest);
    
    const headers = this.getAuthHeaders();
    
    return this.http.post<PaymentResponse>(`${this.apiUrl}/process`, paymentRequest, { headers })
      .pipe(
        map(response => {
          console.log('PaymentService: Pago procesado exitosamente', response);
          return response;
        }),
        catchError(error => {
          console.error('PaymentService: Error procesando pago', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener historial de órdenes del usuario
  getUserOrders(): Observable<Order[]> {
    console.log('PaymentService: Obteniendo órdenes del usuario');
    
    const headers = this.getAuthHeaders();
    
    return this.http.get<{data: Order[]}>(`${this.apiUrl}/orders`, { headers })
      .pipe(
        map(response => {
          console.log('PaymentService: Órdenes obtenidas', response.data);
          return response.data;
        }),
        catchError(error => {
          console.error('PaymentService: Error obteniendo órdenes', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener detalles de una orden específica
  getOrderById(orderId: string): Observable<Order> {
    console.log('PaymentService: Obteniendo orden por ID', orderId);
    
    const headers = this.getAuthHeaders();
    
    return this.http.get<{data: Order}>(`${this.apiUrl}/orders/${orderId}`, { headers })
      .pipe(
        map(response => {
          console.log('PaymentService: Orden obtenida', response.data);
          return response.data;
        }),
        catchError(error => {
          console.error('PaymentService: Error obteniendo orden', error);
          return throwError(() => error);
        })
      );
  }

  // Descargar ticket PDF
  downloadTicketPDF(orderId: string): Observable<Blob> {
    console.log('PaymentService: Descargando ticket PDF', orderId);
    
    const headers = this.getAuthHeaders();
    
    return this.http.get(`${this.apiUrl}/ticket/${orderId}`, {
      headers,
      responseType: 'blob'
    }).pipe(
      map(blob => {
        console.log('PaymentService: PDF descargado exitosamente');
        return blob;
      }),
      catchError(error => {
        console.error('PaymentService: Error descargando PDF', error);
        return throwError(() => error);
      })
    );
  }

  // Generar URL de descarga para el PDF
  getPDFDownloadUrl(orderId: string): string {
    const token = this.apiService.obtenerToken();
    return `${this.apiUrl}/ticket/${orderId}?token=${token}`;
  }

  // Verificar estado de pago
  verifyPaymentStatus(transactionId: string): Observable<{status: string, order?: Order}> {
    console.log('PaymentService: Verificando estado de pago', transactionId);
    
    const headers = this.getAuthHeaders();
    
    return this.http.get<{status: string, order?: Order}>(`${this.apiUrl}/verify/${transactionId}`, { headers })
      .pipe(
        map(response => {
          console.log('PaymentService: Estado de pago verificado', response);
          return response;
        }),
        catchError(error => {
          console.error('PaymentService: Error verificando estado', error);
          return throwError(() => error);
        })
      );
  }

  // Headers con autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.apiService.obtenerToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Validar datos de tarjeta (frontend)
  validateCardData(cardNumber: string, expMonth: string, expYear: string, cvc: string): boolean {
    // Validar número de tarjeta (Luhn algorithm)
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      return false;
    }

    // Validar fecha de expiración
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYearNum = parseInt(expYear);
    const expMonthNum = parseInt(expMonth);
    
    if (expYearNum < currentYear || (expYearNum === currentYear && expMonthNum < currentMonth)) {
      return false;
    }

    // Validar CVC
    if (cvc.length < 3 || cvc.length > 4) {
      return false;
    }

    return true;
  }

  // Algoritmo de Luhn para validar número de tarjeta
  private luhnCheck(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\s/g, '').split('').map(Number);
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  // Detectar tipo de tarjeta
  getCardType(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    if (cleanNumber.startsWith('6')) return 'discover';
    
    return 'unknown';
  }
}