import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Expediente, ApiResponse } from '../models/expediente.model';

@Injectable({
  providedIn: 'root',
})
export class ExpedienteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  findAll(): Observable<Expediente[]> {
    return this.http
      .get<ApiResponse<Expediente[]>>(`${this.apiUrl}/expedientes`)
      .pipe(map((res) => res.data));
  }

  findOne(id: string): Observable<Expediente> {
    return this.http
      .get<ApiResponse<Expediente>>(`${this.apiUrl}/expedientes/${id}`)
      .pipe(map((res) => res.data));
  }
}
