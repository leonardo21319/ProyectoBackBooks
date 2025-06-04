import { Component } from "@angular/core";
import { ApiService } from "../servicios/api.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  template: `
    <h2>Iniciar Sesión</h2>
    <form (ngSubmit)="iniciarSesion()">
      <input [(ngModel)]="email" name="email" placeholder="Correo" required>
      <input [(ngModel)]="password" type="password" name="password" placeholder="Contraseña" required>
      <button type="submit">Entrar</button>
    </form>
  `
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private api: ApiService, private router: Router) {}

  iniciarSesion() {
    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/home']); // Redirige a la vista principal
      },
      error: (err) => {
        alert(err.error.message || 'Error al iniciar sesión');
      }
    });
  }
}