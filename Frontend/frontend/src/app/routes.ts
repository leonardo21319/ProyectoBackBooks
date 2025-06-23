// ============================================
// 📁 src/app/routes.ts - CÓDIGO COMPLETO ACTUALIZADO
// ============================================

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SaveComponent } from './save/save.component';
import { CartComponent } from './cart/cart.component';
import { ProfileShooperComponent } from './profile-shooper/profile-shooper.component';
import { BookSaleComponent } from './book-sale/book-sale.component'; // ✨ Importación del componente

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'saved', component: SaveComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileShooperComponent },
  { path: 'book/:id', component: BookSaleComponent }, // ✨ Ruta del detalle con parámetro dinámico
  { path: '**', redirectTo: '' } // Redirección para rutas no encontradas
];