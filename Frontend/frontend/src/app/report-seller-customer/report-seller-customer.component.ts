// ============================================
// 📁 CREAR NUEVO: src/app/report-seller-customer/report-seller-customer.component.ts
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-report-seller-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './report-seller-customer.component.html',
  styleUrls: ['./report-seller-customer.component.css']
})
export class ReportSellerCustomerComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  userId: string | null = null;
  reportText: string = '';
  showSuccessPopup: boolean = false; // ✨ Control del popup
  
  // Datos del usuario que se está reportando
  reportedUser = {
    id: 1,
    name: 'Michael Benito Kerr Thatcher',
    avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="%23E8F4FD"/><circle cx="30" cy="22" r="10" fill="%236A93B2"/><ellipse cx="30" cy="42" rx="12" ry="8" fill="%236A93B2"/></svg>'
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtener el ID del usuario desde la ruta
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      if (this.userId) {
        const numericId = parseInt(this.userId, 10);
        if (isNaN(numericId)) {
          console.error('ID de usuario inválido:', this.userId);
          this.router.navigate(['/home']);
          return;
        }
        this.loadUserDetails(this.userId);
      } else {
        console.error('No se proporcionó ID de usuario');
        this.router.navigate(['/home']);
      }
    });

    // Manejar redirecciones por categorías/búsqueda desde el header
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        console.log('Categoría seleccionada desde report-seller-customer:', params['category']);
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        console.log('Búsqueda desde report-seller-customer:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  loadUserDetails(userId: string) {
    console.log('Cargando detalles del usuario para reporte ID:', userId);
    
    const numericId = parseInt(userId, 10);
    
    // Datos simulados de usuarios
    const usersData = {
      1: {
        id: 1,
        name: 'Michael Benito Kerr Thatcher',
        avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="%23E8F4FD"/><circle cx="30" cy="22" r="10" fill="%236A93B2"/><ellipse cx="30" cy="42" rx="12" ry="8" fill="%236A93B2"/></svg>'
      },
      2: {
        id: 2,
        name: 'Ana García López',
        avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="%23F0E6FF"/><circle cx="30" cy="22" r="10" fill="%238B5CF6"/><ellipse cx="30" cy="42" rx="12" ry="8" fill="%238B5CF6"/></svg>'
      },
      3: {
        id: 3,
        name: 'Carlos Mendez Rivera',
        avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="%23FEF3E2"/><circle cx="30" cy="22" r="10" fill="%23F59E0B"/><ellipse cx="30" cy="42" rx="12" ry="8" fill="%23F59E0B"/></svg>'
      },
      4: {
        id: 4,
        name: 'Laura Martínez Silva',
        avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="%23FDF2F8"/><circle cx="30" cy="22" r="10" fill="%23EC4899"/><ellipse cx="30" cy="42" rx="12" ry="8" fill="%23EC4899"/></svg>'
      },
      5: {
        id: 5,
        name: 'Roberto González Pérez',
        avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="%23F0FDF4"/><circle cx="30" cy="22" r="10" fill="%2316A34A"/><ellipse cx="30" cy="42" rx="12" ry="8" fill="%2316A34A"/></svg>'
      }
    };

    const userData = usersData[numericId as keyof typeof usersData];
    if (userData) {
      this.reportedUser = userData;
    } else {
      console.warn('Usuario no encontrado, usando datos por defecto');
    }

    // 🔌 AQUÍ INTEGRAR BACKEND - Cargar datos del usuario
    // this.userService.getUserById(userId).subscribe(...)
  }

  sendReport() {
    if (!this.reportText.trim()) {
      alert('Por favor, describe el motivo del reporte antes de enviar.');
      return;
    }

    console.log('Enviando reporte para:', this.reportedUser.name);
    console.log('Texto del reporte:', this.reportText);
    
    // Simular envío de reporte
    const reportData = {
      userId: this.reportedUser.id,
      userName: this.reportedUser.name,
      reportText: this.reportText,
      timestamp: new Date().toISOString()
    };

    // 🔌 AQUÍ INTEGRAR BACKEND - Enviar reporte
    // this.reportService.sendReport(reportData).subscribe({
    //   next: (response) => {
    //     this.showSuccessPopup = true;
    //   },
    //   error: (error) => {
    //     console.error('Error enviando reporte:', error);
    //     this.showErrorMessage('Error al enviar el reporte. Inténtalo de nuevo.');
    //   }
    // });

    // ✨ Mostrar popup de éxito
    this.showSuccessPopup = true;
  }

  // ✨ NUEVO MÉTODO - Cerrar popup y regresar
  closeSuccessPopup() {
    this.showSuccessPopup = false;
    // Regresar a la página del usuario después de cerrar el popup
    this.router.navigate(['/seller', this.reportedUser.id]);
  }

  cancel() {
    console.log('Cancelando reporte');
    // Regresar a la página del usuario sin enviar el reporte
    this.router.navigate(['/seller', this.reportedUser.id]);
  }

  goBack() {
    this.cancel();
  }

  private showSuccessMessage(message: string) {
    console.log('✅', message);
    // TODO: Implementar sistema de notificaciones
    // this.toastr.success(message);
  }

  private showErrorMessage(message: string) {
    console.error('❌', message);
    // TODO: Implementar sistema de notificaciones
    // this.toastr.error(message);
  }

  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde report-seller-customer:', searchTerm);
    this.router.navigate(['/home'], { 
      queryParams: { search: searchTerm },
      replaceUrl: true 
    });
  }
}