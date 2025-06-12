import { Routes } from '@angular/router';
import { AuthComponent } from './login/login.component';
export const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: '**', redirectTo: '' },
];
