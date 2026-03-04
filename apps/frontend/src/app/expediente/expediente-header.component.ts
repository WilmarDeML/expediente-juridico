import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Expediente } from '../models/expediente.model';

@Component({
  selector: 'app-expediente-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-xl shadow-sm overflow-hidden"
         style="background-color: white; border: 1px solid var(--color-juridico-100)">

      <!-- Franja superior de color -->
      <div class="h-2" style="background-color: var(--color-juridico-700)"></div>

      <div class="p-6">
        <!-- Título del expediente -->
        <h2 class="text-xl leading-snug mb-1"
            style="font-family: var(--font-display); color: var(--color-juridico-900)">
          {{ expediente.titulo }}
        </h2>
        <p class="text-sm mb-6"
           style="font-family: var(--font-mono); color: var(--color-juridico-500)">
          {{ expediente.numero_expediente }}
        </p>

        <!-- Grid de metadatos -->
        <div class="grid grid-cols-1 gap-4">

          <div class="flex flex-col gap-1">
            <span class="text-xs uppercase tracking-widest"
                  style="font-family: var(--font-body); color: var(--color-juridico-400)">
              Cliente
            </span>
            <span class="text-sm font-semibold"
                  style="font-family: var(--font-body); color: var(--color-juridico-800)">
              {{ expediente.cliente }}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-xs uppercase tracking-widest"
                  style="font-family: var(--font-body); color: var(--color-juridico-400)">
              Abogado Responsable
            </span>
            <span class="text-sm font-semibold"
                  style="font-family: var(--font-body); color: var(--color-juridico-800)">
              {{ expediente.abogado_responsable }}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-xs uppercase tracking-widest"
                  style="font-family: var(--font-body); color: var(--color-juridico-400)">
              Juzgado
            </span>
            <span class="text-sm"
                  style="font-family: var(--font-body); color: var(--color-juridico-700)">
              {{ expediente.juzgado }}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-xs uppercase tracking-widest"
                  style="font-family: var(--font-body); color: var(--color-juridico-400)">
              Tipo de Proceso
            </span>
            <span class="text-sm"
                  style="font-family: var(--font-body); color: var(--color-juridico-700)">
              {{ expediente.tipo_proceso }}
            </span>
          </div>

        </div>

        <!-- Separador -->
        <div class="my-5 border-t"
             style="border-color: var(--color-juridico-100)"></div>

        <!-- Fechas -->
        <div class="grid grid-cols-1 gap-3">
          <div class="flex justify-between items-center">
            <span class="text-xs uppercase tracking-widest"
                  style="font-family: var(--font-body); color: var(--color-juridico-400)">
              Apertura
            </span>
            <span class="text-xs font-medium"
                  style="font-family: var(--font-mono); color: var(--color-juridico-600)">
              {{ expediente.fecha_apertura | date:'dd/MM/yyyy' }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs uppercase tracking-widest"
                  style="font-family: var(--font-body); color: var(--color-juridico-400)">
              Última actualización
            </span>
            <span class="text-xs font-medium"
                  style="font-family: var(--font-mono); color: var(--color-juridico-600)">
              {{ expediente.fecha_ultima_actualizacion | date:'dd/MM/yyyy' }}
            </span>
          </div>
        </div>

        <!-- Separador -->
        <div class="my-5 border-t"
             style="border-color: var(--color-juridico-100)"></div>

        <!-- Descripción -->
        <div>
          <span class="text-xs uppercase tracking-widest block mb-2"
                style="font-family: var(--font-body); color: var(--color-juridico-400)">
            Descripción del caso
          </span>
          <p class="text-sm leading-relaxed"
             style="font-family: var(--font-body); color: var(--color-juridico-600)">
            {{ expediente.descripcion }}
          </p>
        </div>

      </div>
    </div>
  `,
})
export class ExpedienteHeaderComponent {
  @Input({ required: true }) expediente!: Expediente;
}
