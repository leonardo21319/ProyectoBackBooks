// ============================================
// 📁 src/app/book-exchange-offer/book-exchange-offer.component.ts
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-book-exchange-offer',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './book-exchange-offer.component.html',
  styleUrls: ['./book-exchange-offer.component.css']
})
export class BookExchangeOfferComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  bookId: string | null = null;
  offerText: string = '';
  showSuccessPopup: boolean = false; // ✨ Control del popup
  
  // Datos del libro para el cual se hace la oferta
  book = {
    id: 3,
    title: 'El Arte de la Guerra',
    author: 'Sun Tzu',
    owner: 'Carlos Mendoza',
    type: 'Intercambio',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop'
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtener el ID del libro desde la ruta
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

    // Manejar redirecciones por categorías/búsqueda desde el header
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        console.log('Categoría seleccionada desde book-exchange-offer:', params['category']);
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        console.log('Búsqueda desde book-exchange-offer:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  loadBookDetails(bookId: string) {
    console.log('Cargando detalles del libro para oferta ID:', bookId);
    
    const numericId = parseInt(bookId, 10);
    
    // Datos simulados de libros de intercambio
    const exchangeBooksData = {
      3: {
        id: 3,
        title: 'El Arte de la Guerra',
        author: 'Sun Tzu',
        owner: 'Carlos Mendoza',
        type: 'Intercambio',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop'
      },
      6: {
        id: 6,
        title: '1984',
        author: 'George Orwell',
        owner: 'María Fernández',
        type: 'Intercambio',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
      },
      7: {
        id: 7,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        owner: 'Roberto Silva',
        type: 'Intercambio',
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'
      }
    };

    const bookData = exchangeBooksData[numericId as keyof typeof exchangeBooksData];
    if (bookData) {
      this.book = bookData;
    } else {
      console.warn('Libro de intercambio no encontrado, usando datos por defecto');
    }

    // 🔌 AQUÍ INTEGRAR BACKEND - Cargar datos del libro
    // this.exchangeService.getBookById(bookId).subscribe(...)
  }

  sendOffer() {
    if (!this.offerText.trim()) {
      alert('Por favor, escribe tu oferta antes de enviar.');
      return;
    }

    console.log('Enviando oferta para:', this.book.title);
    console.log('Texto de la oferta:', this.offerText);
    
    // Simular envío de oferta
    const offerData = {
      bookId: this.book.id,
      bookTitle: this.book.title,
      owner: this.book.owner,
      offerText: this.offerText,
      timestamp: new Date().toISOString()
    };

    // 🔌 AQUÍ INTEGRAR BACKEND - Enviar oferta
    // this.exchangeService.sendOffer(offerData).subscribe({
    //   next: (response) => {
    //     this.showSuccessPopup = true;
    //   },
    //   error: (error) => {
    //     console.error('Error enviando oferta:', error);
    //     this.showErrorMessage('Error al enviar la oferta. Inténtalo de nuevo.');
    //   }
    // });

    // ✨ Mostrar popup de éxito
    this.showSuccessPopup = true;
  }

  // ✨ NUEVO MÉTODO - Cerrar popup y regresar
  closeSuccessPopup() {
    this.showSuccessPopup = false;
    // Regresar a la página del libro después de cerrar el popup
    this.router.navigate(['/exchange', this.book.id]);
  }

  cancel() {
    console.log('Cancelando oferta');
    // Regresar a la página del libro sin enviar la oferta
    this.router.navigate(['/exchange', this.book.id]);
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
    console.log('Búsqueda desde book-exchange-offer:', searchTerm);
    this.router.navigate(['/home'], { 
      queryParams: { search: searchTerm },
      replaceUrl: true 
    });
  }
}