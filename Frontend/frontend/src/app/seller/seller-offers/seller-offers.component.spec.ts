// seller/seller-offers/seller-offers.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellerOffersComponent } from './seller-offers.component';

describe('SellerOffersComponent', () => {
  let component: SellerOffersComponent;
  let fixture: ComponentFixture<SellerOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load mock offers on init', () => {
    expect(component.offers.length).toBeGreaterThan(0);
  });

  it('should filter offers by status', () => {
    component.filterStatus = 'pendiente';
    component.applyFilters();
    const pendingOffers = component.filteredOffers.filter(offer => offer.status === 'pendiente');
    expect(component.filteredOffers.length).toBe(pendingOffers.length);
  });

  it('should filter offers by type', () => {
    component.filterType = 'compra';
    component.applyFilters();
    const buyOffers = component.filteredOffers.filter(offer => offer.offerType === 'compra');
    expect(component.filteredOffers.length).toBe(buyOffers.length);
  });

  it('should update stats correctly', () => {
    component.updateStats();
    expect(component.totalOffers).toBe(component.offers.length);
    expect(component.pendingOffers).toBeGreaterThanOrEqual(0);
  });

  it('should accept offer and update status', () => {
    const offer = component.offers.find(o => o.status === 'pendiente');
    if (offer) {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(window, 'alert'); // Espiar alert para evitar que se muestre
      component.acceptOffer(offer);
      expect(offer.status).toBe('aceptada');
    }
  });

  it('should reject offer and update status', () => {
    const offer = component.offers.find(o => o.status === 'pendiente');
    if (offer) {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(window, 'alert'); // Espiar alert para evitar que se muestre
      component.rejectOffer(offer);
      expect(offer.status).toBe('rechazada');
    }
  });

  it('should search offers by buyer name', () => {
    component.searchTerm = 'Juanito';
    component.applyFilters();
    expect(component.filteredOffers.length).toBeGreaterThan(0);
    component.filteredOffers.forEach(offer => {
      expect(offer.buyerName.toLowerCase()).toContain('juanito');
    });
  });

  it('should open and close modals correctly', () => {
    const offer = component.offers[0];
    
    component.viewOfferDetails(offer);
    expect(component.showOfferDetailsModal).toBeTruthy();
    expect(component.selectedOffer).toBe(offer);
    
    component.closeOfferDetailsModal();
    expect(component.showOfferDetailsModal).toBeFalsy();
    expect(component.selectedOffer).toBeNull();
  });

  it('should format dates correctly', () => {
    const testDate = '2024-06-10';
    const formattedDate = component.formatDate(testDate);
    expect(formattedDate).toContain('2024');
  });

  it('should format prices correctly', () => {
    const testPrice = 199.99;
    const formattedPrice = component.formatPrice(testPrice);
    expect(formattedPrice).toContain('199.99');
  });

  it('should get correct initials from name', () => {
    const fullName = 'Juan Carlos Rodriguez';
    const initials = component.getInitials(fullName);
    expect(initials).toBe('JC');
  });

  it('should sort offers correctly', () => {
    component.sortBy = 'fecha_desc';
    const sortedOffers = component.sortOffers([...component.offers]);
    
    for (let i = 0; i < sortedOffers.length - 1; i++) {
      const currentDate = new Date(sortedOffers[i].dateCreated);
      const nextDate = new Date(sortedOffers[i + 1].dateCreated);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }
  });

  it('should get correct offer type text', () => {
    expect(component.getOfferTypeText('compra')).toBe('Compra');
    expect(component.getOfferTypeText('intercambio')).toBe('Intercambio');
    expect(component.getOfferTypeText('donacion')).toBe('Donación');
  });

  it('should get correct status text', () => {
    expect(component.getStatusText('pendiente')).toBe('Pendiente');
    expect(component.getStatusText('aceptada')).toBe('Aceptada');
    expect(component.getStatusText('rechazada')).toBe('Rechazada');
  });

  it('should handle buyer info modal correctly', () => {
    const offer = component.offers[0];
    
    component.viewBuyerInfo(offer);
    expect(component.showBuyerInfoModal).toBeTruthy();
    expect(component.selectedBuyer).toBe(offer);
    
    component.closeBuyerInfoModal();
    expect(component.showBuyerInfoModal).toBeFalsy();
    expect(component.selectedBuyer).toBeNull();
  });

  it('should close all modals', () => {
    // Abrir ambos modales
    component.showOfferDetailsModal = true;
    component.showBuyerInfoModal = true;
    component.selectedOffer = component.offers[0];
    component.selectedBuyer = component.offers[0];
    
    // Cerrar todos
    component.closeAllModals();
    
    expect(component.showOfferDetailsModal).toBeFalsy();
    expect(component.showBuyerInfoModal).toBeFalsy();
    expect(component.selectedOffer).toBeNull();
    expect(component.selectedBuyer).toBeNull();
  });

  it('should track offers by id', () => {
    const offer = component.offers[0];
    const trackResult = component.trackByOfferId(0, offer);
    expect(trackResult).toBe(offer.id);
  });
});