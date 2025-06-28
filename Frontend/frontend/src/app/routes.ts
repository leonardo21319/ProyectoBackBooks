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


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  
  // 🏠 Páginas principales
  { path: 'home', component: HomeComponent },
  { path: 'saleshome', component: SaleshomeComponent }, // ✅ Página de vendedor
  { path: 'seller-profile', component: SellerProfileComponent }, // ✅ Cambié de 'sellerprofile' a 'seller-profile'

  
  // 🛒 Funcionalidades de compra
  { path: 'saved', component: SaveComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileShooperComponent },
  
  // 📚 Detalles de libros por tipo de transacción
  { path: 'book/:id', component: BookSaleComponent }, // Para libros de venta
  { path: 'exchange/:id', component: BookExchangeComponent }, // Para libros de intercambio
  { path: 'donation/:id', component: BookDonationComponent }, // Para libros de donación
  { path: 'exchange/:id/offer', component: BookExchangeOfferComponent }, // Para hacer ofertas de intercambio
  
  // 🔄 Redirección por defecto
  { path: '**', redirectTo: 'login' } // ✅ Mejor redirigir a login en lugar de cadena vacía
];