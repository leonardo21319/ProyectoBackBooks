// ============================================
// 📁 ACTUALIZAR: src/app/book-sale/book-sale.component.ts
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { ApiService } from '../servicios/api.service';
import { Book } from '../models/Book.model';

@Component({
  selector: 'app-book-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './book-sale.component.html',
  styleUrls: ['./book-sale.component.css'],
})
export class BookSaleComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  bookId!: number;
  book: (Book & { vendedor: string; vendedorId: number }) | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ApiService: ApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.route.paramMap.subscribe((params) => {
        const id = Number(params.get('id'));
        if (!id) {
          this.router.navigate(['/home']);
          return;
        }
        this.bookId = id;
        this.loadBookDetails();
      });
    });
  }

  loadBookDetails(): void {
    this.ApiService.obtenerLibroPorId(this.bookId).subscribe({
      next: (res) => {
        console.log(res);
        this.book = {
          ...res,
          vendedorId: res.id_usuario,
          portada: res.portada
            ? `https://proyectobackend-4r99.onrender.com${res.portada}`
            : 'assets/default-cover.jpg',
          tipo_transaccion_nombre: res.tipo_transaccion,
          categoria_nombre: res.categoria,
        };
      },
      error: () => {
        this.router.navigate(['/home']);
      },
    });
  }

  addToCart() {
    this.cartItems++;
    console.log('Libro agregado al carrito:', this.book?.titulo);
    this.showSuccessMessage(`"${this.book?.titulo}" agregado al carrito`);
  }

  toggleSaveBook() {
    const wasLiked = this.isBookSaved();
    this.savedItems = wasLiked ? this.savedItems - 1 : this.savedItems + 1;

    const message = wasLiked
      ? `"${this.book?.titulo}" removido de guardados`
      : `"${this.book?.titulo}" guardado en favoritos`;

    console.log(message);
    this.showSuccessMessage(message);
  }

  isBookSaved(): boolean {
    return this.savedItems > 0;
  }

  // ✨ NUEVO MÉTODO - Navegar a información del vendedor
  viewSellerInfo(): void {
    console.log(
      'Navegando a información del vendedor ID:',
      this.book?.vendedorId
    );
    this.router.navigate(['/seller', this.book?.vendedorId]);
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
      replaceUrl: true,
    });
  }
}
