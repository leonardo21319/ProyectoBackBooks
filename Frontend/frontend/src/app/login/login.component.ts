import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../servicios/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  correo = '';
  contrasena = '';
  error = '';
  appaterno = '';
  apmaterno = '';
  nombre = '';
  isLoginActive = true;
  isLoading = false; // Para mostrar estado de carga

  constructor(
    private ApiService: ApiService, 
    private router: Router,
    private route: ActivatedRoute // Para manejar query params
  ) {}

  ngOnInit() {
    console.log('LoginComponent: Componente iniciado');
    
    // Verificar si ya hay una sesión activa
    if (this.ApiService.isTokenValid()) {
      console.log('LoginComponent: Usuario ya autenticado, redirigiendo');
      const decodedToken = this.ApiService.decodificarToken();
      if (decodedToken) {
        this.redirectByRole(decodedToken.rol);
        return;
      }
    }

    // Verificar si llegó de un cierre de sesión
    this.route.queryParams.subscribe(params => {
      if (params['sessionEnded']) {
        console.log('LoginComponent: Sesión terminada, mostrando mensaje');
        this.error = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        // Limpiar el query param después de mostrar el mensaje
        setTimeout(() => {
          this.router.navigate(['/login'], { replaceUrl: true });
          this.error = '';
        }, 3000);
      }
    });

    // Limpiar cualquier token residual al entrar al login
    if (!this.ApiService.isTokenValid()) {
      this.ApiService.limpiarTokenLocal();
    }
  }

  toggleLogin(value: boolean) {
    console.log('LoginComponent: Cambiando modo:', value ? 'Login' : 'Registro');
    this.isLoginActive = value;
    this.error = ''; // Limpiar errores al cambiar modo
    this.clearForm(); // Limpiar formulario al cambiar modo
  }

  login() {
    console.log('LoginComponent: Iniciando proceso de login');
    
    // Validaciones básicas
    if (!this.correo.trim() || !this.contrasena.trim()) {
      this.error = 'Por favor, completa todos los campos';
      return;
    }

    if (!this.isValidEmail(this.correo)) {
      this.error = 'Por favor, ingresa un correo válido';
      return;
    }

    this.isLoading = true;
    this.error = '';

    const payload = {
      data: {
        correo: this.correo.trim(),
        contrasena: this.contrasena,
      },
    };

    this.ApiService.login(payload).subscribe({
      next: (res) => {
        console.log('LoginComponent: Login exitoso', res);
        
        if (res && res.data) {
          this.ApiService.guardarToken(res.data);
          const decodedToken = this.ApiService.decodificarToken();
          console.log('LoginComponent: Token decodificado:', decodedToken);
          
          if (decodedToken) {
            this.redirectByRole(decodedToken.rol);
          } else {
            this.error = 'Error al procesar la información de usuario';
            this.isLoading = false;
          }
        } else {
          this.error = 'Respuesta del servidor inválida';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('LoginComponent: Error en login:', err);
        this.isLoading = false;
        
        // Manejar diferentes tipos de errores
        if (err.status === 401 || err.status === 400) {
          this.error = 'Credenciales inválidas';
        } else if (err.status === 0) {
          this.error = 'Error de conexión. Verifica tu conexión a internet';
        } else if (err.status >= 500) {
          this.error = 'Error del servidor. Intenta más tarde';
        } else {
          this.error = 'Error al iniciar sesión. Intenta nuevamente';
        }
      },
    });
  }

  signup() {
    console.log('LoginComponent: Iniciando proceso de registro');
    
    // Validaciones básicas para registro
    if (!this.nombre.trim() || !this.correo.trim() || !this.contrasena.trim()) {
      this.error = 'Por favor, completa todos los campos obligatorios';
      return;
    }

    if (!this.isValidEmail(this.correo)) {
      this.error = 'Por favor, ingresa un correo válido';
      return;
    }

    if (this.contrasena.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.isLoading = true;
    this.error = '';

    const payload = {
      data: {
        nombre: this.nombre.trim(),
        appaterno: this.appaterno.trim(),
        apmaterno: this.apmaterno.trim(),
        correo: this.correo.trim(),
        contrasena: this.contrasena,
      },
    };

    this.ApiService.register(payload).subscribe({
      next: (res) => {
        console.log('LoginComponent: Registro exitoso', res);
        this.isLoading = false;
        
        // Cambiar a modo login y mostrar mensaje de éxito
        this.isLoginActive = true;
        this.error = '';
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        
        // Limpiar campos excepto correo para facilitar login
        this.nombre = '';
        this.appaterno = '';
        this.apmaterno = '';
        this.contrasena = '';
      },
      error: (err) => {
        console.error('LoginComponent: Error en registro:', err);
        this.isLoading = false;
        
        if (err.status === 409) {
          this.error = 'Este correo ya está registrado';
        } else if (err.status === 0) {
          this.error = 'Error de conexión. Verifica tu conexión a internet';
        } else if (err.status >= 500) {
          this.error = 'Error del servidor. Intenta más tarde';
        } else {
          this.error = 'Error al registrar usuario. Intenta nuevamente';
        }
      },
    });
  }

  // MANTENER TU LÓGICA DE REDIRECCIÓN EXACTA PERO MEJORADA
  private redirectByRole(userRole: number) {
    console.log('LoginComponent: Redirigiendo según rol:', userRole);
    this.isLoading = false;
    
    switch (userRole) {
      case 1: // Admin
        console.log('LoginComponent: Redirigiendo a admin');
        this.router.navigate(['/admin']);
        break;
      case 2: // Comprador
        console.log('LoginComponent: Redirigiendo a home (comprador)');
        this.router.navigate(['/home']);
        break;
      case 3: // Vendedor
        console.log('LoginComponent: Redirigiendo a saleshome (vendedor)');
        this.router.navigate(['/saleshome']);
        break;
      default:
        this.error = 'Rol de usuario no válido';
        console.error('LoginComponent: Rol no reconocido:', userRole);
        this.isLoading = false;
    }
  }

  // Método para validar email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para limpiar formulario
  private clearForm() {
    this.correo = '';
    this.contrasena = '';
    this.nombre = '';
    this.appaterno = '';
    this.apmaterno = '';
  }

  // MANTENER TU MÉTODO EXACTAMENTE IGUAL
  goToHome() {
    console.log('LoginComponent: Navegación directa a home');
    this.router.navigate(['/home']);
  }

  // Método para limpiar errores al escribir
  onInputChange() {
    if (this.error) {
      this.error = '';
    }
  }
}