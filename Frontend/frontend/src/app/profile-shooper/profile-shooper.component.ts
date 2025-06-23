// src/app/profile-shooper/profile-shooper.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component'; // Importar header compartido

@Component({
  selector: 'app-profile-shooper',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent], // Agregar HeaderComponent
  templateUrl: './profile-shooper.component.html',
  styleUrls: ['./profile-shooper.component.css']
})
export class ProfileShooperComponent implements OnInit {
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

  // Datos de pedidos simulados
  orders = [
    {
      id: 1,
      bookTitle: 'Drácula',
      date: '08-06-2025',
      status: 'Completado',
      type: 'Venta',
      total: 120,
      canRate: true
    },
    {
      id: 2,
      bookTitle: 'Frieren',
      date: '07-06-2025',
      status: 'Cancelada',
      type: 'Donación',
      total: 0,
      canRate: false
    },
    {
      id: 3,
      bookTitle: 'Baldor',
      date: '06-06-2025',
      status: 'Pendiente',
      type: 'Intercambio',
      total: 0,
      canRate: false
    }
  ];

  // Datos de reportes simulados
  reports = [
    {
      id: 1,
      date: '08-06-2025',
      reportedUser: 'Bugambilio Jacarando Cruz',
      reason: 'El usuario hizo una oferta con una palabra antisocial'
    },
    {
      id: 2,
      date: '07-06-2025',
      reportedUser: 'Margarita Flores Hortencia',
      reason: 'El usuario me llamo hambreado'
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Verificar si hay parámetros en la URL
    this.route.queryParams.subscribe(params => {
      if (params['section']) {
        this.activeMenuItem = params['section'];
        console.log('Navegando a sección:', params['section']);
      }
      if (params['category']) {
        // Si se selecciona una categoría desde profile, navegar a home
        console.log('Categoría seleccionada desde profile:', params['category']);
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        // Si se hace una búsqueda desde profile, navegar a home
        console.log('Búsqueda desde profile:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  // Métodos del sidebar
  setActiveMenuItem(menuItem: string) {
    this.activeMenuItem = menuItem;
    
    switch(menuItem) {
      case 'Mi cuenta':
        // Ya estamos en Mi cuenta
        break;
      case 'Mis pedidos':
        console.log('Navegando a Mis pedidos');
        // Ya estamos en el apartado de pedidos, solo cambiar la vista
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

  // Métodos para pedidos
  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'completado':
        return 'status-completed';
      case 'pendiente':
        return 'status-pending';
      case 'cancelada':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getTypeClass(type: string): string {
    switch(type.toLowerCase()) {
      case 'venta':
        return 'type-venta';
      case 'donación':
        return 'type-donacion';
      case 'intercambio':
        return 'type-intercambio';
      default:
        return '';
    }
  }

  rateOrder(order: any) {
    console.log('Calificar pedido:', order);
    // 🔌 AQUÍ INTEGRAR BACKEND - Abrir modal de calificación
    alert(`Calificar pedido: ${order.bookTitle}`);
  }

  viewOrderDetails(order: any) {
    console.log('Ver detalles del pedido:', order);
    // 🔌 AQUÍ INTEGRAR BACKEND - Navegar a detalles
  }

  // Métodos para reportes
  viewReportDetails(report: any) {
    console.log('Ver detalles del reporte:', report);
    // 🔌 AQUÍ INTEGRAR BACKEND - Ver detalles del reporte
  }
}