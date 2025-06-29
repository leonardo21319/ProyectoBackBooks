// ============================================
// 📁 ACTUALIZAR: src/app/book-donation/book-donation.component.ts
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-book-donation',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './book-donation.component.html',
  styleUrls: ['./book-donation.component.css']
})
export class BookDonationComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  bookId: string | null = null;
  showSuccessPopup: boolean = false; // ✨ Control del popup de éxito
  showErrorPopup: boolean = false; // ✨ Control del popup de error
  
  // ✨ SOLO LIBROS DE DONACIÓN - Datos simulados
  book = {
    id: 2,
    title: 'Fundamentos de programación Java',
    author: 'Varios Autores',
    price: 0,
    condition: 'Nuevo',
    donor: 'Ana García López',
    donorId: 2, // ✨ ID del donante para navegación
    type: 'Donación',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    category: 'Ciencias y tecnología',
    pages: 650,
    publishDate: '15/01/23',
    isbn: '9788441539580',
    editorial: 'ANAYA Multimedia',
    transaction: 'Donación',
    synopsis: 'Manual completo para aprender programación en Java desde cero. Incluye conceptos básicos, estructuras de datos, programación orientada a objetos y desarrollo de aplicaciones.',
    details: 'Este libro está diseñado para estudiantes y profesionales que desean dominar Java. Incluye ejercicios prácticos, ejemplos de código y proyectos reales para consolidar el aprendizaje.',
    isAvailable: true // ✨ Por defecto disponible
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
        console.log('Categoría seleccionada desde book-donation:', params['category']);
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        console.log('Búsqueda desde book-donation:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  loadBookDetails(bookId: string) {
    console.log('Cargando detalles del libro de donación ID:', bookId);
    
    const numericId = parseInt(bookId, 10);
    
    // ✨ SOLO LIBROS DE DONACIÓN - Datos simulados con donorId
    const donationBooksData = {
      2: {
        id: 2,
        title: 'Fundamentos de programación Java',
        author: 'Varios Autores',
        price: 0,
        condition: 'Nuevo',
        donor: 'Ana García López',
        donorId: 2, // ✨ ID del donante
        type: 'Donación',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        category: 'Ciencias y tecnología',
        pages: 650,
        publishDate: '15/01/23',
        isbn: '9788441539580',
        editorial: 'ANAYA Multimedia',
        transaction: 'Donación',
        synopsis: 'Manual completo para aprender programación en Java desde cero. Incluye conceptos básicos, estructuras de datos, programación orientada a objetos y desarrollo de aplicaciones.',
        details: 'Este libro está diseñado para estudiantes y profesionales que desean dominar Java. Incluye ejercicios prácticos, ejemplos de código y proyectos reales para consolidar el aprendizaje.',
        isAvailable: true // ✨ Disponible
      },
      8: {
        id: 8,
        title: 'Introducción a Python',
        author: 'Mark Lutz',
        price: 0,
        condition: 'Usado',
        donor: 'Pedro Martínez',
        donorId: 4, // ✨ ID del donante
        type: 'Donación',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
        category: 'Ciencias y tecnología',
        pages: 720,
        publishDate: '12/08/21',
        isbn: '9781449355739',
        editorial: 'O\'Reilly Media',
        transaction: 'Donación',
        synopsis: 'Guía completa para aprender Python desde cero. Cubre desde conceptos básicos hasta técnicas avanzadas de programación en Python.',
        details: 'Ideal para principiantes y programadores experimentados que quieren aprender Python. Incluye ejemplos prácticos y casos de uso reales.',
        isAvailable: true // ✨ Disponible
      },
      9: {
        id: 9,
        title: 'Matemáticas para Ingeniería',
        author: 'Erwin Kreyszig',
        price: 0,
        condition: 'Usado',
        donor: 'Laura Jiménez',
        donorId: 5, // ✨ ID del donante
        type: 'Donación',
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
        category: 'Ciencias y tecnología',
        pages: 1280,
        publishDate: '05/09/20',
        isbn: '9786073237932',
        editorial: 'Limusa Wiley',
        transaction: 'Donación',
        synopsis: 'Texto completo de matemáticas avanzadas para estudiantes de ingeniería. Incluye álgebra lineal, cálculo diferencial e integral, y ecuaciones diferenciales.',
        details: 'Reconocido mundialmente como uno de los mejores textos de matemáticas para ingeniería. Contiene teoría, ejemplos resueltos y ejercicios graduados.',
        isAvailable: false // ✨ Ya reclamado
      }
    };

    const bookData = donationBooksData[numericId as keyof typeof donationBooksData];
    if (bookData) {
      this.book = bookData;
    } else {
      console.warn('Libro de donación no encontrado, usando datos por defecto');
    }

    // 🔌 AQUÍ INTEGRAR BACKEND - Solo libros de donación
    // this.donationService.getBookById(bookId).subscribe(...)
  }

  requestBook() {
    console.log('Solicitando libro:', this.book.title);
    
    // ✨ Verificar disponibilidad del libro
    if (this.book.isAvailable === false) {
      // Libro ya reclamado - mostrar mensaje de error
      this.showErrorPopup = true;
      return;
    }

    // ✨ Libro disponible - mostrar mensaje de éxito
    this.showSuccessPopup = true;

    // 🔌 AQUÍ INTEGRAR BACKEND - Procesar solicitud
    // this.donationService.requestBook(this.book.id).subscribe({
    //   next: (response) => {
    //     if (response.success) {
    //       this.showSuccessPopup = true;
    //     } else {
    //       this.showErrorPopup = true;
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Error solicitando libro:', error);
    //     this.showErrorPopup = true;
    //   }
    // });
  }

  // ✨ NUEVO MÉTODO - Cerrar popup de éxito y regresar
  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.router.navigate(['/donation', this.book.id]);
  }

  // ✨ NUEVO MÉTODO - Cerrar popup de error y regresar
  closeErrorPopup() {
    this.showErrorPopup = false;
    this.router.navigate(['/donation', this.book.id]);
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

  // ✨ NUEVO MÉTODO - Navegar a información del donante
  viewDonorInfo(): void {
    console.log('Navegando a información del donante ID:', this.book.donorId);
    this.router.navigate(['/seller', this.book.donorId]);
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
    console.log('Búsqueda desde book-donation:', searchTerm);
    this.router.navigate(['/home'], { 
      queryParams: { search: searchTerm },
      replaceUrl: true 
    });
  }
}