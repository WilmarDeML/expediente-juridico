import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {
  TransferState,
  makeStateKey,
  StateKey,
} from '@angular/core';
import { Expediente, ApiResponse } from '../models/expediente.model';

const EXPEDIENTE_KEY = (id: string): StateKey<Expediente> =>
  makeStateKey<Expediente>(`expediente_${id}`);

const EXPEDIENTES_KEY = makeStateKey<Expediente[]>('expedientes');

@Injectable({
  providedIn: 'root',
})
export class ExpedienteService {
  private readonly http       = inject(HttpClient);
  private readonly transferState = inject(TransferState);
  private readonly platformId    = inject(PLATFORM_ID);
  private readonly apiUrl        = 'http://localhost:3000/api';

  findAll(): Observable<Expediente[]> {
    const cached = this.transferState.get(EXPEDIENTES_KEY, null);

    if (cached) {
      this.transferState.remove(EXPEDIENTES_KEY);
      return of(cached);
    }

    return this.http
      .get<ApiResponse<Expediente[]>>(`${this.apiUrl}/expedientes`)
      .pipe(
        map((res) => {
          if (!isPlatformBrowser(this.platformId)) {
            this.transferState.set(EXPEDIENTES_KEY, res.data);
          }
          return res.data;
        }),
      );
  }

  findOne(id: string): Observable<Expediente> {
    const key    = EXPEDIENTE_KEY(id);
    const cached = this.transferState.get(key, null);

    if (cached) {
      this.transferState.remove(key);
      return of(cached);
    }

    return this.http
      .get<ApiResponse<Expediente>>(`${this.apiUrl}/expedientes/${id}`)
      .pipe(
        map((res) => {
          if (!isPlatformBrowser(this.platformId)) {
            this.transferState.set(key, res.data);
          }
          return res.data;
        }),
      );
  }
}
