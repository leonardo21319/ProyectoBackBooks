import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SaveComponent } from './save/save.component';
import { CartComponent } from './cart/cart.component'; // Nueva importación

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'saved', component: SaveComponent },
  { path: 'cart', component: CartComponent }, // Nueva ruta para el carrito
  { path: '**', redirectTo: '' }
];