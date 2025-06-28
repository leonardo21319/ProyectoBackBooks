// seller/seller-offers/seller-offers.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesHeaderComponent } from '../sales-header/sales-header.component';

interface BuyerOffer {
  id: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  bookTitle: string;
  bookId: number;
  bookImage: string;
  offerType: 'intercambio' | 'compra' | 'donacion';
  offerDetails: string;
  offeredPrice?: number;
  offeredBooks?: string[];
  message: string;
  dateCreated: string;
  status: 'pendiente' | 'aceptada' | 'rechazada';
  urgency: 'baja' | 'media' | 'alta';
}

@Component({
  selector: 'app-seller-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, SalesHeaderComponent],
  templateUrl: './seller-offers.component.html',
  styleUrls: ['./seller-offers.component.css'],
})
export class SellerOffersComponent implements OnInit {
  offers: BuyerOffer[] = [];
  filteredOffers: BuyerOffer[] = [];
  selectedOffer: BuyerOffer | null = null;
  showOfferDetailsModal = false;
  showBuyerInfoModal = false;
  selectedBuyer: BuyerOffer | null = null;
  
  // Filtros
  filterStatus = 'todas'; // todas, pendientes, aceptadas, rechazadas
  filterType = 'todos'; // todos, intercambio, compra, donacion
  sortBy = 'fecha_desc'; // fecha_desc, fecha_asc, urgencia
  searchTerm = '';

