import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router'; 
import { AuthComponent } from './login/login.component'; 
import { HomeComponent } from './home/home.component'; // 👈 SOLO AGREGAR ESTA LÍNEA
 
const routes: Routes = [ 
  { path: '', component: AuthComponent }, 
  { path: 'home', component: HomeComponent }, // 👈 SOLO AGREGAR ESTA LÍNEA
  { path: '**', redirectTo: '' }, 
]; 
 
@NgModule({ 
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule], 
}) 
export class AppRoutingModule {}