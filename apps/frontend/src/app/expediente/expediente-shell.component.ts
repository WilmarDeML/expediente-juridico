import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExpedienteService } from '../services/expediente.service';
import { Expediente } from '../models/expediente.model';

@Component({
  selector: 'app-expediente-shell',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (cargando()) {
      <div class="min-h-screen flex items-center justify-center"
           style="background-color: var(--color-juridico-50)">
        <div class="text-center">
          <div class="inline-block w-8 h-8 border-4 rounded-full animate-spin mb-4"
               style="border-color: var(--color-juridico-200); border-top-color: var(--color-juridico-700)">
          </div>
          <p style="font-family: var(--font-body); color: var(--color-juridico-600)">
            Cargando expediente...
          </p>
        </div>
      </div>
    }

    @if (error()) {
      <div class="min-h-screen flex items-center justify-center"
           style="background-color: var(--color-juridico-50)">
        <div class="text-center p-8 rounded-lg bg-white shadow-md">
          <p class="text-2xl mb-2">⚠️</p>
          <p style="font-family: var(--font-display); color: var(--color-juridico-900)"
             class="text-xl mb-2">
            No se pudo cargar el expediente
          </p>
          <p style="font-family: var(--font-body); color: var(--color-juridico-500)"
             class="text-sm">
            {{ error() }}
          </p>
        </div>
      </div>
    }

    @if (expediente()) {
      <div class="min-h-screen"
           style="background-color: var(--color-juridico-50)">
        <!-- Header superior -->
        <header class="shadow-sm border-b"
                style="background-color: var(--color-juridico-900); border-color: var(--color-juridico-800)">
          <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">⚖️</span>
              <div>
                <p class="text-xs uppercase tracking-widest"
                   style="font-family: var(--font-body); color: var(--color-juridico-400)">
                  Sistema de Expedientes Jurídicos
                </p>
                <h1 class="text-lg font-semibold"
                    style="font-family: var(--font-display); color: var(--color-juridico-100)">
                  {{ expediente()!.numero_expediente }}
                </h1>
              </div>
            </div>
            <!-- Badge de estado -->
            <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-white"
                  [style.background-color]="getColorEstado(expediente()!.estado)">
              {{ getLabelEstado(expediente()!.estado) }}
            </span>
          </div>
        </header>

        <!-- Contenido principal -->
        <main class="max-w-7xl mx-auto px-6 py-8">
          <p style="font-family: var(--font-body); color: var(--color-juridico-600)"
             class="text-center">
            Componentes en construcción...
          </p>
        </main>
      </div>
    }
  `,
})
export class ExpedienteShellComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly expedienteService = inject(ExpedienteService);

  expediente = signal<Expediente | null>(null);
  cargando   = signal<boolean>(true);
  error      = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID de expediente no válido');
      this.cargando.set(false);
      return;
    }

    this.expedienteService.findOne(id).subscribe({
      next: (expediente) => {
        this.expediente.set(expediente);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar el expediente');
        this.cargando.set(false);
      },
    });
  }

  getColorEstado(estado: string): string {
    const colores: Record<string, string> = {
      activo:    'var(--color-estado-activo)',
      en_espera: 'var(--color-estado-espera)',
      cerrado:   'var(--color-estado-cerrado)',
      archivado: 'var(--color-estado-archivado)',
    };
    return colores[estado] ?? colores['archivado'];
  }

  getLabelEstado(estado: string): string {
    const labels: Record<string, string> = {
      activo:    'Activo',
      en_espera: 'En Espera',
      cerrado:   'Cerrado',
      archivado: 'Archivado',
    };
    return labels[estado] ?? estado;
  }
}
