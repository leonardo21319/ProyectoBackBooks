import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
// 👈 NO importar LoginComponent porque es standalone

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    FormsModule, // 👈 AGREGAR (necesario para tu login)
    AppRoutingModule, // 👈 AGREGAR (necesario para las rutas)
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}