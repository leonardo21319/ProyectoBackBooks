import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { ApiService } from '../servicios/api.service';
import { Book } from '../models/Book.model';

@Component({
  selector: 'app-book-exchange',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './book-exchange.component.html',
  styleUrls: ['./book-exchange.component.css'],
})
export class BookExchangeComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  bookId: string | null = null;
  book: Book | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ApiService: ApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.bookId = params.get('id');
      if (this.bookId) {
        const numericId = parseInt(this.bookId, 10);
        if (isNaN(numericId)) {
          console.error('ID de libro inválido:', this.bookId);
          this.router.navigate(['/home']);
          return;
        }
        this.loadBookDetails(numericId);
      } else {
        console.error('No se proporcionó ID de libro');
        this.router.navigate(['/home']);
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.router.navigate(['/home'], {
          queryParams: { category: params['category'] },
          replaceUrl: true,
        });
      }
      if (params['search']) {
        this.router.navigate(['/home'], {
          queryParams: { search: params['search'] },
          replaceUrl: true,
        });
      }
    });
  }

  loadBookDetails(bookId: number) {
    console.log('Cargando detalles del libro de intercambio ID:', bookId);
    this.ApiService.obtenerLibroPorId(bookId).subscribe({
      next: (data: Book) => {
        // Asegúrate que solo muestre libros de intercambio (por ID o nombre)
        if (
          data.id_tipo_transaccion === 2 || // Suponiendo que 2 = Intercambio
          data.tipo_transaccion_nombre?.toLowerCase() === 'intercambio'
        ) {
          this.book = data;
        } else {
          console.warn('El libro no es de tipo intercambio.');
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Error al cargar los detalles del libro:', err);
        this.router.navigate(['/home']);
      },
    });
  }

  makeOffer() {
    if (this.book) {
      console.log('Navegando a página de hacer oferta para:', this.book.titulo);
      this.router.navigate(['/exchange', this.book.id, 'offer']);
    }
  }

  toggleSaveBook() {
    if (!this.book) return;
    const wasLiked = this.isBookSaved();
    this.savedItems = wasLiked ? this.savedItems - 1 : this.savedItems + 1;

    const message = wasLiked
      ? `"${this.book.titulo}" removido de guardados`
      : `"${this.book.titulo}" guardado en favoritos`;

    console.log(message);
    this.showSuccessMessage(message);
  }

  isBookSaved(): boolean {
    return this.savedItems > 0;
  }

  guardarLibroMarcador(book: Book) {
    this.ApiService.agregarLibroMarcador(book.id).subscribe({
      next: (res) => console.log('Libro guardado en marcadores:', res),
      error: (e) => console.error('Error al guardar libro en marcadores:', e),
    });
  }

  viewOwnerInfo(): void {
    if (this.book) {
      this.router.navigate(['/seller', this.book.id_usuario]);
    }
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
    this.router.navigate(['/home'], {
      queryParams: { search: searchTerm },
      replaceUrl: true,
    });
  }
}
