// seller/seller-profile/seller-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesHeaderComponent } from '../sales-header/sales-header.component';

interface SellerProfile {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  telefono: string;
  rol: 'Vendedor' | 'Comprador';
  fechaRegistro: string;
  ventasRealizadas: number;
  calificacionPromedio: number;
  descripcionTienda: string;
  metodoPagoPreferido: string;
  direccionEnvio: string;
  politicasDevolucion: string;
}

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SalesHeaderComponent],
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.css'],
})
export class SellerProfileComponent implements OnInit {
  profileForm: FormGroup;
  sellerProfile: SellerProfile;
  activeSection = 'Mi cuenta';
  isEditing = false;
  showRoleChangeModal = false;

  // Opciones del sidebar
  menuOptions = [
    { label: 'Mi cuenta', icon: '👤', active: true },
    { label: 'Mi perfil', icon: '📝', active: false },
    { label: 'Reportes', icon: '📊', active: false },
    { label: 'Cerrar sesión', icon: '🚪', active: false }
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // Inicializar datos del vendedor (mock)
    this.sellerProfile = {
      id: 1,
      nombre: 'Michael',
      apellidoPaterno: 'Kerr',
      apellidoMaterno: 'Thatcher',
      email: 'mikerrben@gmail.com',
      telefono: '+52 555 123 4567',
      rol: 'Vendedor',
      fechaRegistro: '2024-01-15',
      ventasRealizadas: 47,
      calificacionPromedio: 4.8,
      descripcionTienda: 'Especialista en libros de literatura clásica y contemporánea. Más de 5 años de experiencia vendiendo libros de calidad.',
      metodoPagoPreferido: 'Transferencia bancaria',
      direccionEnvio: 'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX',
      politicasDevolucion: 'Acepto devoluciones hasta 7 días después de la entrega, siempre que el libro esté en perfectas condiciones.'
    };

    // Inicializar formulario reactivo
    this.profileForm = this.formBuilder.group({
      nombre: [this.sellerProfile.nombre, [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: [this.sellerProfile.apellidoPaterno, [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: [this.sellerProfile.apellidoMaterno, [Validators.required, Validators.minLength(2)]],
      email: [this.sellerProfile.email, [Validators.required, Validators.email]],
      telefono: [this.sellerProfile.telefono, [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]+$/)]],
      descripcionTienda: [this.sellerProfile.descripcionTienda, [Validators.maxLength(500)]],
      metodoPagoPreferido: [this.sellerProfile.metodoPagoPreferido, [Validators.required]],
      direccionEnvio: [this.sellerProfile.direccionEnvio, [Validators.required]],
      politicasDevolucion: [this.sellerProfile.politicasDevolucion, [Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    console.log('Perfil del vendedor cargado:', this.sellerProfile);
  }

  // Métodos del header
  onCategorySelected(category: string) {
    console.log('Categoría seleccionada desde perfil:', category);
    // Redirigir al dashboard con la categoría
    this.router.navigate(['/seller/dashboard'], { queryParams: { category } });
  }

  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde perfil:', searchTerm);
    // Redirigir al dashboard con el término de búsqueda
    this.router.navigate(['/seller/dashboard'], { queryParams: { search: searchTerm } });
  }

  // Navegación del sidebar
  selectMenuItem(option: string) {
    // Desactivar todas las opciones
    this.menuOptions.forEach(item => item.active = false);
    
    // Activar la opción seleccionada
    const selectedOption = this.menuOptions.find(item => item.label === option);
    if (selectedOption) {
      selectedOption.active = true;
      this.activeSection = option;
    }

    // Manejar las acciones específicas
    switch (option) {
      case 'Mi cuenta':
        this.activeSection = 'Mi cuenta';
        break;
      case 'Mi perfil':
        this.activeSection = 'Mi perfil';
        break;
      case 'Reportes':
        this.goToReports();
        break;
      case 'Cerrar sesión':
        this.logout();
        break;
    }
  }

  // Métodos para editar perfil
  enableEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    // Restaurar valores originales
    this.profileForm.patchValue({
      nombre: this.sellerProfile.nombre,
      apellidoPaterno: this.sellerProfile.apellidoPaterno,
      apellidoMaterno: this.sellerProfile.apellidoMaterno,
      email: this.sellerProfile.email,
      telefono: this.sellerProfile.telefono,
      descripcionTienda: this.sellerProfile.descripcionTienda,
      metodoPagoPreferido: this.sellerProfile.metodoPagoPreferido,
      direccionEnvio: this.sellerProfile.direccionEnvio,
      politicasDevolucion: this.sellerProfile.politicasDevolucion
    });
  }

  saveChanges() {
    if (this.profileForm.valid) {
      // Actualizar el perfil con los nuevos valores
      const formValues = this.profileForm.value;
      this.sellerProfile = { ...this.sellerProfile, ...formValues };
      
      this.isEditing = false;
      
      console.log('Perfil actualizado:', this.sellerProfile);
      alert('✅ Perfil actualizado exitosamente');
      
      // Aquí iría la llamada al API para guardar los cambios
      // this.apiService.updateSellerProfile(this.sellerProfile).subscribe(...)
    } else {
      alert('❌ Por favor, corrige los errores en el formulario');
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  // Método para cambiar rol
  openRoleChangeModal() {
    this.showRoleChangeModal = true;
  }

  closeRoleChangeModal() {
    this.showRoleChangeModal = false;
  }

  changeRole() {
    console.log('Cambiando rol de Vendedor a Comprador');
    this.closeRoleChangeModal();
    
    // Simular cambio de rol
    alert('🔄 Cambiando a modo Comprador...');
    
    // Redirigir al home del comprador
    this.router.navigate(['/buyer/home']);
    
    // Aquí iría la lógica real para cambiar el rol en el backend
    // this.apiService.changeUserRole('Comprador').subscribe(...)
  }

  // Navegación
  goToDashboard() {
    this.router.navigate(['/seller/dashboard']);
  }

  goToReports() {
    console.log('Ir a reportes');
    alert('📊 Función de reportes en desarrollo...');
    // this.router.navigate(['/seller/reports']);
  }

  logout() {
    console.log('Cerrando sesión...');
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      // Limpiar datos de sesión
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      sessionStorage.clear();
      
      // Redirigir al login
      this.router.navigate(['/login']);
      
      alert('👋 Sesión cerrada exitosamente');
    }
  }

  // Métodos de utilidad
  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (field.errors['email']) {
        return 'Ingresa un email válido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return 'Formato de teléfono inválido';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}