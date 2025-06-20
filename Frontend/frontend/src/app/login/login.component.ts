import { Component } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
import { ApiService } from '../servicios/api.service'; 

@Component({   
  selector: 'app-login', // 👈 Cambié el selector también
  standalone: true,   
  imports: [FormsModule, CommonModule],   
  templateUrl: './login.component.html',   
  styleUrls: ['./login.component.css'], 
}) 
export class LoginComponent {   
  correo = '';   
  contrasena = '';   
  error = '';   
  appaterno = '';   
  apmaterno = '';   
  nombre = '';   
  isLoginActive = true;    

  constructor(private ApiService: ApiService, private router: Router) {}    

  toggleLogin(value: boolean) {     
    this.isLoginActive = value;   
  }    

  login() {     
    const payload = {       
      data: {         
        correo: this.correo,         
        contrasena: this.contrasena,       
      },     
    };      

    this.ApiService.login(payload).subscribe({       
      next: (res) => {         
        this.ApiService.guardarToken(res.data);         
        // this.router.navigate(['/dashboard']);       
      },       
      error: (err) => {         
        this.error = 'Credenciales inválidas';         
        console.error(err);       
      },     
    });   
  }    

  signup() {     
    const payload = {       
      data: {         
        correo: this.correo,         
        contrasena: this.contrasena,       
      },     
    };   
  }

// En tu AuthComponent existente, solo agregar este método al final:

goToHome() {
  this.router.navigate(['/home']);
}
}