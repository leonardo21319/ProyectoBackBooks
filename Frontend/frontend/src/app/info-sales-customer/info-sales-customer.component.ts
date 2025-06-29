// ============================================
// 📁 ACTUALIZAR: src/app/info-sales-customer/info-sales-customer.component.ts - COMPLETO
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-info-sales-customer',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './info-sales-customer.component.html',
  styleUrls: ['./info-sales-customer.component.css']
})
export class InfoSalesCustomerComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  
  // ✨ INFORMACIÓN SIMPLIFICADA DEL USUARIO
  customerInfo = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    rating: 0,
    totalReviews: 0,
    avatar: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario desde la URL
    this.route.params.subscribe(params => {
      const userId = +params['id'];
      this.loadCustomerInfo(userId);
    });

    // Manejar redirecciones por categorías/búsqueda desde el header
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        console.log('Categoría seleccionada desde info-sales-customer:', params['category']);
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        console.log('Búsqueda desde info-sales-customer:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  loadCustomerInfo(userId: number): void {
    // TODO: Reemplazar con llamada real al API
    // Por ahora, datos de prueba basados en el ID
    this.customerInfo = this.getMockCustomerData(userId);
  }

  // ✨ DATOS SIMPLIFICADOS DE USUARIOS
  getMockCustomerData(userId: number): any {
    const mockCustomers = [
      {
        id: 1,
        name: 'Michael Benito Kerr Thatcher',
        email: 'mikerrben@gmail.com',
        phone: '5578907654',
        rating: 5.0,
        totalReviews: 127,
        avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="%23E8F4FD"/><circle cx="60" cy="45" r="20" fill="%236A93B2"/><ellipse cx="60" cy="85" rx="25" ry="15" fill="%236A93B2"/></svg>'
      },
      {
        id: 2,
        name: 'Ana García López',
        email: 'ana.garcia@email.com',
        phone: '5512345678',
        rating: 4.8,
        totalReviews: 92,
        avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="%23F0E6FF"/><circle cx="60" cy="45" r="20" fill="%238B5CF6"/><ellipse cx="60" cy="85" rx="25" ry="15" fill="%238B5CF6"/></svg>'
      },
      {
        id: 3,
        name: 'Carlos Mendez Rivera',
        email: 'carlos.mendez@email.com',
        phone: '5598765432',
        rating: 4.9,
        totalReviews: 156,
        avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="%23FEF3E2"/><circle cx="60" cy="45" r="20" fill="%23F59E0B"/><ellipse cx="60" cy="85" rx="25" ry="15" fill="%23F59E0B"/></svg>'
      },
      {
        id: 4,
        name: 'Laura Martínez Silva',
        email: 'laura.martinez@email.com',
        phone: '5534567890',
        rating: 4.7,
        totalReviews: 78,
        avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="%23FDF2F8"/><circle cx="60" cy="45" r="20" fill="%23EC4899"/><ellipse cx="60" cy="85" rx="25" ry="15" fill="%23EC4899"/></svg>'
      },
      {
        id: 5,
        name: 'Roberto González Pérez',
        email: 'roberto.gonzalez@email.com',
        phone: '5567890123',
        rating: 4.6,
        totalReviews: 103,
        avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="%23F0FDF4"/><circle cx="60" cy="45" r="20" fill="%2316A34A"/><ellipse cx="60" cy="85" rx="25" ry="15" fill="%2316A34A"/></svg>'
      }
    ];

    return mockCustomers.find(customer => customer.id === userId) || mockCustomers[0];
  }

  goBack(): void {
    // Regresar a la página anterior
    history.back();
  }

  onSearchPerformed(searchTerm: string): void {
    this.router.navigate(['/home'], {
      queryParams: { search: searchTerm }
    });
  }

  // ✨ MÉTODO ACTUALIZADO - Navegar a página de reporte
  reportUser(): void {
    console.log('Navegando a página de reporte para usuario:', this.customerInfo.name);
    this.router.navigate(['/seller', this.customerInfo.id, 'report']);
  }

  getRatingStars(): string[] {
    const fullStars = Math.floor(this.customerInfo.rating);
    const hasHalfStar = this.customerInfo.rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    const stars = [];
    
    // Estrellas llenas
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    
    // Media estrella
    if (hasHalfStar) {
      stars.push('half');
    }
    
    // Estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
      stars.push('empty');
    }
    
    return stars;
  }
}