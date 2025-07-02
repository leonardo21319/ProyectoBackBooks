// src/app/shared/sales-header/sales-header.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api.service';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sales-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-header.component.html',
  styleUrls: ['./sales-header.component.css'],
})
export class SalesHeaderComponent {
  @Input() offersCount: number = 0; // Ofertas recibidas
  @Input() publicationsCount: number = 0; // Libros publicados
  @Input() currentPage: string = ''; // 'saleshome', 'offers', 'publications', etc.
  @Input() selectedCategory: string = 'Todas'; // Para mostrar categoría activa

  // Eventos que se emiten al componente padre
  @Output() categorySelected = new EventEmitter<string>();
  @Output() searchPerformed = new EventEmitter<string>();

  searchTerm = '';
  showCategoriesDropdown = false;
  showProfileDropdown = false;

  // Lista de categorías del dropdown (mismo que comprador)
  categories = [
    'Literatura',
    'Ciencias y tecnología',
    'Historia y filosofía',
    'Economía y negocios',
    'Arte y cultura',
    'Desarrollo personal',
    'Ciencias sociales',
    'Idiomas y lingüística',
    'Cocina y alimentación',
    'Deportes y aventura',
    'Religión y espiritualidad',
    'Entretenimiento y hobbies',
    'Ciencia ficción',
  ];

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSearch() {
    if (this.searchTerm.trim()) {
      console.log('Buscando en inventario:', this.searchTerm);
      this.searchPerformed.emit(this.searchTerm);

      // Si no estamos en saleshome, navegar a saleshome con búsqueda
      if (this.currentPage !== 'saleshome') {
        this.router.navigate(['/saleshome'], {
          queryParams: { search: this.searchTerm },
        });
      }
    }
  }

  // Métodos de navegación específicos para vendedor
  goToSalesHome() {
    this.router.navigate(['/saleshome']);
  }

  goToOffers() {
    console.log('Ir a ofertas recibidas');
    // this.router.navigate(['/vendor-offers']);
    this.router.navigate(['/seller-offers']);
  }

  goToPublications() {
    console.log('Ir a mis publicaciones');
    this.router.navigate(['/seller-publications']);
  }

  goToAnalytics() {
    console.log('Ir a analíticas');
    // this.router.navigate(['/vendor-analytics']);
    alert('📊 Navegando a analíticas...');
  }

  // Métodos para dropdowns
  toggleCategoriesDropdown(event: Event) {
    event.stopPropagation();
    this.showCategoriesDropdown = !this.showCategoriesDropdown;
    this.showProfileDropdown = false;
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
    this.showCategoriesDropdown = false;
  }

  closeDropdownOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.dropdown-container') &&
      !target.closest('.profile-btn-figma')
    ) {
      this.showCategoriesDropdown = false;
      this.showProfileDropdown = false;
    }
  }

  selectCategory(category: string) {
    this.showCategoriesDropdown = false;
    console.log('Categoría seleccionada:', category);

    if (this.currentPage === 'saleshome') {
      // En saleshome, emitir evento para filtrar
      this.categorySelected.emit(category);
    } else {
      // En otras páginas, navegar a saleshome con categoría
      this.router.navigate(['/saleshome'], {
        queryParams: { category: category },
      });
    }
  }

  // Métodos del perfil de vendedor
  goToProfile() {
    this.showProfileDropdown = false;
    this.router.navigate(['/seller-profile']);
  }

  goToVendorOrders() {
    this.showProfileDropdown = false;
    console.log('Ir a historial de pedidos');
    // this.router.navigate(['/vendor-orders-history']);
    alert('📋 Navegando a historial de pedidos...');
  }

  goToSettings() {
    this.showProfileDropdown = false;
    console.log('Ir a configuración');
    // this.router.navigate(['/vendor-settings']);
    alert('⚙️ Navegando a configuración...');
  }

  private limpiarYRedirigir(): void {
    // Limpiar todo rastro de sesión
    localStorage.clear();
    sessionStorage.clear();

    // Redirigir a login con reemplazo de historial
    this.router.navigate(['/login'], {
      replaceUrl: true,
      queryParams: { sessionEnded: true },
    });
  }

  isActivePage(page: string): boolean {
    return this.currentPage === page;
  }

  isProfileActive(): boolean {
    return this.currentPage === 'vendor-profile';
  }

  isCategoryActive(category: string): boolean {
    return this.selectedCategory === category;
  }

  async cerrarSesion() {
    this.showProfileDropdown = false;
    const token = this.ApiService.obtenerToken();

    if (!token) {
      this.limpiarYRedirigir();
      return;
    }

    try {
      // Intentar cerrar sesión en el backend con timeout
      await Promise.race([
        lastValueFrom(this.ApiService.cerrarSesion(token)),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout al cerrar sesión')), 5000)
        ),
      ]);

      this.snackBar.open('Sesión cerrada con éxito', 'Cerrar', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.snackBar.open('Error al cerrar sesión', 'Cerrar', {
        duration: 3000,
      });
    } finally {
      this.limpiarYRedirigir();
    }
  }
}