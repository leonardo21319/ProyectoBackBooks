import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bookstore-container">
      <!-- Header con Bootstrap -->
      <header class="custom-header sticky-top">
        <div class="container-fluid">
          <div class="row align-items-center py-3">
            
            <!-- Logo -->
            <div class="col-auto">
              <div class="logo-container">
                <!-- Cambia esta URL por tu imagen de logo -->
                <img src="assets/images/logo.png" alt="Logo" class="logo-img" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <!-- Fallback si no hay imagen -->
                <div class="logo-placeholder" style="display: none;">LOGO</div>
              </div>
            </div>

            <!-- Buscador Centrado -->
            <div class="col d-flex justify-content-center">
              <div class="search-container-figma">
                <input 
                  type="text" 
                  class="search-input-figma"
                  [(ngModel)]="searchTerm"
                  placeholder=""
                  (keyup.enter)="onSearch()"
                >
                <button 
                  class="search-btn-figma" 
                  type="button"
                  (click)="onSearch()"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Navegación -->
            <div class="col-auto">
              <div class="d-flex align-items-center" style="gap: 2rem;">
                <button class="nav-item-figma" (click)="goToCategories()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7H8V12H3V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13 7H18V12H13V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13 17H18V22H13V17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 17H8V22H3V17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Categorías</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                
                <button class="nav-item-figma position-relative" (click)="goToSaved()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72722 21.351 5.1208 20.84 4.61V4.61Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Guardados</span>
                  <span *ngIf="savedItems > 0" class="badge-figma">{{savedItems}}</span>
                </button>
                
                <button class="nav-item-figma position-relative" (click)="goToCart()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Mi carrito</span>
                  <span *ngIf="cartItems > 0" class="badge-figma">{{cartItems}}</span>
                </button>
                
                <button class="profile-btn-figma" (click)="goToLogin()">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Banner principal con Bootstrap -->
      <section class="hero-section my-4">
        <div class="container">
          <div class="row align-items-center hero-banner-custom p-4 rounded-4">
            <div class="col-md-8">
              <h1 class="display-4 fw-bold text-custom-dark mb-3">
                LOS LIBROS, COMO BUENOS AMIGOS:
              </h1>
              <p class="banner-subtitle">
                siempre están cuando los necesitas.
              </p>
            </div>
            <div class="col-md-4 text-center">
              <div class="books-illustration">
                📚📖📓📗📘📙
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Grid de libros con Bootstrap -->
      <section class="books-section">
        <div class="container">
          <div class="row g-4">
            <div class="col-12 col-sm-6 col-lg-4" *ngFor="let book of books">
              <div class="card book-card-custom h-100">
                <div class="position-relative">
                  <img [src]="book.image" [alt]="book.title" class="card-img-top book-img-custom">
                  <button class="btn save-btn-custom position-absolute" (click)="addToSaved(book)">
                    ❤️
                  </button>
                </div>
                
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title text-custom-dark">{{book.title}}</h5>
                  <p class="card-text text-muted mb-3">{{book.author}}</p>
                  
                  <div class="mt-auto d-flex justify-content-between align-items-center">
                    <small class="text-muted">{{book.type}}</small>
                    <button 
                      class="btn btn-sm"
                      [ngClass]="{
                        'btn-custom-primary': book.type === 'Venta',
                        'btn-custom-info': book.type === 'Intercambio',
                        'btn-custom-success': book.type === 'Donación'
                      }"
                      (click)="book.type === 'Intercambio' ? makeOffer(book) : addToCart(book)"
                    >
                      <span *ngIf="book.type === 'Intercambio'">Hacer oferta</span>
                      <span *ngIf="book.type !== 'Intercambio'">Añadir al carrito</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchTerm = '';
  cartItems = 0;
  savedItems = 0;

  books = [
    {
      id: 1,
      title: 'Drácula',
      author: 'Bram Stoker',
      price: 250,
      type: 'Venta',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
      category: 'Terror'
    },
    {
      id: 2,
      title: 'Fundamentos de programación Java',
      author: 'Varios',
      price: 450,
      type: 'Venta',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      category: 'Programación'
    },
    {
      id: 3,
      title: 'Baldor',
      author: 'Aurelio Baldor',
      price: 0,
      type: 'Donación',
      image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=300&h=400&fit=crop',
      category: 'Matemáticas'
    },
    {
      id: 4,
      title: 'Frieren',
      author: 'Manga',
      price: 300,
      type: 'Intercambio',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
      category: 'Manga'
    },
    {
      id: 5,
      title: 'One Piece',
      author: 'Eiichiro Oda',
      price: 200,
      type: 'Venta',
      image: 'https://images.unsplash.com/photo-1612178991618-2928271778e4?w=300&h=400&fit=crop',
      category: 'Manga'
    },
    {
      id: 6,
      title: 'Metamorfosis',
      author: 'Franz Kafka',
      price: 0,
      type: 'Donación',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
      category: 'Literatura'
    }
  ];

  constructor(private router: Router) {}

  onSearch() {
    console.log('Buscando:', this.searchTerm);
  }

  addToCart(book: any) {
    this.cartItems++;
    console.log('Agregado al carrito:', book.title);
  }

  addToSaved(book: any) {
    this.savedItems++;
    console.log('Agregado a guardados:', book.title);
  }

  makeOffer(book: any) {
    console.log('Hacer oferta para:', book.title);
  }

  goToLogin() {
    this.router.navigate(['/']);
  }

  goToCategories() {
    console.log('Ir a categorías');
  }

  goToSaved() {
    console.log('Ir a guardados');
  }

  goToCart() {
    console.log('Ir al carrito');
  }
}