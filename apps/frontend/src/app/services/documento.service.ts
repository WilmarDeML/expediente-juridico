import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DocumentoGrupo, ApiResponse } from '../models/expediente.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  findByExpediente(expedienteId: string): Observable<DocumentoGrupo[]> {
    return this.http
      .get<ApiResponse<DocumentoGrupo[]>>(
        `${this.apiUrl}/expedientes/${expedienteId}/documentos`,
      )
      .pipe(map((res) => res.data));
  }

  cargarDocumentos(
    expedienteId: string,
    titulo: string,
    descripcion: string,
    archivos: File[],
  ): Observable<HttpEvent<ApiResponse<DocumentoGrupo>>> {
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
    return this.http
      .delete<ApiResponse<void>>(
        `${this.apiUrl}/expedientes/${expedienteId}/documentos/${grupoId}`,
      )
      .pipe(map(() => void 0));
  }
}