  // Estadísticas
  totalOffers = 0;
  pendingOffers = 0;
  acceptedOffers = 0;
  rejectedOffers = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockOffers();
    this.updateStats();
    this.applyFilters();
  }

  loadMockOffers() {
    this.offers = [
      {
        id: 1,
        buyerName: 'Juanito Harry Fuentes Aguilar',
        buyerEmail: 'mikerrben@gmail.com',
        buyerPhone: '5557804054',
        bookTitle: 'Cien Años de Soledad',
        bookId: 1,
        bookImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
        offerType: 'intercambio',
        offerDetails: 'Un chicle',
        offeredBooks: ['El Principito', 'Don Quijote'],
        message: 'Hola, me interesa mucho tu libro. Tengo estos libros para intercambiar, ¿te parece bien?',
        dateCreated: '2024-06-10',
        status: 'pendiente',
        urgency: 'media'
      },
      {
        id: 2,
        buyerName: 'María González López',
        buyerEmail: 'maria.gonzalez@email.com',
        buyerPhone: '5551234567',
        bookTitle: 'El Arte de la Guerra',
        bookId: 2,
        bookImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
        offerType: 'compra',
        offerDetails: '$180 MXN',
        offeredPrice: 180,
        message: 'Me gustaría comprar este libro. ¿Aceptas $180? Puedo recogerlo hoy mismo.',
        dateCreated: '2024-06-09',
        status: 'aceptada',
        urgency: 'alta'
      },
      {
        id: 3,
        buyerName: 'Carlos Rodríguez Pérez',
        buyerEmail: 'carlos.rodriguez@email.com',
        buyerPhone: '5559876543',
        bookTitle: 'Sapiens',
        bookId: 3,
        bookImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
        offerType: 'donacion',
        offerDetails: 'Solicitud de donación',
        message: 'Soy estudiante universitario y me sería muy útil este libro para mis estudios. ¿Podrías donármelo?',
        dateCreated: '2024-06-08',
        status: 'pendiente',
        urgency: 'baja'
      },
      {
        id: 4,
        buyerName: 'Ana Martínez Silva',
        buyerEmail: 'ana.martinez@email.com',
        buyerPhone: '5556789012',
        bookTitle: '1984',
        bookId: 4,
        bookImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop',
        offerType: 'compra',
        offerDetails: '$200 MXN',
        offeredPrice: 200,
        message: 'Ofrezco $200 por este libro. Es para un regalo, así que necesito que esté en excelente estado.',
        dateCreated: '2024-06-07',
        status: 'rechazada',
        urgency: 'media'
      }
    ];
  }

  updateStats() {
    this.totalOffers = this.offers.length;
    this.pendingOffers = this.offers.filter(offer => offer.status === 'pendiente').length;
    this.acceptedOffers = this.offers.filter(offer => offer.status === 'aceptada').length;
    this.rejectedOffers = this.offers.filter(offer => offer.status === 'rechazada').length;
  }

  // Métodos del header
  onCategorySelected(category: string) {
    console.log('Categoría seleccionada desde ofertas:', category);
    this.router.navigate(['/saleshome'], { queryParams: { category } });
  }

  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde ofertas:', searchTerm);
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  // Filtros y búsqueda
  applyFilters() {
    let filtered = [...this.offers];

    // Filtrar por estado
    if (this.filterStatus !== 'todas') {
      filtered = filtered.filter(offer => offer.status === this.filterStatus);
    }

    // Filtrar por tipo
    if (this.filterType !== 'todos') {
      filtered = filtered.filter(offer => offer.offerType === this.filterType);
    }

    // Filtrar por búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter(offer => 
        offer.buyerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offer.bookTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offer.message.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Ordenar
    filtered = this.sortOffers(filtered);

    this.filteredOffers = filtered;
  }

  sortOffers(offers: BuyerOffer[]): BuyerOffer[] {
    return offers.sort((a, b) => {
      switch (this.sortBy) {
        case 'fecha_desc':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        case 'fecha_asc':
          return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
        case 'urgencia':
          const urgencyOrder = { 'alta': 3, 'media': 2, 'baja': 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        default:
          return 0;
      }
    });
  }

  changeFilter(filterType: string, value: string) {
    switch (filterType) {
      case 'status':
        this.filterStatus = value;
        break;
      case 'type':
        this.filterType = value;
        break;
      case 'sort':
        this.sortBy = value;
        break;
    }
    this.applyFilters();
  }

  // Acciones de ofertas
  acceptOffer(offer: BuyerOffer) {
    if (confirm(`¿Estás seguro de que quieres aceptar la oferta de ${offer.buyerName}?`)) {
      offer.status = 'aceptada';
      this.updateStats();
      console.log('Oferta aceptada:', offer);
      alert(`✅ Oferta de ${offer.buyerName} aceptada. Se le notificará por email.`);
      
      // Aquí iría la llamada al API
      // this.apiService.acceptOffer(offer.id).subscribe(...)
    }
  }

  rejectOffer(offer: BuyerOffer) {
    if (confirm(`¿Estás seguro de que quieres rechazar la oferta de ${offer.buyerName}?`)) {
      offer.status = 'rechazada';
      this.updateStats();
      console.log('Oferta rechazada:', offer);
      alert(`❌ Oferta de ${offer.buyerName} rechazada. Se le notificará por email.`);
      
      // Aquí iría la llamada al API
      // this.apiService.rejectOffer(offer.id).subscribe(...)
    }
  }

  // Modales
  viewOfferDetails(offer: BuyerOffer) {
    this.selectedOffer = offer;
    this.showOfferDetailsModal = true;
  }

  viewBuyerInfo(offer: BuyerOffer) {
    this.selectedBuyer = offer;
    this.showBuyerInfoModal = true;
  }

  closeOfferDetailsModal() {
    this.showOfferDetailsModal = false;
    this.selectedOffer = null;
  }

  closeBuyerInfoModal() {
    this.showBuyerInfoModal = false;
    this.selectedBuyer = null;
  }

  closeAllModals() {
    this.showOfferDetailsModal = false;
    this.showBuyerInfoModal = false;
    this.selectedOffer = null;
    this.selectedBuyer = null;
  }

  // Métodos de utilidad
  getOfferTypeText(type: string): string {
    const types = {
      'intercambio': 'Intercambio',
      'compra': 'Compra',
      'donacion': 'Donación'
    };
    return types[type as keyof typeof types] || type;
  }

  getOfferTypeClass(type: string): string {
    const typeClasses = {
      'intercambio': 'offer-type-exchange',
      'compra': 'offer-type-buy',
      'donacion': 'offer-type-donation'
    };
    return typeClasses[type as keyof typeof typeClasses] || '';
  }

  getStatusText(status: string): string {
    const statuses = {
      'pendiente': 'Pendiente',
      'aceptada': 'Aceptada',
      'rechazada': 'Rechazada'
    };
    return statuses[status as keyof typeof statuses] || status;
  }

  getStatusClass(status: string): string {
    const statusClasses = {
      'pendiente': 'status-pending',
      'aceptada': 'status-accepted',
      'rechazada': 'status-rejected'
    };
    return statusClasses[status as keyof typeof statusClasses] || '';
  }

  getUrgencyClass(urgency: string): string {
    const urgencyClasses = {
      'alta': 'urgency-high',
      'media': 'urgency-medium',
      'baja': 'urgency-low'
    };
    return urgencyClasses[urgency as keyof typeof urgencyClasses] || '';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  trackByOfferId(index: number, offer: BuyerOffer): number {
    return offer.id;
  }

  // Navegación
  goToDashboard() {
    this.router.navigate(['/saleshome']);
  }

  goToBookDetail(bookId: number) {
    this.router.navigate(['/book', bookId]);
  }

  reportBuyer(offer: BuyerOffer) {
    console.log('Reportar usuario:', offer.buyerName);
    // Navegar al módulo de reportes con datos pre-llenados
    this.router.navigate(['/seller-profile'], { 
      queryParams: { 
        section: 'reports',
        reportUser: offer.buyerName,
        reportReason: 'Oferta inapropiada'
      }
    });
  }
}