// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ApiService } from '../servicios/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log('AuthGuard: Verificando acceso a:', route.url);
    
    const token = this.apiService.obtenerToken();
    
    if (!token) {
      console.log('AuthGuard: No hay token, redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si el token es válido
    const decodedToken = this.apiService.decodificarToken();
    if (!decodedToken) {
      console.log('AuthGuard: Token inválido, redirigiendo a login');
      this.apiService.limpiarTokenLocal();
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar acceso según rol y ruta
    const userRole = decodedToken.rol;
    const currentPath = route.url[0]?.path;

    console.log('AuthGuard: Usuario rol:', userRole, 'intentando acceder a:', currentPath);

    // Definir rutas permitidas por rol
    const allowedRoutes = this.getAllowedRoutes(userRole);
    
    if (allowedRoutes.includes(currentPath)) {
      console.log('AuthGuard: Acceso permitido');
      return true;
    } else {
      console.log('AuthGuard: Acceso denegado, redirigiendo a página principal del rol');
      this.redirectToUserHome(userRole);
      return false;
    }
  }

  private getAllowedRoutes(role: number): string[] {
    switch (role) {
      case 1: // Admin
        return ['admin']; // Solo admin puede acceder a rutas de admin
      case 2: // Comprador
        return ['home', 'saved', 'cart', 'profile', 'book', 'exchange', 'donation'];
      case 3: // Vendedor
        return ['saleshome', 'profile']; // Vendedor tiene su propia página
      default:
        return [];
    }
  }

  private redirectToUserHome(role: number) {
    switch (role) {
      case 1:
        this.router.navigate(['/admin']);
        break;
      case 2:
        this.router.navigate(['/home']);
        break;
      case 3:
        this.router.navigate(['/saleshome']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}