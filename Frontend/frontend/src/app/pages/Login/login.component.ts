import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'; // Asegúrate de que FormsModule esté importado en tu módulo

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoginFormActive = true;
  loginEmail: string = '';
  loginPassword: string = '';
  signupName: string = '';
  signupLastname: string = '';
  signupEmail: string = '';
  signupPassword: string = '';
  errorMsg: string[] = [];

  toggleForm(isLogin: boolean): void {
    this.isLoginFormActive = isLogin;
  }

  submitLogin(): void {
    // Implementar lógica para el inicio de sesión
    // Asegúrate de manejar la validación y errores
    console.log('Login Form Submitted', this.loginEmail, this.loginPassword);
  }

  submitSignup(): void {
    // Implementar lógica para el registro
    // Asegúrate de manejar la validación y errores
    console.log(
      'Signup Form Submitted',
      this.signupName,
      this.signupLastname,
      this.signupEmail,
      this.signupPassword
    );
  }
}
