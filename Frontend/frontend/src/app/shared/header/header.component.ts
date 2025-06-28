// src/app/shared/header/header.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api.service';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  @Input() currentPage: string = '';
  @Input() selectedCategory: string = 'Todas';

  // Eventos que se emiten al componente padre
  @Output() categorySelected = new EventEmitter<string>();
  @Output() cartClicked = new EventEmitter<void>();
  @Output() searchPerformed = new EventEmitter<string>();

  searchTerm = '';
  showCategoriesDropdown = false;
  showProfileDropdown = false;

  // MANTENER TU LISTA DE CATEGORÍAS EXACTAMENTE IGUAL
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

  // MANTENER TU MÉTODO EXACTAMENTE IGUAL
  onSearch() {
    if (this.searchTerm.trim()) {
      console.log('Buscando:', this.searchTerm);
      this.searchPerformed.emit(this.searchTerm);

      if (this.currentPage !== 'home') {
        this.router.navigate(['/home'], {
          queryParams: { search: this.searchTerm },
        });
      }
    }
  }

  // MANTENER TUS MÉTODOS DE NAVEGACIÓN EXACTAMENTE IGUAL
  goToHome() {
    this.router.navigate(['/home']);
  }

  goToSaved() {
    this.router.navigate(['/saved']);
  }

  goToCart() {
    if (this.currentPage === 'home') {
      this.cartClicked.emit();
    } else {
      this.router.navigate(['/cart']);
    }
  }

  // SOLO AGREGAR LOGS Y stopPropagation PARA FIX
  toggleCategoriesDropdown(event: Event) {
    event.stopPropagation(); // FIX: Prevenir propagación
    console.log('HeaderComponent: Toggle categorías dropdown'); // SOLO AGREGAR LOG
    this.showCategoriesDropdown = !this.showCategoriesDropdown;
    this.showProfileDropdown = false;
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation(); // FIX: Prevenir propagación
    console.log('HeaderComponent: Toggle perfil dropdown'); // SOLO AGREGAR LOG
    this.showProfileDropdown = !this.showProfileDropdown;
    this.showCategoriesDropdown = false;
  }

  // MANTENER TU MÉTODO EXACTAMENTE IGUAL
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

  // SOLO AGREGAR LOGS PARA DEBUG
  selectCategory(category: string) {
    this.showCategoriesDropdown = false;
    console.log('HeaderComponent: Categoría seleccionada:', category); // SOLO AGREGAR LOG

    if (this.currentPage === 'home') {
      this.categorySelected.emit(category);
    } else {
      this.router.navigate(['/home'], {
        queryParams: { category: category },
      });
    }
  }

  // MANTENER TUS MÉTODOS EXACTAMENTE IGUAL
  goToProfile() {
    this.showProfileDropdown = false;
    this.router.navigate(['/profile']);
  }

  goToOrders() {
    this.showProfileDropdown = false;
    console.log('Ir a Mis pedidos');
    this.router.navigate(['/profile'], {
      queryParams: { section: 'Mis pedidos' },
    });
  }

  goToLogin() {
    this.showProfileDropdown = false;
    this.router.navigate(['/']);
  }

  // MANTENER TU MÉTODO EXACTAMENTE IGUAL
  private limpiarYRedirigir(): void {
    // Usar el nuevo método pero mantener la misma lógica
    this.ApiService.limpiarTokenLocal();

    this.router.navigate(['/login'], {
      replaceUrl: true,
      queryParams: { sessionEnded: true },
    });
  }

  // MANTENER TUS MÉTODOS EXACTAMENTE IGUAL
  isActivePage(page: string): boolean {
    return this.currentPage === page;
  }

  isProfileActive(): boolean {
    return this.currentPage === 'profile';
  }

  isCategoryActive(category: string): boolean {
    return this.selectedCategory === category;
  }

  // MANTENER TU MÉTODO CERRAR SESIÓN EXACTAMENTE IGUAL
  async cerrarSesion() {
    console.log('HeaderComponent: Iniciando cierre de sesión'); // SOLO AGREGAR LOG
    this.showProfileDropdown = false;
    const token = this.ApiService.obtenerToken();

    if (!token) {
      this.limpiarYRedirigir();
      return;
    }

    try {
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