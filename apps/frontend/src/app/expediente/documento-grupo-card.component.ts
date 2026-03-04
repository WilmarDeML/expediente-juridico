import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentoGrupo } from '../models/expediente.model';
import { ArchivoItemComponent } from './archivo-item.component';

@Component({
  selector: 'app-documento-grupo-card',
  standalone: true,
  imports: [CommonModule, ArchivoItemComponent],
  template: `
    <div class="rounded-xl overflow-hidden shadow-sm"
         style="background-color: white; border: 1px solid var(--color-juridico-100)">

      <!-- Borde izquierdo de acento + header -->
      <div class="flex items-start justify-between p-5"
           style="border-left: 4px solid var(--color-juridico-600)">

        <div class="flex-1 min-w-0">
          <h3 class="text-base font-semibold mb-1"
              style="font-family: var(--font-display); color: var(--color-juridico-900)">
            {{ grupo.titulo }}
          </h3>
          @if (grupo.descripcion) {
            <p class="text-sm leading-relaxed mb-2"
               style="font-family: var(--font-body); color: var(--color-juridico-500)">
              {{ grupo.descripcion }}
            </p>
          }
          <p class="text-xs"
             style="font-family: var(--font-mono); color: var(--color-juridico-400)">
            {{ grupo.archivos.length }} archivo{{ grupo.archivos.length !== 1 ? 's' : '' }}
            · Cargado el {{ grupo.fecha_carga | date:'dd/MM/yyyy HH:mm' }}
          </p>
        </div>

        <!-- Botón eliminar -->
        <button
          (click)="onEliminar()"
          class="ml-4 flex-shrink-0 p-2 rounded-lg transition-colors duration-150 text-sm"
          style="color: var(--color-juridico-300)"
          onmouseenter="this.style.backgroundColor='#fee2e2'; this.style.color='var(--color-estado-cerrado)'"
          onmouseleave="this.style.backgroundColor='transparent'; this.style.color='var(--color-juridico-300)'"
          title="Eliminar grupo">
          🗑️
        </button>

      </div>

      <!-- Lista de archivos -->
      @if (grupo.archivos.length > 0) {
        <div class="px-5 pb-5 flex flex-col gap-2">
          @for (archivo of grupo.archivos; track archivo.id) {
            <app-archivo-item [archivo]="archivo" />
          }
        </div>
      } @else {
        <div class="px-5 pb-5">
          <p class="text-sm text-center py-4"
             style="font-family: var(--font-body); color: var(--color-juridico-400)">
            Sin archivos en este grupo
          </p>
        </div>
      }

    </div>
  `,
})
export class DocumentoGrupoCardComponent {
  @Input({ required: true }) grupo!: DocumentoGrupo;
  @Output() eliminar = new EventEmitter<string>();

  onEliminar() {
    if (confirm(`¿Eliminar el grupo "${this.grupo.titulo}" y todos sus archivos?`)) {
      this.eliminar.emit(this.grupo.id);
    }
  }
}
