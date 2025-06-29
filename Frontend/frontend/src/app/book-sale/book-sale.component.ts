// ============================================
// 📁 ACTUALIZAR: src/app/book-sale/book-sale.component.ts
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-book-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './book-sale.component.html',
  styleUrls: ['./book-sale.component.css']
})
export class BookSaleComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  bookId: string | null = null;
  
  // ✨ SOLO LIBROS DE VENTA - Datos simulados
  book = {
    id: 1,
    title: 'Drácula',
    author: 'Bram Stoker',
    price: 190,
    condition: 'Usado',
    seller: 'Michael Benito Kerr Thatcher',
    sellerId: 1, // ✨ ID del vendedor para navegación
    type: 'Venta',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    category: 'Literatura',
    pages: 418,
    publishDate: '27/04/99',
    isbn: '9786254449970',
    editorial: 'Pinky Penguin',
    transaction: 'Venta',
    synopsis: 'Drácula es una obra maestra del género gótico escrita por Bram Stoker en 1897. La historia se desarrolla a través de cartas, diarios y recortes de periódicos, y relata la travesía del Conde Drácula, Jonathan Harker hasta el castillo del vampiro en Transilvania. El personaje principal y anfitrión no es un simple noble, sino una criatura inmortal que planea expandir su influencia en Londres.',
    details: 'A través de un grupo de personajes liderados por el profesor Van Helsing, la novela explora el enfrentamiento entre la razón y lo sobrenatural, la sexualidad reprimida de la época victoriana y el miedo al extranjero. Con su atmósfera inquietante, personajes memorables y una figura icónica, Drácula se ha consolidado como una de las novelas más influyentes de la literatura universal.'
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
        console.log('Categoría seleccionada desde book-sale:', params['category']);
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        console.log('Búsqueda desde book-sale:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  loadBookDetails(bookId: string) {
    console.log('Cargando detalles del libro ID:', bookId);
    
    const numericId = parseInt(bookId, 10);
    
    // ✨ SOLO LIBROS DE VENTA - Datos simulados con sellerId
    const salesBooksData = {
      1: {
        id: 1,
        title: 'Drácula',
        author: 'Bram Stoker',
        price: 190,
        condition: 'Usado',
        seller: 'Michael Benito Kerr Thatcher',
        sellerId: 1, // ✨ ID del vendedor
        type: 'Venta',
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
        category: 'Literatura',
        pages: 418,
        publishDate: '27/04/99',
        isbn: '9786254449970',
        editorial: 'Pinky Penguin',
        transaction: 'Venta',
        synopsis: 'Drácula es una obra maestra del género gótico escrita por Bram Stoker en 1897. La historia se desarrolla a través de cartas, diarios y recortes de periódicos, y relata la travesía del Conde Drácula, Jonathan Harker hasta el castillo del vampiro en Transilvania.',
        details: 'A través de un grupo de personajes liderados por el profesor Van Helsing, la novela explora el enfrentamiento entre la razón y lo sobrenatural, la sexualidad reprimida de la época victoriana y el miedo al extranjero.'
      },
      4: {
        id: 4,
        title: 'El Señor de los Anillos',
        author: 'J.R.R. Tolkien',
        price: 350,
        condition: 'Nuevo',
        seller: 'Carlos Mendoza',
        sellerId: 3, // ✨ ID del vendedor
        type: 'Venta',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
        category: 'Literatura',
        pages: 1216,
        publishDate: '29/07/54',
        isbn: '9788445000663',
        editorial: 'Minotauro',
        transaction: 'Venta',
        synopsis: 'La Comunidad del Anillo es la primera parte de El Señor de los Anillos, la gran obra de J.R.R. Tolkien. En ella se narra el inicio del viaje de Frodo para destruir el Anillo Único.',
        details: 'Una épica fantasía que ha definido el género durante décadas. La obra maestra de Tolkien combina mitología, aventura y una profunda reflexión sobre el bien y el mal.'
      },
      5: {
        id: 5,
        title: 'Cien años de soledad',
        author: 'Gabriel García Márquez',
        price: 280,
        condition: 'Usado',
        seller: 'Ana García López',
        sellerId: 2, // ✨ ID del vendedor
        type: 'Venta',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        category: 'Literatura',
        pages: 471,
        publishDate: '05/06/67',
        isbn: '9788437604947',
        editorial: 'Cátedra',
        transaction: 'Venta',
        synopsis: 'La historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo. Una obra maestra del realismo mágico.',
        details: 'Considerada una de las obras más importantes de la literatura hispanoamericana y universal del siglo XX. Premio Nobel de Literatura 1982.'
      }
    };

    const bookData = salesBooksData[numericId as keyof typeof salesBooksData];
    if (bookData) {
      this.book = bookData;
    } else {
      console.warn('Libro de venta no encontrado, usando datos por defecto');
    }

    // 🔌 AQUÍ INTEGRAR BACKEND - Solo libros de venta
    // this.salesService.getBookById(bookId).subscribe(...)
  }

  addToCart() {
    this.cartItems++;
    console.log('Libro agregado al carrito:', this.book.title);
    this.showSuccessMessage(`"${this.book.title}" agregado al carrito`);
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

  // ✨ NUEVO MÉTODO - Navegar a información del vendedor
  viewSellerInfo(): void {
    console.log('Navegando a información del vendedor ID:', this.book.sellerId);
    this.router.navigate(['/seller', this.book.sellerId]);
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
    console.log('Búsqueda desde book-sale:', searchTerm);
    this.router.navigate(['/home'], { 
      queryParams: { search: searchTerm },
      replaceUrl: true 
    });
  }
}