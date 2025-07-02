// ============================================
// 📁 ACTUALIZAR: src/app/app.routes.ts - COMPLETO CORRECTO CON PAYMENT
// ============================================

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SaleshomeComponent } from './seller/saleshome/saleshome.component';
import { SaveComponent } from './save/save.component';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component'; // ✨ NUEVO IMPORT
import { ProfileShooperComponent } from './profile-shooper/profile-shooper.component';
import { BookSaleComponent } from './book-sale/book-sale.component';
import { BookExchangeComponent } from './book-exchange/book-exchange.component';
import { BookDonationComponent } from './book-donation/book-donation.component';
import { BookExchangeOfferComponent } from './book-exchange-offer/book-exchange-offer.component';
import { SellerProfileComponent } from './seller/seller-profile/seller-profile.component';
import { SellerOffersComponent } from './seller/seller-offers/seller-offers.component';
import { SellerPublicationsComponent } from './seller/seller-publications/seller-publications.component';
import { InfoSalesCustomerComponent } from './info-sales-customer/info-sales-customer.component';
import { ReportSellerCustomerComponent } from './report-seller-customer/report-seller-customer.component';
import { RateOrderComponent } from './rate-order/rate-order.component';
import { AuthGuardService } from './auth.guard';
export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },

  // 🏠 Páginas principales
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  {
    path: 'saleshome',
    component: SaleshomeComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'seller-profile',
    component: SellerProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'seller-offers',
    component: SellerOffersComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'seller-publications',
    component: SellerPublicationsComponent,
    canActivate: [AuthGuardService],
  },

  // 🛒 Funcionalidades de compra
  { path: 'saved', component: SaveComponent, canActivate: [AuthGuardService] }, // Guardar libros
  { path: 'cart', component: CartComponent, canActivate: [AuthGuardService] }, // Carrito de compras
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [AuthGuardService],
  }, // ✨ NUEVA RUTA DE PAGO
  {
    path: 'profile',
    component: ProfileShooperComponent,
    canActivate: [AuthGuardService],
  }, // Perfil del comprador

  // 📚 Detalles de libros por tipo de transacción
  {
    path: 'book/:id',
    component: BookSaleComponent,
    canActivate: [AuthGuardService],
  }, // Para libros de venta
  {
    path: 'exchange/:id',
    component: BookExchangeComponent,
    canActivate: [AuthGuardService],
  }, // Para libros de intercambio
  {
    path: 'donation/:id',
    component: BookDonationComponent,
    canActivate: [AuthGuardService],
  }, // Para libros de donación
  {
    path: 'exchange/:id/offer',
    component: BookExchangeOfferComponent,
    canActivate: [AuthGuardService],
  }, // Para hacer ofertas de intercambio

  // ✨ RUTAS DE INFORMACIÓN Y FUNCIONALIDADES DE USUARIO
  {
    path: 'seller/:id',
    component: InfoSalesCustomerComponent,
    canActivate: [AuthGuardService],
  }, // Información del vendedor/propietario/donante
  {
    path: 'seller/:id/report',
    component: ReportSellerCustomerComponent,
    canActivate: [AuthGuardService],
  }, // Reportar usuario
  {
    path: 'rate-order/:id',
    component: RateOrderComponent,
    canActivate: [AuthGuardService],
  }, // Calificar pedido completado

  // 🔄 Redirección por defecto
  { path: '**', redirectTo: 'login' },
];
