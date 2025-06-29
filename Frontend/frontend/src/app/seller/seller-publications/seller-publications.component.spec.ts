// seller/seller-publications/seller-publications.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellerPublicationsComponent } from './seller-publications.component';

describe('SellerPublicationsComponent', () => {
  let component: SellerPublicationsComponent;
  let fixture: ComponentFixture<SellerPublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerPublicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load mock publications on init', () => {
    expect(component.publications.length).toBeGreaterThan(0);
  });

  it('should filter publications by category', () => {
    component.filterCategory = 'ficcion';
    component.applyFilters();
    const fictionBooks = component.filteredPublications.filter(pub => pub.categoria === 'ficcion');
    expect(component.filteredPublications.length).toBe(fictionBooks.length);
  });

  it('should filter publications by status', () => {
    component.filterStatus = 'disponible';
    component.applyFilters();
    const availableBooks = component.filteredPublications.filter(pub => pub.estado === 'disponible');
    expect(component.filteredPublications.length).toBe(availableBooks.length);
  });

  it('should search publications by title', () => {
    component.searchTerm = 'Soledad';
    component.applyFilters();
    expect(component.filteredPublications.length).toBeGreaterThan(0);
    component.filteredPublications.forEach(pub => {
      expect(pub.titulo.toLowerCase()).toContain('soledad');
    });
  });

  it('should search publications by author', () => {
    component.searchTerm = 'García';
    component.applyFilters();
    expect(component.filteredPublications.length).toBeGreaterThan(0);
    component.filteredPublications.forEach(pub => {
      expect(pub.autor.toLowerCase()).toContain('garcía');
    });
  });

  it('should search publications by editorial', () => {
    component.searchTerm = 'Sudamericana';
    component.applyFilters();
    expect(component.filteredPublications.length).toBeGreaterThan(0);
    component.filteredPublications.forEach(pub => {
      expect(pub.editorial.toLowerCase()).toContain('sudamericana');
    });
  });

  it('should update stats correctly', () => {
    component.updateStats();
    expect(component.totalPublications).toBe(component.publications.length);
    expect(component.availablePublications).toBeGreaterThanOrEqual(0);
  });

  it('should open new publication modal', () => {
    component.openNewPublicationModal();
    expect(component.showNewPublicationModal).toBeTruthy();
    expect(component.isEditMode).toBeFalsy();
  });

  it('should open edit publication modal', () => {
    const publication = component.publications[0];
    component.openEditPublicationModal(publication);
    expect(component.showNewPublicationModal).toBeTruthy();
    expect(component.isEditMode).toBeTruthy();
    expect(component.currentPublication).toEqual(publication);
  });

  it('should close modal and reset form', () => {
    component.showNewPublicationModal = true;
    component.isEditMode = true;
    component.currentPublication = component.publications[0];
    
    component.closeModal();
    
    expect(component.showNewPublicationModal).toBeFalsy();
    expect(component.isEditMode).toBeFalsy();
    expect(component.currentPublication).toEqual(component.emptyPublication);
  });

  it('should save new publication', () => {
    const initialLength = component.publications.length;
    component.currentPublication = {
      id: 0,
      titulo: 'Nuevo Libro',
      autor: 'Autor Test',
      editorial: 'Editorial Test',
      isbn: '1234567890123',
      portada: 'test.jpg',
      categoria: 'ficcion',
      estado: 'disponible',
      transaccion: 'venta',
      precio: 150,
      descripcion: 'Descripción test',
      numPaginas: 200,
      fechaPublicacion: '2024-06-10'
    };
    
    component.savePublication();
    
    expect(component.publications.length).toBe(initialLength + 1);
  });

  it('should update existing publication', () => {
    const publication = component.publications[0];
    const originalTitle = publication.titulo;
    
    component.isEditMode = true;
    component.currentPublication = { ...publication, titulo: 'Título Editado' };
    
    component.savePublication();
    
    expect(component.publications[0].titulo).toBe('Título Editado');
    expect(component.publications[0].titulo).not.toBe(originalTitle);
  });

  it('should delete publication', () => {
    const initialLength = component.publications.length;
    const publication = component.publications[0];
    
    spyOn(window, 'confirm').and.returnValue(true);
    
    component.deletePublication(publication);
    
    expect(component.publications.length).toBe(initialLength - 1);
  });

  it('should not delete publication when cancelled', () => {
    const initialLength = component.publications.length;
    const publication = component.publications[0];
    
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deletePublication(publication);
    
    expect(component.publications.length).toBe(initialLength);
  });

  it('should sort publications correctly', () => {
    component.sortBy = 'titulo_asc';
    const sortedPublications = component.sortPublications([...component.publications]);
    
    for (let i = 0; i < sortedPublications.length - 1; i++) {
      expect(sortedPublications[i].titulo.localeCompare(sortedPublications[i + 1].titulo)).toBeLessThanOrEqual(0);
    }
  });

  it('should get correct status text', () => {
    expect(component.getStatusText('disponible')).toBe('Disponible');
    expect(component.getStatusText('vendido')).toBe('Vendido');
    expect(component.getStatusText('reservado')).toBe('Reservado');
  });

  it('should get correct transaction text', () => {
    expect(component.getTransactionText('venta')).toBe('Venta');
    expect(component.getTransactionText('intercambio')).toBe('Intercambio');
    expect(component.getTransactionText('donacion')).toBe('Donación');
  });

  it('should format price correctly', () => {
    const testPrice = 199.99;
    const formattedPrice = component.formatPrice(testPrice);
    expect(formattedPrice).toContain('199.99');
  });

  it('should validate form correctly', () => {
    component.currentPublication = component.emptyPublication;
    expect(component.isFormValid()).toBeFalsy();
    
    component.currentPublication = {
      id: 0,
      titulo: 'Test Title',
      autor: 'Test Author',
      editorial: 'Test Editorial',
      isbn: '1234567890123',
      portada: 'test.jpg',
      categoria: 'ficcion',
      estado: 'disponible',
      transaccion: 'venta',
      precio: 100,
      descripcion: 'Test description',
      numPaginas: 200,
      fechaPublicacion: '2024-06-10'
    };
    expect(component.isFormValid()).toBeTruthy();
  });

  it('should track publications by id', () => {
    const publication = component.publications[0];
    const trackResult = component.trackByPublicationId(0, publication);
    expect(trackResult).toBe(publication.id);
  });
});