// src/app/home/home.component.ts - VERSIÓN CON BOOTSTRAP
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
              <div class="logo-custom">LOGO</div>
            </div>

            <!-- Buscador -->
            <div class="col">
              <div class="search-wrapper mx-3">
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control search-input-custom"
                    [(ngModel)]="searchTerm"
                    placeholder="Buscar libros..."
                    (keyup.enter)="onSearch()"
                  >
                  <button 
                    class="btn search-btn-custom" 
                    type="button"
                    (click)="onSearch()"
                  >
                    🔍
                  </button>
                </div>
              </div>
            </div>

            <!-- Navegación -->
            <div class="col-auto">
              <div class="d-flex gap-3 align-items-center">
                <button class="btn nav-btn-custom" (click)="goToCategories()">
                  📂 Categorías
                  <i class="ms-1">▼</i>
                </button>
                
                <button class="btn nav-btn-custom position-relative" (click)="goToSaved()">
                  ❤️ Guardados
                  <span *ngIf="savedItems > 0" class="badge-custom">{{savedItems}}</span>
                </button>
                
                <button class="btn nav-btn-custom position-relative" (click)="goToCart()">
                  🛒 Mi carrito
                  <span *ngIf="cartItems > 0" class="badge-custom">{{cartItems}}</span>
                </button>
                
                <button class="btn profile-btn-custom" (click)="goToLogin()">
                  👤
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