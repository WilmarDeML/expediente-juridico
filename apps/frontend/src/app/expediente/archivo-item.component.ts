import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Archivo } from '../models/expediente.model';

@Component({
  selector: 'app-archivo-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between py-3 px-4 rounded-lg transition-colors duration-150 group"
         style="background-color: var(--color-juridico-50);"
         onmouseenter="this.style.backgroundColor='var(--color-juridico-100)'"
         onmouseleave="this.style.backgroundColor='var(--color-juridico-50)'">

      <!-- Ícono + info -->
      <div class="flex items-center gap-3 min-w-0">
        <span class="text-xl flex-shrink-0">{{ getIcono(archivo.mime_type) }}</span>
        <div class="min-w-0">
          <p class="text-sm font-medium truncate"
             style="font-family: var(--font-body); color: var(--color-juridico-800)">
            {{ archivo.nombre_original }}
          </p>
          <p class="text-xs"
             style="font-family: var(--font-mono); color: var(--color-juridico-400)">
            {{ getTipoLabel(archivo.mime_type) }} · {{ formatTamanio(archivo.tamanio) }} · {{ archivo.fecha_carga | date:'dd/MM/yyyy' }}
          </p>
        </div>
      </div>

      <!-- Botón descarga -->
      <a [href]="archivo.url"
         target="_blank"
         class="flex-shrink-0 ml-4 px-3 py-1 rounded text-xs font-medium transition-colors duration-150"
         style="font-family: var(--font-body);
                color: var(--color-juridico-600);
                border: 1px solid var(--color-juridico-200);"
         onmouseenter="this.style.backgroundColor='var(--color-juridico-700)'; this.style.color='white'; this.style.borderColor='var(--color-juridico-700)'"
         onmouseleave="this.style.backgroundColor='transparent'; this.style.color='var(--color-juridico-600)'; this.style.borderColor='var(--color-juridico-200)'">
        Descargar
      </a>

    </div>
  `,
})
export class ArchivoItemComponent {
  @Input({ required: true }) archivo!: Archivo;

  getIcono(mimeType: string): string {
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.startsWith('image/')) return '🖼️';
    return '📎';
  }

  getTipoLabel(mimeType: string): string {
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType.includes('word')) return 'Word';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Excel';
    if (mimeType.startsWith('image/jpeg')) return 'JPG';
    if (mimeType.startsWith('image/png')) return 'PNG';
    return 'Archivo';
  }

  formatTamanio(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
