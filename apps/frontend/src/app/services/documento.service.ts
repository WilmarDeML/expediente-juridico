import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, map, of, EMPTY } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/core';
import { DocumentoGrupo, ApiResponse } from '../models/expediente.model';
import { environment } from '../../environments/environment';

const GRUPOS_KEY = (expedienteId: string) =>
  makeStateKey<DocumentoGrupo[]>(`grupos_${expedienteId}`);

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {
  private readonly http          = inject(HttpClient);
  private readonly transferState = inject(TransferState);
  private readonly platformId    = inject(PLATFORM_ID);
	private readonly apiUrl = environment.apiUrl;

  findByExpediente(expedienteId: string): Observable<DocumentoGrupo[]> {
    const key    = GRUPOS_KEY(expedienteId);
    const cached = this.transferState.get(key, null);

    if (cached) {
      this.transferState.remove(key);
      return of(cached);
    }

    return this.http
      .get<ApiResponse<DocumentoGrupo[]>>(
        `${this.apiUrl}/expedientes/${expedienteId}/documentos`,
      )
      .pipe(
        map((res) => {
          if (!isPlatformBrowser(this.platformId)) {
            this.transferState.set(key, res.data);
          }
          return res.data;
        }),
      );
  }

  cargarDocumentos(
    expedienteId: string,
    titulo: string,
    descripcion: string,
    archivos: File[],
  ): Observable<HttpEvent<ApiResponse<DocumentoGrupo>>> {
    // La carga de archivos solo puede ocurrir en el browser
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    archivos.forEach((file) => formData.append('archivos', file));

    const req = new HttpRequest(
      'POST',
      `${this.apiUrl}/expedientes/${expedienteId}/documentos`,
      formData,
      { reportProgress: true },
    );

    return this.http.request(req);
  }

  eliminarGrupo(
    expedienteId: string,
    grupoId: string,
  ): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return EMPTY;
    }

    return this.http
      .delete<ApiResponse<void>>(
        `${this.apiUrl}/expedientes/${expedienteId}/documentos/${grupoId}`,
      )
      .pipe(map(() => void 0));
  }
}
