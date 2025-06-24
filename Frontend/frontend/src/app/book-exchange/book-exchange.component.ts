// ============================================
// 📁 src/app/book-exchange/book-exchange.component.ts
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-book-exchange',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './book-exchange.component.html',
  styleUrls: ['./book-exchange.component.css']
})
export class BookExchangeComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  bookId: string | null = null;
  
  // ✨ SOLO LIBROS DE INTERCAMBIO - Datos simulados
  book = {
    id: 3,
    title: 'El Arte de la Guerra',
    author: 'Sun Tzu',
    price: 0,
    condition: 'Usado',
    owner: 'Carlos Mendoza',
    type: 'Intercambio',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    category: 'Historia y filosofía',
    pages: 96,
    publishDate: '10/03/20',
    isbn: '9788441421240',
    editorial: 'EDAF',
    transaction: 'Intercambio',
    synopsis: 'Tratado sobre estrategia militar escrito por Sun Tzu en el siglo VI a.C. Este clásico texto chino ha influido tanto en el pensamiento militar como en la filosofía empresarial moderna.',
    details: 'Las enseñanzas de Sun Tzu trascienden el ámbito militar y se aplican en negociación, liderazgo y gestión empresarial. Sus principios sobre conocimiento del enemigo y adaptabilidad siguen vigentes.'
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.bookId = params.get('id');
      if (this.bookId) {
        const numericId = parseInt(this.bookId, 10);
        if (isNaN(numericId)) {
          console.error('ID de libro inválido:', this.bookId);
          this.router.navigate(['/home']);
          return;
        }
        this.loadBookDetails(this.bookId);
      } else {
        console.error('No se proporcionó ID de libro');
        this.router.navigate(['/home']);
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        console.log('Categoría seleccionada desde book-exchange:', params['category']);
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        console.log('Búsqueda desde book-exchange:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  loadBookDetails(bookId: string) {
    console.log('Cargando detalles del libro de intercambio ID:', bookId);
    
    const numericId = parseInt(bookId, 10);
    
    // ✨ SOLO LIBROS DE INTERCAMBIO - Datos simulados
    const exchangeBooksData = {
      3: {
        id: 3,
        title: 'El Arte de la Guerra',
        author: 'Sun Tzu',
        price: 0,
        condition: 'Usado',
        owner: 'Carlos Mendoza',
        type: 'Intercambio',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
        category: 'Historia y filosofía',
        pages: 96,
        publishDate: '10/03/20',
        isbn: '9788441421240',
        editorial: 'EDAF',
        transaction: 'Intercambio',
        synopsis: 'Tratado sobre estrategia militar escrito por Sun Tzu en el siglo VI a.C. Este clásico texto chino ha influido tanto en el pensamiento militar como en la filosofía empresarial moderna.',
        details: 'Las enseñanzas de Sun Tzu trascienden el ámbito militar y se aplican en negociación, liderazgo y gestión empresarial. Sus principios sobre conocimiento del enemigo y adaptabilidad siguen vigentes.'
      },
      6: {
        id: 6,
        title: '1984',
        author: 'George Orwell',
        price: 0,
        condition: 'Nuevo',
        owner: 'María Fernández',
        type: 'Intercambio',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        category: 'Literatura',
        pages: 328,
        publishDate: '08/06/49',
        isbn: '9780451524935',
        editorial: 'Signet Classics',
        transaction: 'Intercambio',
        synopsis: 'Una distopía donde el Gran Hermano vigila cada movimiento de los ciudadanos. Winston Smith lucha contra un sistema totalitario que controla hasta los pensamientos.',
        details: 'Considerada una de las novelas más influyentes del siglo XX, 1984 presenta conceptos como el doblepensar, la neolengua y la telepantalla que han trascendido la ficción.'
      },
      7: {
        id: 7,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        price: 0,
        condition: 'Usado',
        owner: 'Roberto Silva',
        type: 'Intercambio',
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
        category: 'Historia y filosofía',
        pages: 512,
        publishDate: '04/02/15',
        isbn: '9788499926223',
        editorial: 'Debate',
        transaction: 'Intercambio',
        synopsis: 'Una breve historia de la humanidad que explora cómo Homo sapiens llegó a dominar el mundo. Desde la revolución cognitiva hasta la revolución científica.',
        details: 'Harari examina las tres revoluciones que han configurado a la humanidad: la cognitiva, la agrícola y la científica, y especula sobre el futuro de nuestra especie.'
      }
    };

    const bookData = exchangeBooksData[numericId as keyof typeof exchangeBooksData];
    if (bookData) {
      this.book = bookData;
    } else {
      console.warn('Libro de intercambio no encontrado, usando datos por defecto');
    }

    // 🔌 AQUÍ INTEGRAR BACKEND - Solo libros de intercambio
    // this.exchangeService.getBookById(bookId).subscribe(...)
  }

  makeOffer() {
    console.log('Navegando a página de hacer oferta para:', this.book.title);
    // Navegar a la página de hacer oferta
    this.router.navigate(['/exchange', this.book.id, 'offer']);
  }

  toggleSaveBook() {
    const wasLiked = this.isBookSaved();
    this.savedItems = wasLiked ? this.savedItems - 1 : this.savedItems + 1;
    
    const message = wasLiked 
      ? `"${this.book.title}" removido de guardados` 
      : `"${this.book.title}" guardado en favoritos`;
    
    console.log(message);
    this.showSuccessMessage(message);
  }

  isBookSaved(): boolean {
    return this.savedItems > 0;
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/home']);
    }
  }

  private showSuccessMessage(message: string) {
    console.log('✅', message);
  }

  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde book-exchange:', searchTerm);
    this.router.navigate(['/home'], { 
      queryParams: { search: searchTerm },
      replaceUrl: true 
    });
  }
}