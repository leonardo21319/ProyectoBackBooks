import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

interface DecodedToken {
  rol: number;
  id: string;
  exp?: number;
  iat?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // MANTENER TU MÉTODO LOGIN EXACTAMENTE IGUAL
  login(data: {
    data: { correo: string; contrasena: string };
  }): Observable<any> {
    console.log('ApiService: Iniciando login');
    return this.http.post(`${this.baseUrl}/auth/login`, data).pipe(
      timeout(10000),
      catchError((error) => {
        console.error('ApiService: Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  // MANTENER TU MÉTODO REGISTER EXACTAMENTE IGUAL
  register(datos: any): Observable<any> {
    console.log('ApiService: Iniciando registro');
    return this.http.post(`${this.baseUrl}/auth/registro`, datos).pipe(
      timeout(10000),
      catchError((error) => {
        console.error('ApiService: Error en registro:', error);
        return throwError(() => error);
      })
    );
  }

  // MANTENER EXACTAMENTE IGUAL
  guardarToken(token: string): void {
    try {
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('ApiService: Error al guardar token:', error);
    }
  }

  // MANTENER EXACTAMENTE IGUAL
  obtenerToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      return null;
    }
  }

  // MANTENER TU MÉTODO CERRAR SESIÓN EXACTAMENTE IGUAL
  cerrarSesion(token: string): Observable<any> {
    console.log('ApiService: Iniciando cierre de sesión en backend');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http
      .post(`${this.baseUrl}/auth/cerrarSesion`, {}, { headers })
      .pipe(
        timeout(5000),
        catchError((error) => {
          console.error(
            'ApiService: Error al cerrar sesión en backend:',
            error
          );
          return throwError(() => error);
        })
      );
  }

  // NUEVO MÉTODO PARA LIMPIAR TOKENS
  limpiarTokenLocal(): void {
    try {
      console.log('ApiService: Limpiando tokens locales');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      sessionStorage.clear();
      console.log('ApiService: Tokens locales limpiados exitosamente');
    } catch (error) {
      console.error('ApiService: Error al limpiar tokens:', error);
    }
  }

  // MANTENER TU MÉTODO EXACTAMENTE IGUAL
  decodificarToken(): DecodedToken | null {
    const token = this.obtenerToken();
    if (!token) {
      console.log('ApiService: No hay token para decodificar');
      return null;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      return decoded;
    } catch (error) {
      return null;
    }
  }

  // NUEVO MÉTODO PARA VALIDAR TOKEN
  isTokenValid(): boolean {
    const decodedToken = this.decodificarToken();
    if (!decodedToken) {
      return false;
    }

    // Verificar expiración si existe
    if (decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        return false;
      }
    }

    // Verificar que el rol sea válido (1=Admin, 2=Comprador, 3=Vendedor)
    if (![1, 2, 3].includes(decodedToken.rol)) {
      return false;
    }

    return true;
  }

  getUserRole(): number | null {
    const decodedToken = this.decodificarToken();
    return decodedToken ? decodedToken.rol : null;
  }

  // NUEVO MÉTODO PARA VERIFICAR SI ES COMPRADOR
  isComprador(): boolean {
    return this.getUserRole() === 2;
  }

  // NUEVO MÉTODO PARA VERIFICAR SI ES VENDEDOR
  isVendedor(): boolean {
    return this.getUserRole() === 3;
  }

  // NUEVO MÉTODO PARA VERIFICAR SI ES ADMIN
  isAdmin(): boolean {
    return this.getUserRole() === 1;
  }
  //METODO PARA OBTENER LIBROS
  obtenerLibros(): Observable<any> {
    return this.http.get(`${this.baseUrl}/intercambio/obtenerLibros`).pipe(
      catchError((error) => {
        console.error('ApiService: Error al obtener libros:', error);
        return throwError(() => new Error('Error al obtener libros'));
      })
    );
  }

  obtenerLibroPorId(id: number): Observable<any> {
    console.log(`ApiService: Obteniendo libro con ID ${id}`);
    return this.http.get(`${this.baseUrl}/intercambio/obtenerlibros/${id}`);
  }

  registrarLibro(formData: FormData): Observable<any> {
    console.log('ApiService: Datos del libro:', formData);
    return this.http.post(`${this.baseUrl}/intercambio/cargarlibros`, formData);
  }

  actualizarLibro(id: number, libro: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/intercambio/actualizarlibro/${id}`,
      libro
    );
  }

  agregarLibroMarcador(id: number): Observable<any> {
    console.log(`ApiService: Agregando libro con ID ${id} a marcadores`);
    return this.http.post(`${this.baseUrl}/intercambio/agregarMarcador`, {
      id,
    });
  }
}
