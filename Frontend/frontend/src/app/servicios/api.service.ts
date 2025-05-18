import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  
  login(datos: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, datos);
  }

  register(datos: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro`, datos);
  }
  
}
