// ============================================
// 📁 ACTUALIZAR: src/app/save/save.component.ts - ERRORES CORREGIDOS
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { Book } from '../models/Book.model';

@Component({
  selector: 'app-save',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {
  cartItems = 0;
  savedItems = 0;
  selectedCategory = 'Todas';
  
  // Libros guardados (simulados) - ✅ CORREGIDO CON TU MODELO
  savedBooks: Book[] = [
    {
      id: 1,
      titulo: "Drácula",
      isbn: "9786254449970",
      autor: "Bram Stoker",
      editorial: "Pinky Penguin",
      fecha_publicacion: "1897-05-26",
      id_estado_libro: 1,
      precio: 190.00,
      descripcion: "Una obra maestra del género gótico. La historia se desarrolla a través de cartas, diarios y recortes de periódicos.",
      portada: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'><rect width='200' height='300' fill='%23f0f8ff'/><circle cx='100' cy='150' r='40' fill='%236A93B2'/><text x='100' y='250' font-family='Arial' font-size='12' text-anchor='middle' fill='%232F4653'>Drácula</text></svg>",
      id_usuario: 1,
      id_categoria: 1,
      disponibilidad: 1,
      estatus: 1,
      id_tipo_transaccion: 1,
      categoria_nombre: "Literatura",
      estado_libro: "Usado", // ✅ CORREGIDO: estado_libro en lugar de estado_libro_nombre
      tipo_transaccion_nombre: "Venta"
    },
    {
      id: 2,
      titulo: "Fundamentos de programación Java",
      isbn: "9788441539580",
      autor: "Varios Autores",
      editorial: "ANAYA Multimedia",
      fecha_publicacion: "2023-01-15",
      id_estado_libro: 1,
      precio: 0,
      descripcion: "Manual completo para aprender programación en Java desde cero. Incluye conceptos básicos y ejercicios prácticos.",
      portada: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'><rect width='200' height='300' fill='%23e6f3ff'/><circle cx='100' cy='150' r='40' fill='%23007bff'/><text x='100' y='240' font-family='Arial' font-size='10' text-anchor='middle' fill='%232F4653'>Java</text><text x='100' y='255' font-family='Arial' font-size='10' text-anchor='middle' fill='%232F4653'>Programming</text></svg>",
      id_usuario: 2,
      id_categoria: 3,
      disponibilidad: 1,
      estatus: 1,
      id_tipo_transaccion: 2,
      categoria_nombre: "Ciencias y tecnología",
      estado_libro: "Nuevo", // ✅ CORREGIDO: estado_libro en lugar de estado_libro_nombre
      tipo_transaccion_nombre: "Donación"
    },
    {
      id: 3,
      titulo: "El Arte de la Guerra",
      isbn: "9788441421240",
      autor: "Sun Tzu",
      editorial: "EDAF",
      fecha_publicacion: "2020-03-10",
      id_estado_libro: 2,
      precio: 0,
      descripcion: "Tratado sobre estrategia militar escrito por Sun Tzu en el siglo VI a.C. Influye en el pensamiento militar y empresarial.",
      portada: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'><rect width='200' height='300' fill='%23fff5e6'/><circle cx='100' cy='150' r='40' fill='%23fd7e14'/><text x='100' y='245' font-family='Arial' font-size='11' text-anchor='middle' fill='%232F4653'>El Arte de</text><text x='100' y='260' font-family='Arial' font-size='11' text-anchor='middle' fill='%232F4653'>la Guerra</text></svg>",
      id_usuario: 3,
      id_categoria: 2,
      disponibilidad: 1,
      estatus: 1,
      id_tipo_transaccion: 3,
      categoria_nombre: "Historia y filosofía",
      estado_libro: "Usado", // ✅ CORREGIDO: estado_libro en lugar de estado_libro_nombre
      tipo_transaccion_nombre: "Intercambio"
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('SaveComponent: Componente iniciado');
    this.updateSavedCount();
    
    // Manejar parámetros de la URL
    this.route.queryParams.subscribe(params => {
      if (params['category'] && params['category'] !== this.selectedCategory) {
        console.log('Categoría desde URL:', params['category']);
        this.selectedCategory = params['category'];
        this.router.navigate(['/home'], { 
          queryParams: { category: params['category'] },
          replaceUrl: true 
        });
      }
      if (params['search']) {
        console.log('Búsqueda desde save:', params['search']);
        this.router.navigate(['/home'], { 
          queryParams: { search: params['search'] },
          replaceUrl: true 
        });
      }
    });
  }

  // ✅ GETTER PARA LIBROS FILTRADOS - Sin arrow functions
  get filteredBooks(): Book[] {
    if (this.selectedCategory === 'Todas') {
      return this.savedBooks;
    }
    return this.savedBooks.filter(book => book.categoria_nombre === this.selectedCategory);
  }

  // ✅ GETTER PARA CATEGORÍAS DISPONIBLES - TIPOS CORREGIDOS
  get availableCategories(): string[] {
    const categories = this.savedBooks
      .map(book => book.categoria_nombre)
      .filter((categoria): categoria is string => Boolean(categoria)); // ✅ Type guard para filtrar undefined
    return [...new Set(categories)];
  }

  // ✅ MÉTODO PARA CONTAR LIBROS POR CATEGORÍA
  getCategoryCount(category: string): number {
    if (category === 'Todas') {
      return this.savedBooks.length;
    }
    return this.savedBooks.filter(book => book.categoria_nombre === category).length;
  }

  // Actualizar contador de guardados
  updateSavedCount() {
    this.savedItems = this.savedBooks.length;
  }

  // Seleccionar categoría desde header
  onCategorySelected(category: string) {
    console.log('SaveComponent: Categoría seleccionada desde header:', category);
    this.router.navigate(['/home'], {
      queryParams: { category: category },
      replaceUrl: true,
    });
  }

  // Búsqueda desde header
  onSearchPerformed(searchTerm: string) {
    console.log('SaveComponent: Búsqueda desde header:', searchTerm);
    this.router.navigate(['/home'], {
      queryParams: { search: searchTerm },
      replaceUrl: true,
    });
  }

  // Ver detalles del libro
  viewBookDetail(book: Book): void {
    console.log('SaveComponent: Navegando al detalle del libro:', book.titulo);
    
    const tipoTransaccion = book.tipo_transaccion_nombre || 'Venta';
    
    if (tipoTransaccion === 'Venta') {
      this.router.navigate(['/book', book.id]);
    } else if (tipoTransaccion === 'Intercambio') {
      this.router.navigate(['/exchange', book.id]);
    } else if (tipoTransaccion === 'Donación') {
      this.router.navigate(['/donation', book.id]);
    } else {
      console.warn('Tipo de libro no reconocido:', tipoTransaccion);
      this.router.navigate(['/book', book.id]);
    }
  }

  // Ver información del vendedor/propietario
  viewSellerInfo(book: Book): void {
    console.log('SaveComponent: Navegando a información del usuario:', book.id_usuario);
    this.router.navigate(['/seller', book.id_usuario]);
  }

  // Remover libro de guardados
  removeFromSaved(book: Book): void {
    console.log('SaveComponent: Removiendo libro de guardados:', book.titulo);
    
    const index = this.savedBooks.findIndex(b => b.id === book.id);
    if (index > -1) {
      this.savedBooks.splice(index, 1);
      this.updateSavedCount();
      
      // Si no quedan libros en la categoría actual, cambiar a "Todas"
      if (this.filteredBooks.length === 0 && this.selectedCategory !== 'Todas') {
        this.selectedCategory = 'Todas';
      }
      
      console.log(`Libro "${book.titulo}" removido de guardados`);
    }
  }

  // Limpiar todos los guardados
  clearAllSaved(): void {
    if (confirm('¿Estás seguro de que quieres remover todos los libros guardados?')) {
      console.log('SaveComponent: Limpiando todos los guardados');
      this.savedBooks = [];
      this.updateSavedCount();
      this.selectedCategory = 'Todas';
    }
  }

  // Obtener acción del botón según tipo
  getButtonAction(book: Book): void {
    console.log('SaveComponent: Acción para libro tipo:', book.tipo_transaccion_nombre);
    const tipoTransaccion = book.tipo_transaccion_nombre || 'Venta';
    
    switch (tipoTransaccion) {
      case 'Venta':
        this.addToCart(book);
        break;
      case 'Donación':
        this.requestBook(book);
        break;
      case 'Intercambio':
        this.makeOffer(book);
        break;
      default:
        this.addToCart(book);
        break;
    }
  }

  // Obtener texto del botón según tipo
  getButtonText(type: string | undefined): string {
    const tipoTransaccion = type || 'Venta';
    
    switch (tipoTransaccion) {
      case 'Venta':
        return 'Añadir al carrito';
      case 'Donación':
        return 'Solicitar libro';
      case 'Intercambio':
        return 'Hacer oferta';
      default:
        return 'Añadir al carrito';
    }
  }

  // Añadir al carrito
  addToCart(book: Book): void {
    console.log('SaveComponent: Añadiendo al carrito:', book.titulo);
    this.cartItems++;
    // TODO: Integrar con servicio de carrito real
    alert(`"${book.titulo}" añadido al carrito`);
  }

  // Solicitar libro de donación
  requestBook(book: Book): void {
    console.log('SaveComponent: Solicitando donación:', book.titulo);
    alert(`Solicitud enviada para: "${book.titulo}"`);
  }

  // Hacer oferta de intercambio
  makeOffer(book: Book): void {
    console.log('SaveComponent: Navegando a hacer oferta:', book.titulo);
    this.router.navigate(['/exchange', book.id, 'offer']);
  }

  // ✅ MÉTODO AGREGADO - Explorar libros
  goToExplore(): void {
    console.log('SaveComponent: Navegando a explorar libros');
    this.router.navigate(['/home']);
  }
}