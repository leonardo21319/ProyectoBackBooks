import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode'; // Importación correcta para v4+
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
interface DecodedToken {
  rol: number;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(data: {
    data: { correo: string; contrasena: string };
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(datos: { nombre: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/registro`, datos);
  }

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }
  cerrarSesion(token: string): Observable<any> {
    const headers = { Authorization: `Bearer ${token}` }; // Asegúrate de enviar el token como Authorization Bearer
    return this.http.post(`${this.baseUrl}/auth/cerrarSesion`, {}, { headers });
  }

  private limpiarTokenLocal(): void {
    localStorage.removeItem('token');
    // Limpiar también otros datos de sesión si existen
    localStorage.removeItem('userData');
    sessionStorage.clear();
  }

  decodificarToken(): DecodedToken | null {
    const token = this.obtenerToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  }

  obtenerLibros(): Observable<any> {
    return this.http.get(`${this.baseUrl}/intercambio/obtenerLibros`).pipe(
      catchError((error) => {
        console.error('Error al obtener libros:', error);
        return throwError(() => new Error('Error al obtener libros'));
      })
    );
  }

  // Libros - Get a book by its ID
  obtenerLibroPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/intercambio/obtenerlibros/${id}`);
  }

  registrarLibros(libros: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/intercambio/cargarlibros`, libros);
  }

  // Libros - Update a book
  actualizarLibro(id: number, libro: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/intercambio/actualizarlibro/${id}`,
      libro
    );
  }
}
