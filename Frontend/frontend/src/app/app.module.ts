import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/Login/login.component'; // Asegúrate de que la ruta sea correcta

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, // Declara el componente que estás usando
  ],
  imports: [
    BrowserModule,
    FormsModule, // Asegúrate de agregar FormsModule aquí para usar ngModel
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
