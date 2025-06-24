// src/app/shared/header/header.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api.service';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar MatSnackBar

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() cartItems: number = 0;
  @Input() savedItems: number = 0;
  @Input() currentPage: string = ''; // 'home', 'cart', 'profile', etc.
  @Input() selectedCategory: string = 'Todas'; // Para mostrar categoría activa

  // Eventos que se emiten al componente padre
  @Output() categorySelected = new EventEmitter<string>();
  @Output() cartClicked = new EventEmitter<void>();
  @Output() searchPerformed = new EventEmitter<string>();

  searchTerm = '';
  showCategoriesDropdown = false;
  showProfileDropdown = false;

  // Lista de categorías del dropdown
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
    private snackBar: MatSnackBar // Agregar MatSnackBar para mostrar mensajes
  ) {}
  onSearch() {
    if (this.searchTerm.trim()) {
      console.log('Buscando:', this.searchTerm);
      this.searchPerformed.emit(this.searchTerm);

      // Si no estamos en home, navegar a home con búsqueda
      if (this.currentPage !== 'home') {
        this.router.navigate(['/home'], {
          queryParams: { search: this.searchTerm },
        });
      }
    }
  }

  // Métodos de navegación
  goToHome() {
    this.router.navigate(['/home']);
  }

  goToSaved() {
    this.router.navigate(['/saved']);
  }

  goToCart() {
    if (this.currentPage === 'home') {
      // En home, emitir evento para abrir sidebar
      this.cartClicked.emit();
    } else {
      // En otras páginas, navegar a cart
      this.router.navigate(['/cart']);
    }
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

    if (this.currentPage === 'home') {
      // En home, emitir evento para filtrar
      this.categorySelected.emit(category);
    } else {
      // En otras páginas, navegar a home con categoría
      this.router.navigate(['/home'], {
        queryParams: { category: category },
      });
    }
  }

  // Métodos del perfil
  goToProfile() {
    this.showProfileDropdown = false;
    this.router.navigate(['/profile']);
  }

  goToOrders() {
    this.showProfileDropdown = false;
    console.log('Ir a Mis pedidos');
    // Navegar al perfil con el apartado de "Mis pedidos" activo
    this.router.navigate(['/profile'], {
      queryParams: { section: 'Mis pedidos' },
    });
  }

  goToLogin() {
    this.showProfileDropdown = false;
    this.router.navigate(['/']);
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
    return this.currentPage === 'profile';
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
