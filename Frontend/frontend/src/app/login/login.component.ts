import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule], // 👈 necesario para ngModel y *ngIf
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class AuthComponent {
  isLoginActive: boolean = true;

  // Login
  loginEmail: string = '';
  loginPassword: string = '';

  // Registro
  signupName: string = '';
  signupLastname: string = '';
  signupEmail: string = '';
  signupPassword: string = '';

  toggleLogin(state: boolean) {
    this.isLoginActive = state;
  }

  login() {
    console.log('Login:', this.loginEmail, this.loginPassword);
    // Aquí va tu lógica para login (servicio HTTP, etc.)
  }

  signup() {
    console.log(
      'Signup:',
      this.signupName,
      this.signupLastname,
      this.signupEmail,
      this.signupPassword
    );
    // Aquí va tu lógica para registro
  }
}
