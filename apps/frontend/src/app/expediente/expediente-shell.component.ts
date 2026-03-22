import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ExpedienteService } from '../services/expediente.service';
import { DocumentoService } from '../services/documento.service';
import { Expediente, DocumentoGrupo } from '../models/expediente.model';
import { ExpedienteHeaderComponent } from './expediente-header.component';
import { DocumentosListComponent } from './documentos-list.component';
import { UploadDocumentoComponent } from './upload-documento.component';

@Component({
  selector: 'app-expediente-shell',
  standalone: true,
  imports: [
    CommonModule,
    ExpedienteHeaderComponent,
    DocumentosListComponent,
    UploadDocumentoComponent,
  ],
  template: `
    @if (cargando()) {
      <div class="min-h-screen flex items-center justify-center"
           style="background-color: var(--color-juridico-50)">
        <div class="text-center">
          <div class="inline-block w-8 h-8 border-4 rounded-full animate-spin mb-4"
               style="border-color: var(--color-juridico-200);
                      border-top-color: var(--color-juridico-700)">
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
          <p class="text-xl mb-2"
             style="font-family: var(--font-display); color: var(--color-juridico-900)">
            No se pudo cargar el expediente
          </p>
          <p class="text-sm"
             style="font-family: var(--font-body); color: var(--color-juridico-500)">
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
                style="background-color: var(--color-juridico-900);
                       border-color: var(--color-juridico-800)">
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
            <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-white"
                  [style.background-color]="getColorEstado(expediente()!.estado)">
              {{ getLabelEstado(expediente()!.estado) }}
            </span>
          </div>
        </header>

        <!-- Layout de dos columnas -->
        <div class="max-w-7xl mx-auto px-6 py-8">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">

            <!-- Columna izquierda — Info del expediente -->
            <div class="lg:col-span-1 flex flex-col gap-6">
              <app-expediente-header [expediente]="expediente()!" />

              <!-- Acciones rápidas simuladas -->
              <div class="rounded-xl overflow-hidden shadow-sm"
                   style="background-color: white;
                          border: 1px solid var(--color-juridico-100)">
                <div class="px-5 py-4 border-b"
                     style="border-color: var(--color-juridico-100)">
                  <h3 class="text-sm font-semibold"
                      style="font-family: var(--font-display); color: var(--color-juridico-700)">
                    Acciones rápidas
                  </h3>
                </div>
                <div class="p-4 flex flex-col gap-2">
                  @for (accion of accionesSimuladas; track accion.label) {
                    <button
                      class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors duration-150"
                      style="font-family: var(--font-body); color: var(--color-juridico-600)"
                      onmouseenter="this.style.backgroundColor='var(--color-juridico-50)'"
                      onmouseleave="this.style.backgroundColor='transparent'"
                      title="Próximamente">
                      <span>{{ accion.icono }}</span>
                      <span>{{ accion.label }}</span>
                      <span class="ml-auto text-xs px-2 py-0.5 rounded-full"
                            style="background-color: var(--color-juridico-100);
                                   color: var(--color-juridico-400)">
                        Próximo
                      </span>
                    </button>
                  }
                </div>
              </div>

              <!-- Partes procesales simuladas -->
              <div class="rounded-xl overflow-hidden shadow-sm"
                   style="background-color: white;
                          border: 1px solid var(--color-juridico-100)">
                <div class="px-5 py-4 border-b"
                     style="border-color: var(--color-juridico-100)">
                  <h3 class="text-sm font-semibold"
                      style="font-family: var(--font-display); color: var(--color-juridico-700)">
                    Partes procesales
                  </h3>
                </div>
                <div class="p-4 flex flex-col gap-4">
                  @for (parte of partesSimuladas; track parte.rol) {
                    <div>
                      <p class="text-xs uppercase tracking-widest mb-1"
                         style="font-family: var(--font-body); color: var(--color-juridico-400)">
                        {{ parte.rol }}
                      </p>
                      <p class="text-sm font-medium"
                         style="font-family: var(--font-body); color: var(--color-juridico-800)">
                        {{ parte.nombre }}
                      </p>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Columna derecha — Documentos -->
            <div class="lg:col-span-2 flex flex-col gap-6">
              <app-upload-documento
                [expedienteId]="expediente()!.id"
                (documentoCargado)="onDocumentoCargado($event)" />

              <app-documentos-list
                [grupos]="grupos()"
                (eliminar)="onEliminarGrupo($event)" />
            </div>

          </div>
        </div>
      </div>
    }
  `,
})
export class ExpedienteShellComponent implements OnInit {
	private readonly meta              = inject(Meta);
	private readonly title             = inject(Title);
  private readonly route             = inject(ActivatedRoute);
  private readonly expedienteService = inject(ExpedienteService);
  private readonly documentoService  = inject(DocumentoService);

  expediente = signal<Expediente | null>(null);
  grupos     = signal<DocumentoGrupo[]>([]);
  cargando   = signal(true);
  error      = signal<string | null>(null);

  accionesSimuladas = [
    { icono: '📋', label: 'Generar reporte' },
    { icono: '📤', label: 'Compartir con cliente' },
    { icono: '📅', label: 'Agendar audiencia' },
    { icono: '🔔', label: 'Configurar alertas' },
  ];

  partesSimuladas = [
    { rol: 'Demandante', nombre: 'Inversiones del Norte Ltda.' },
    { rol: 'Demandado', nombre: 'Constructora Andina S.A.' },
    { rol: 'Juez', nombre: 'Dr. Hernán Ospina Vargas' },
  ];

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
				this.grupos.set(expediente.grupos ?? []);
				this.cargando.set(false);

				// Meta tags dinámicos
				this.title.setTitle(
					`${expediente.numero_expediente} — ${expediente.cliente} | Expediente Jurídico`,
				);
				this.meta.updateTag({
					name: 'description',
					content: `${expediente.titulo}. Abogado: ${expediente.abogado_responsable}. Estado: ${expediente.estado}.`,
				});
				this.meta.updateTag({
					property: 'og:title',
					content: `${expediente.numero_expediente} — ${expediente.cliente}`,
				});
				this.meta.updateTag({
					property: 'og:description',
					content: expediente.descripcion,
				});
			},
      error: (err) => {
        this.error.set(err.error.message || 'Error al cargar el expediente');
        this.cargando.set(false);
      },
    });
  }

  onDocumentoCargado(grupo: DocumentoGrupo) {
    this.grupos.update((grupos) => [grupo, ...grupos]);
  }

  onEliminarGrupo(grupoId: string) {
    this.documentoService
      .eliminarGrupo(this.expediente()!.id, grupoId)
      .subscribe({
        next: () => {
          this.grupos.update((grupos) =>
            grupos.filter((g) => g.id !== grupoId),
          );
        },
        error: (err) => {
          alert(err.error?.message || 'Error al eliminar el grupo');
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
