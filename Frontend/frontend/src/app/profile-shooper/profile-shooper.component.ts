// src/app/profile-shooper/profile-shooper.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component'; // Importar header compartido

@Component({
  selector: 'app-profile-shooper',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent], // Agregar HeaderComponent
  templateUrl: './profile-shooper.component.html',
  styleUrls: ['./profile-shooper.component.css']
})
export class ProfileShooperComponent {
  cartItems = 0;
  savedItems = 0;
  
  // Menú lateral activo
  activeMenuItem = 'Mi cuenta';

  // Datos del usuario (simulando datos existentes)
  userProfile = {
    firstName: 'Michael',
    lastName: 'Kerr',
    motherLastName: 'Thatcher',
    email: 'mikerrbern@gmail.com',
    phone: ''
  };

  constructor(private router: Router) {}

  // Métodos del sidebar
  setActiveMenuItem(menuItem: string) {
    this.activeMenuItem = menuItem;
    
    switch(menuItem) {
      case 'Mi cuenta':
        // Ya estamos en Mi cuenta
        break;
      case 'Mis pedidos':
        console.log('Navegando a Mis pedidos');
        // 🔌 AQUÍ INTEGRAR BACKEND - Navegar a pedidos
        // this.router.navigate(['/orders']);
        break;
      case 'Reportes':
        console.log('Navegando a Reportes');
        // 🔌 AQUÍ INTEGRAR BACKEND - Navegar a reportes
        // this.router.navigate(['/reports']);
        break;
      case 'Cerrar sesión':
        this.logout();
        break;
    }
  }

  logout() {
    console.log('Cerrando sesión...');
    // 🔌 AQUÍ INTEGRAR BACKEND - Logout
    this.router.navigate(['/']);
  }

  // Método para guardar cambios del perfil
  saveChanges() {
    console.log('Guardando cambios del perfil:', this.userProfile);
    
    // Validación básica
    if (!this.userProfile.firstName || !this.userProfile.lastName || !this.userProfile.email) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    // Simular guardado exitoso
    alert('Cambios guardados exitosamente');
    
    // 🔌 AQUÍ INTEGRAR BACKEND - Actualizar perfil
    // this.profileService.updateProfile(this.userProfile).subscribe(
    //   response => {
    //     console.log('Perfil actualizado:', response);
    //     // Mostrar mensaje de éxito
    //   },
    //   error => {
    //     console.error('Error al actualizar perfil:', error);
    //     // Mostrar mensaje de error
    //   }
    // );
  }
}