import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(data: {
    data: { correo: String; contrasena: String };
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(datos: { nombre: String }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/registro`, datos);
  }

  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  cerrarSesion(data: { token: String }) {
    localStorage.removeItem('token');
    return this.http.post(`${this.baseUrl}/auth/cerrarSesion`, data);
  }
}
