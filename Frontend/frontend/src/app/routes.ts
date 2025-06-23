import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SaveComponent } from './save/save.component';
import { CartComponent } from './cart/cart.component';
import { ProfileShooperComponent } from './profile-shooper/profile-shooper.component';
import { BookSaleComponent } from './book-sale/book-sale.component';
import { BookExchangeComponent } from './book-exchange/book-exchange.component';
import { BookDonationComponent } from './book-donation/book-donation.component';
import { BookExchangeOfferComponent } from './book-exchange-offer/book-exchange-offer.component'; // ✨ Nueva importación

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'saved', component: SaveComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileShooperComponent },
  { path: 'book/:id', component: BookSaleComponent }, // Para libros de venta
  { path: 'exchange/:id', component: BookExchangeComponent }, // Para libros de intercambio
  { path: 'donation/:id', component: BookDonationComponent }, // Para libros de donación
  { path: 'exchange/:id/offer', component: BookExchangeOfferComponent }, // ✨ Para hacer ofertas de intercambio
  { path: '**', redirectTo: '' }
];
