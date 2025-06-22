import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-save',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent {
  searchTerm = '';
  cartItems = 0;
  showCategoriesDropdown = false;
  showProfileDropdown = false;

  // Lista de categorías del dropdown
  categories = [
    'Literatura',
    'Ciencias y tecnología',
    'Historia y filosofía',
    'Economía y negocios',
    'Arte y cultura',
    'Desarrollo personal',
    'Ciencias sociales',
    'Idiomas y lingüística',
    'Cocina y alimentación',
    'Deportes y aventura',
    'Religión y espiritualidad',
    'Entretenimiento y hobbies',
    'Ciencia ficción'
  ];

  // Libros guardados - En producción esto vendría del backend
  savedBooks = [
    {
      id: 1,
      title: 'Drácula',
      author: 'Bram Stoker',
      price: 250,
      type: 'Venta',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
      category: 'Literatura',
      description: 'Clásico de la literatura gótica que ha inspirado generaciones.',
      savedDate: new Date('2024-01-15')
    },
    {
      id: 3,
      title: 'El Arte de la Guerra',
      author: 'Sun Tzu',
      price: 0,
      type: 'Intercambio',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
      category: 'Historia y filosofía',
      description: 'Tratado sobre estrategia militar y filosofía antigua china.',
      savedDate: new Date('2024-01-10')
    }
  ];

  constructor(private router: Router) {}

  onSearch() {
    console.log('Buscando en guardados:', this.searchTerm);
    // 🔌 AQUÍ INTEGRAR BACKEND - Búsqueda en favoritos
    // this.favoritesService.searchSavedBooks(this.searchTerm).subscribe(...)
  }

  addToCart(book: any) {
    this.cartItems++;
    console.log('Agregado al carrito desde guardados:', book.title);
    // 🔌 AQUÍ INTEGRAR BACKEND - Agregar al carrito
    // this.cartService.addToCart(book.id).subscribe(...)
  }

  requestBook(book: any) {
    console.log('Solicitando donación de libro desde guardados:', book.title);
    alert(`Solicitud enviada para: ${book.title}`);
    // 🔌 AQUÍ INTEGRAR BACKEND - Solicitar donación
    // this.donationService.requestBook(book.id).subscribe(...)
  }

  makeOffer(book: any) {
    console.log('Hacer oferta desde guardados:', book.title);
    // 🔌 AQUÍ INTEGRAR BACKEND - Crear oferta de intercambio
    // this.exchangeService.createOffer(book.id, offerData).subscribe(...)
  }

  removeFromSaved(book: any) {
    // Eliminar el libro de la lista de guardados
    this.savedBooks = this.savedBooks.filter(savedBook => savedBook.id !== book.id);
    console.log('Libro eliminado de guardados:', book.title);
    
    // 🔌 AQUÍ INTEGRAR BACKEND - Remover de favoritos
    // this.favoritesService.removeFromFavorites(book.id).subscribe({
    //   next: () => {
    //     console.log('Libro removido del backend');
    //   },
    //   error: (error) => {
    //     console.error('Error al remover del backend:', error);
    //     // Revertir cambio local si falla el backend
    //     this.loadSavedBooks();
    //   }
    // });
  }

  // Métodos para obtener el texto del botón según el tipo
  getButtonText(type: string): string {
    switch(type) {
      case 'Venta': 
        return 'Añadir al carrito';
      case 'Donación': 
        return 'Solicitar libro';
      case 'Intercambio': 
        return 'Hacer oferta';
      default: 
        return 'Acción';
    }
  }

  getButtonAction(book: any) {
    switch(book.type) {
      case 'Venta': 
        this.addToCart(book);
        break;
      case 'Donación': 
        this.requestBook(book);
        break;
      case 'Intercambio': 
        this.makeOffer(book);
        break;
    }
  }

  // Métodos para categorías
  toggleCategoriesDropdown(event: Event) {
    event.stopPropagation();
    this.showCategoriesDropdown = !this.showCategoriesDropdown;
    this.showProfileDropdown = false;
  }

  closeDropdownOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container') && !target.closest('.profile-btn-figma')) {
      this.showCategoriesDropdown = false;
      this.showProfileDropdown = false;
    }
  }

  // Métodos para el dropdown del perfil
  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
    this.showCategoriesDropdown = false;
  }

  goToProfile() {
    this.showProfileDropdown = false;
    console.log('Ir a Mi cuenta');
    // 🔌 AQUÍ INTEGRAR BACKEND - Navegar al perfil
    // this.router.navigate(['/profile']);
  }

  goToOrders() {
    this.showProfileDropdown = false;
    console.log('Ir a Mis pedidos');
    // 🔌 AQUÍ INTEGRAR BACKEND - Navegar a pedidos
    // this.router.navigate(['/orders']);
  }

  goToLogin() {
    this.showProfileDropdown = false;
    this.router.navigate(['/']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToCart() {
    console.log('Ir al carrito');
    // 🔌 AQUÍ INTEGRAR BACKEND - Navegar al carrito
    // this.router.navigate(['/cart']);
  }

  // 🔌 MÉTODO PARA BACKEND - Cargar libros guardados
  loadSavedBooks() {
    // En producción, cargar desde el backend:
    /*
    this.favoritesService.getSavedBooks().subscribe({
      next: (books) => {
        this.savedBooks = books;
        console.log('Libros guardados cargados:', books);
      },
      error: (error) => {
        console.error('Error cargando libros guardados:', error);
      }
    });
    */
  }
}