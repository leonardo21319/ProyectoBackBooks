// ============================================
// 📁 CREAR: src/app/servicios/saved.service.ts
// ============================================

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/Book.model';

@Injectable({
  providedIn: 'root'
})
export class SavedService {
  private savedBooksSubject = new BehaviorSubject<Book[]>([]);
  public savedBooks$ = this.savedBooksSubject.asObservable();

  private savedBookIds = new Set<number>();

  constructor() {
    // Cargar libros guardados desde localStorage al inicializar
    this.loadSavedBooksFromStorage();
  }

  // Obtener libros guardados actuales
  getSavedBooks(): Book[] {
    return this.savedBooksSubject.value;
  }

  // Obtener IDs de libros guardados
  getSavedBookIds(): Set<number> {
    return new Set(this.savedBookIds);
  }

  // Verificar si un libro está guardado
  isBookSaved(bookId: number): boolean {
    return this.savedBookIds.has(bookId);
  }

  // Agregar libro a guardados
  addToSaved(book: Book): void {
    if (!this.savedBookIds.has(book.id)) {
      this.savedBookIds.add(book.id);
      const currentBooks = this.savedBooksSubject.value;
      const updatedBooks = [...currentBooks, book];
      this.savedBooksSubject.next(updatedBooks);
      this.saveBooksToStorage();
      console.log('Libro agregado a guardados:', book.titulo);
    }
  }

  // Remover libro de guardados
  removeFromSaved(bookId: number): void {
    if (this.savedBookIds.has(bookId)) {
      this.savedBookIds.delete(bookId);
      const currentBooks = this.savedBooksSubject.value;
      const updatedBooks = currentBooks.filter(book => book.id !== bookId);
      this.savedBooksSubject.next(updatedBooks);
      this.saveBooksToStorage();
      console.log('Libro removido de guardados:', bookId);
    }
  }

  // Toggle: agregar o remover según el estado actual
  toggleSaved(book: Book): boolean {
    if (this.isBookSaved(book.id)) {
      this.removeFromSaved(book.id);
      return false; // Ya no está guardado
    } else {
      this.addToSaved(book);
      return true; // Ahora está guardado
    }
  }

  // Obtener cantidad de libros guardados
  getSavedCount(): number {
    return this.savedBookIds.size;
  }

  // Limpiar todos los guardados
  clearAllSaved(): void {
    this.savedBookIds.clear();
    this.savedBooksSubject.next([]);
    this.saveBooksToStorage();
    console.log('Todos los libros guardados han sido eliminados');
  }

  // Guardar en localStorage
  private saveBooksToStorage(): void {
    try {
      const booksToSave = this.savedBooksSubject.value;
      localStorage.setItem('savedBooks', JSON.stringify(booksToSave));
      localStorage.setItem('savedBookIds', JSON.stringify(Array.from(this.savedBookIds)));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  // Cargar desde localStorage
  private loadSavedBooksFromStorage(): void {
    try {
      const savedBooksJson = localStorage.getItem('savedBooks');
      const savedIdsJson = localStorage.getItem('savedBookIds');
      
      if (savedBooksJson && savedIdsJson) {
        const savedBooks: Book[] = JSON.parse(savedBooksJson);
        const savedIds: number[] = JSON.parse(savedIdsJson);
        
        this.savedBookIds = new Set(savedIds);
        this.savedBooksSubject.next(savedBooks);
        
        console.log('Libros guardados cargados desde localStorage:', savedBooks.length);
      }
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error);
      // Si hay error, inicializar vacío
      this.savedBookIds = new Set();
      this.savedBooksSubject.next([]);
    }
  }

  // Método para sincronizar con backend (para futuro uso)
  // 🔌 AQUÍ INTEGRAR BACKEND
  /*
  syncWithBackend(): Observable<Book[]> {
    return this.http.get<Book[]>('/api/user/saved-books').pipe(
      tap(books => {
        this.savedBooksSubject.next(books);
        this.savedBookIds = new Set(books.map(book => book.id));
        this.saveBooksToStorage();
      })
    );
  }

  saveToBackend(bookId: number): Observable<any> {
    return this.http.post('/api/user/saved-books', { bookId });
  }

  removeFromBackend(bookId: number): Observable<any> {
    return this.http.delete(`/api/user/saved-books/${bookId}`);
  }
  */
}