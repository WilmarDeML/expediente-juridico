import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentoGrupo } from '../models/expediente.model';
import { DocumentoGrupoCardComponent } from './documento-grupo-card.component';

@Component({
  selector: 'app-documentos-list',
  standalone: true,
  imports: [CommonModule, DocumentoGrupoCardComponent],
  template: `
    <div>
      <!-- Encabezado de sección -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl"
              style="font-family: var(--font-display); color: var(--color-juridico-900)">
            Documentos del Expediente
          </h2>
          <p class="text-sm mt-1"
             style="font-family: var(--font-body); color: var(--color-juridico-500)">
            {{ grupos.length }} grupo{{ grupos.length !== 1 ? 's' : '' }} cargado{{ grupos.length !== 1 ? 's' : '' }}
            · {{ totalArchivos() }} archivo{{ totalArchivos() !== 1 ? 's' : '' }} en total
          </p>
        </div>
      </div>

      <!-- Lista de grupos -->
      @if (grupos.length > 0) {
        <div class="flex flex-col gap-4">
          @for (grupo of grupos; track grupo.id) {
            <app-documento-grupo-card
              [grupo]="grupo"
              (eliminar)="onEliminar($event)" />
          }
        </div>
      } @else {
        <!-- Estado vacío -->
        <div class="rounded-xl p-12 text-center"
             style="background-color: white;
                    border: 2px dashed var(--color-juridico-200)">
          <p class="text-4xl mb-4">📁</p>
          <h3 class="text-lg mb-2"
              style="font-family: var(--font-display); color: var(--color-juridico-700)">
            Sin documentos cargados
          </h3>
          <p class="text-sm"
             style="font-family: var(--font-body); color: var(--color-juridico-400)">
            Usa el formulario para cargar el primer grupo de documentos al expediente.
          </p>
        </div>
      }
    </div>
  `,
})
export class DocumentosListComponent {
  @Input({ required: true }) grupos!: DocumentoGrupo[];
  @Output() eliminar = new EventEmitter<string>();

  totalArchivos(): number {
    return this.grupos.reduce((acc, g) => acc + g.archivos.length, 0);
  }

  onEliminar(grupoId: string) {
    this.eliminar.emit(grupoId);
  }
}
