// seller/seller-profile/seller-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesHeaderComponent } from '../sales-header/sales-header.component';

// Interfaz para reportes
interface UserReport {
  id: number;
  usuarioReportado: string;
  motivo: string;
  descripcion: string;
  fecha: string;
  estado: 'pendiente' | 'en_revision' | 'resuelto' | 'rechazado';
  gravedad: 'baja' | 'media' | 'alta';
  respuestaAdmin?: string;
  evidencias?: string[];
}

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
  profileImage?: string;
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
  reportForm: FormGroup;
  sellerProfile: SellerProfile;
  activeSection = 'Mi cuenta';
  isEditing = false;
  showRoleChangeModal = false;
  
  // Variables para reportes
  showReportModal = false;
  showReportDetailsModal = false;
  editingReport: UserReport | null = null;
  selectedReport: UserReport | null = null;
  userReports: UserReport[] = [];
  selectedFiles: File[] = [];
  totalReports = 0;
  pendingReports = 0;

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

    // Inicializar formulario de perfil
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

    // Inicializar formulario de reportes
    this.reportForm = this.formBuilder.group({
      usuarioReportado: ['', [Validators.required, Validators.minLength(2)]],
      motivo: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      gravedad: ['media', [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log('Perfil del vendedor cargado:', this.sellerProfile);
    this.loadMockReports();
  }

  // ===== MÉTODOS PARA REPORTES =====
  
  loadMockReports() {
    this.userReports = [
      {
        id: 1,
        usuarioReportado: 'Benjamín Jaramillo Cruz',
        motivo: 'Oferta de mal gusto',
        descripcion: 'El usuario hizo una oferta muy por debajo del precio sin justificación y con comentarios despectivos sobre el libro.',
        fecha: '2024-06-08',
        estado: 'en_revision',
        gravedad: 'media',
        respuestaAdmin: 'Estamos revisando el caso. Se contactará al usuario para aclarar la situación.',
        evidencias: ['captura_conversacion.png']
      },
      {
        id: 2,
        usuarioReportado: 'Margarita Flores Hernández',
        motivo: 'No cumplió con el intercambio',
        descripcion: 'El usuario acordó un intercambio pero nunca envió el libro prometido y dejó de responder mensajes.',
        fecha: '2024-06-07',
        estado: 'resuelto',
        gravedad: 'alta',
        respuestaAdmin: 'Se ha suspendido temporalmente la cuenta del usuario y se ha procesado un reembolso.',
        evidencias: ['evidencia1.png', 'chat_screenshots.png']
      }
    ];
    
    this.updateReportStats();
  }

  updateReportStats() {
    this.totalReports = this.userReports.length;
    this.pendingReports = this.userReports.filter(report => 
      report.estado === 'pendiente' || report.estado === 'en_revision'
    ).length;
  }

  // Modales de reportes
  openNewReportModal() {
    this.editingReport = null;
    this.selectedFiles = [];
    this.reportForm.reset({
      usuarioReportado: '',
      motivo: '',
      descripcion: '',
      gravedad: 'media'
    });
    this.showReportModal = true;
  }

  closeReportModal() {
    this.showReportModal = false;
    this.editingReport = null;
    this.selectedFiles = [];
  }

  closeReportDetailsModal() {
    this.showReportDetailsModal = false;
    this.selectedReport = null;
  }

  closeAllModals() {
    this.showReportModal = false;
    this.showReportDetailsModal = false;
    this.showRoleChangeModal = false;
  }

  // Enviar y editar reportes
  submitReport() {
    if (this.reportForm.valid) {
      const reportData = this.reportForm.value;
      
      if (this.editingReport) {
        // Editar reporte existente
        const index = this.userReports.findIndex(r => r.id === this.editingReport!.id);
        if (index > -1) {
          this.userReports[index] = {
            ...this.editingReport,
            ...reportData,
            evidencias: this.selectedFiles.map(f => f.name)
          };
          console.log('✅ Reporte actualizado:', this.userReports[index]);
          alert('✅ Reporte actualizado exitosamente');
        }
      } else {
        // Crear nuevo reporte
        const newReport: UserReport = {
          id: Date.now(),
          ...reportData,
          fecha: new Date().toISOString().split('T')[0],
          estado: 'pendiente' as const,
          evidencias: this.selectedFiles.map(f => f.name)
        };
        
        this.userReports.unshift(newReport);
        console.log('✅ Nuevo reporte creado:', newReport);
        alert('✅ Reporte enviado exitosamente. Será revisado por nuestro equipo.');
      }
      
      this.updateReportStats();
      this.closeReportModal();
      
      // Aquí iría la llamada al API
      // this.apiService.submitReport(reportData).subscribe(...)
    } else {
      this.markReportFormTouched();
      alert('❌ Por favor completa todos los campos requeridos');
    }
  }

  viewReportDetails(report: UserReport) {
    this.selectedReport = report;
    this.showReportDetailsModal = true;
  }

  editReport(report: UserReport) {
    this.editingReport = report;
    this.reportForm.patchValue({
      usuarioReportado: report.usuarioReportado,
      motivo: report.motivo,
      descripcion: report.descripcion,
      gravedad: report.gravedad
    });
    this.showReportModal = true;
  }

  editReportFromDetails() {
    if (this.selectedReport) {
      this.editReport(this.selectedReport);
      this.closeReportDetailsModal();
    }
  }

  // Manejo de archivos
  openFileSelector() {
    const evidenceInput = document.querySelector('#evidenceInput') as HTMLInputElement;
    if (evidenceInput) {
      evidenceInput.click();
    }
  }

  onEvidenceSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    
    files.forEach(file => {
      // Validar tipo y tamaño
      if (!file.type.startsWith('image/')) {
        alert(`❌ ${file.name} no es una imagen válida`);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert(`❌ ${file.name} es demasiado grande (máximo 10MB)`);
        return;
      }
      
      // Evitar duplicados
      if (!this.selectedFiles.find(f => f.name === file.name)) {
        this.selectedFiles.push(file);
      }
    });
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  // Utilidades para reportes
  trackByReportId(index: number, report: UserReport): number {
    return report.id;
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getReasonClass(reason: string): string {
    const reasonClasses: { [key: string]: string } = {
      'Oferta de mal gusto': 'reason-offensive',
      'Comentarios inapropiados': 'reason-inappropriate',
      'Intento de estafa': 'reason-scam',
      'No cumplió con el intercambio': 'reason-breach',
      'Spam o mensajes repetitivos': 'reason-spam',
      'Comportamiento abusivo': 'reason-abuse',
      'Otro': 'reason-other'
    };
    return reasonClasses[reason] || 'reason-other';
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pendiente': 'status-pending',
      'en_revision': 'status-reviewing',
      'resuelto': 'status-resolved',
      'rechazado': 'status-rejected'
    };
    return statusClasses[status] || 'status-pending';
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'en_revision': 'En revisión',
      'resuelto': 'Resuelto',
      'rechazado': 'Rechazado'
    };
    return statusTexts[status] || status;
  }

  // Validación del formulario de reportes
  isReportFieldInvalid(fieldName: string): boolean {
    const field = this.reportForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  getReportFieldError(fieldName: string): string {
    const field = this.reportForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  markReportFormTouched() {
    Object.keys(this.reportForm.controls).forEach(key => {
      const control = this.reportForm.get(key);
      control?.markAsTouched();
    });
  }

  // ===== MÉTODOS DEL HEADER =====
  
  onCategorySelected(category: string) {
    console.log('Categoría seleccionada desde perfil:', category);
    this.router.navigate(['/saleshome'], { queryParams: { category } });
  }

  onSearchPerformed(searchTerm: string) {
    console.log('Búsqueda desde perfil:', searchTerm);
    this.router.navigate(['/saleshome'], { queryParams: { search: searchTerm } });
  }

  // ===== NAVEGACIÓN DEL SIDEBAR =====
  
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
        this.activeSection = 'Reportes';
        break;
      case 'Cerrar sesión':
        this.logout();
        break;
    }
  }

  // ===== MÉTODOS PARA EDITAR PERFIL =====
  
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

  // ===== MÉTODOS PARA FOTO DE PERFIL =====
  
  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  openImageUpload() {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('❌ Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('❌ La imagen es demasiado grande. Máximo 5MB');
        return;
      }

      // Leer archivo y convertir a base64
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.sellerProfile.profileImage = e.target.result as string;
          console.log('✅ Imagen de perfil actualizada');
          
          // Aquí iría la llamada al API para subir la imagen
          // this.apiService.uploadProfileImage(file).subscribe(...)
          
          alert('✅ Foto de perfil actualizada exitosamente');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // ===== MÉTODOS PARA CAMBIO DE ROL =====
  
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
    this.router.navigate(['/home']);
    
    // Aquí iría la lógica real para cambiar el rol en el backend
    // this.apiService.changeUserRole('Comprador').subscribe(...)
  }

  // ===== NAVEGACIÓN =====
  
  goToDashboard() {
    this.router.navigate(['/saleshome']);
  }

  goToReports() {
    this.activeSection = 'Reportes';
    // Activar la opción en el sidebar
    this.menuOptions.forEach(item => item.active = false);
    const reportsOption = this.menuOptions.find(item => item.label === 'Reportes');
    if (reportsOption) {
      reportsOption.active = true;
    }
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

  // ===== MÉTODOS DE UTILIDAD =====
  
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