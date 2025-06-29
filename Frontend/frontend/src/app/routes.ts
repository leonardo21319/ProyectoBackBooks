// ============================================
// 📁 ACTUALIZAR: src/app/app.routes.ts
// ============================================

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SaleshomeComponent } from './seller/saleshome/saleshome.component';
import { SaveComponent } from './save/save.component';
import { CartComponent } from './cart/cart.component';
import { ProfileShooperComponent } from './profile-shooper/profile-shooper.component';
import { BookSaleComponent } from './book-sale/book-sale.component';
import { BookExchangeComponent } from './book-exchange/book-exchange.component';
import { BookDonationComponent } from './book-donation/book-donation.component';
import { BookExchangeOfferComponent } from './book-exchange-offer/book-exchange-offer.component';
import { SellerProfileComponent } from './seller/seller-profile/seller-profile.component';
import { SellerOffersComponent } from './seller/seller-offers/seller-offers.component';
import { InfoSalesCustomerComponent } from './info-sales-customer/info-sales-customer.component'; // ✨ NUEVO IMPORT

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  
  // 🏠 Páginas principales
  { path: 'home', component: HomeComponent },
  { path: 'saleshome', component: SaleshomeComponent },
  { path: 'seller-profile', component: SellerProfileComponent },
  { path: 'seller-offers', component: SellerOffersComponent },
  
  // 🛒 Funcionalidades de compra
  { path: 'saved', component: SaveComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileShooperComponent },
  
  // 📚 Detalles de libros por tipo de transacción
  { path: 'book/:id', component: BookSaleComponent }, // Para libros de venta
  { path: 'exchange/:id', component: BookExchangeComponent }, // Para libros de intercambio
  { path: 'donation/:id', component: BookDonationComponent }, // Para libros de donación
  { path: 'exchange/:id/offer', component: BookExchangeOfferComponent }, // Para hacer ofertas de intercambio
  
  // ✨ NUEVA RUTA - Información del vendedor/propietario/donante
  { path: 'seller/:id', component: InfoSalesCustomerComponent },
  
  // 🔄 Redirección por defecto
  { path: '**', redirectTo: 'login' }
];