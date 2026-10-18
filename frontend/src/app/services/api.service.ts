import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Punto de integración previsto con FastAPI. No se realizan llamadas por defecto:
 * las vistas de Stitch contienen datos de DEMOSTRACIÓN.
 * Nunca almacenar tokens de mapas, llaves LLM ni contraseñas en localStorage.
 */
@Injectable({providedIn:'root'})
export class DarTraceApiService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = '/api/v1';

  get<T>(resource: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${resource.replace(/^\//,'')}`);
  }
  post<T>(resource:string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${resource.replace(/^\//,'')}`, body);
  }
}