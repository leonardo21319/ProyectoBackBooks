import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
    if (token) {
      // Si el token existe, permite el acceso a la ruta
      return true;
    } else {
      // Si no hay token, redirige al usuario a la página de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
  }
}
