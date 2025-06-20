import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchTerm = '';
  cartItems = 0;
  savedItems = 0;

  // Datos de libros mock (basados en tu diseño)
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

  featuredBooks = [
    {
      title: 'LOS LIBROS, COMO BUENOS AMIGOS:',
      subtitle: 'siempre están cuando los necesitas.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=300&fit=crop'
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
