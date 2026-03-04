import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { DocumentoService } from '../services/documento.service';
import { DocumentoGrupo } from '../models/expediente.model';

@Component({
  selector: 'app-upload-documento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  host: { ngSkipHydration: 'true' },
  template: `
    <div class="rounded-xl overflow-hidden shadow-sm"
         style="background-color: white; border: 1px solid var(--color-juridico-100)">

      <!-- Header -->
      <div class="px-6 py-4 border-b"
           style="background-color: var(--color-juridico-50); border-color: var(--color-juridico-100)">
        <h3 class="text-base font-semibold"
            style="font-family: var(--font-display); color: var(--color-juridico-900)">
          Cargar nuevos documentos
        </h3>
        <p class="text-xs mt-1"
           style="font-family: var(--font-body); color: var(--color-juridico-500)">
          PDF, Word, Excel e imágenes · Máximo 10MB por archivo
        </p>
      </div>

      <div class="p-6 flex flex-col gap-5">

        <!-- Título -->
        <div class="flex flex-col gap-1">
          <label class="text-xs uppercase tracking-widest"
                 style="font-family: var(--font-body); color: var(--color-juridico-500)">
            Título del grupo *
          </label>
          <input
            type="text"
            [(ngModel)]="titulo"
            placeholder="Ej: Documentos de inicio del proceso"
            class="w-full px-4 py-2 rounded-lg text-sm outline-none transition-colors duration-150"
            style="font-family: var(--font-body);
                   color: var(--color-juridico-800);
                   border: 1px solid var(--color-juridico-200);
                   background-color: white;"
            onfocus="this.style.borderColor='var(--color-juridico-600)'"
            onblur="this.style.borderColor='var(--color-juridico-200)'" />
        </div>

        <!-- Descripción -->
        <div class="flex flex-col gap-1">
          <label class="text-xs uppercase tracking-widest"
                 style="font-family: var(--font-body); color: var(--color-juridico-500)">
            Descripción
          </label>
          <textarea
            [(ngModel)]="descripcion"
            placeholder="Describe el contexto de estos documentos dentro del expediente..."
            rows="3"
            class="w-full px-4 py-2 rounded-lg text-sm outline-none transition-colors duration-150 resize-none"
            style="font-family: var(--font-body);
                   color: var(--color-juridico-800);
                   border: 1px solid var(--color-juridico-200);
                   background-color: white;"
            onfocus="this.style.borderColor='var(--color-juridico-600)'"
            onblur="this.style.borderColor='var(--color-juridico-200)'">
          </textarea>
        </div>
	
	<!-- Zona de drop -->
	<div class="flex flex-col gap-1">
	  <label class="text-xs uppercase tracking-widest"
	         style="font-family: var(--font-body); color: var(--color-juridico-500)">
	    Archivos *
	  </label>

	  <!-- Input visible como botón -->
	  <label
	    class="flex flex-col items-center justify-center rounded-lg p-6 text-center cursor-pointer transition-colors duration-150"
	    [style.border]="isDragging() || isHovering() ? '2px dashed var(--color-juridico-600)' : '2px dashed var(--color-juridico-200)'"
  		[style.background-color]="isDragging() || isHovering() ? 'var(--color-juridico-50)' : 'white'"
	    (mouseenter)="isHovering.set(true)"
  		(mouseleave)="isHovering.set(false)"
	    (dragover)="onDragOver($event)"
	    (dragleave)="onDragLeave()"
	    (drop)="onDrop($event)">
	    <p class="text-2xl mb-2">📂</p>
	    <p class="text-sm font-medium"
	       style="font-family: var(--font-body); color: var(--color-juridico-600)">
	      Arrastra archivos aquí o haz clic para seleccionar
	    </p>
	    <p class="text-xs mt-1"
	       style="font-family: var(--font-body); color: var(--color-juridico-400)">
	      Puedes seleccionar múltiples archivos a la vez
	    </p>
	    <input
	      type="file"
	      multiple
	      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
	      class="hidden"
	      (change)="onFileSelected($event)" />
	  </label>
	</div>

        <!-- Preview de archivos seleccionados -->
        @if (archivosSeleccionados().length > 0) {
					<div class="flex flex-col gap-2">
						<p class="text-xs uppercase tracking-widest"
							 style="font-family: var(--font-body); color: var(--color-juridico-500)">
							{{ archivosSeleccionados().length }} archivo{{ archivosSeleccionados().length !== 1 ? 's' : '' }} seleccionado{{ archivosSeleccionados().length !== 1 ? 's' : '' }}
						</p>
						@for (archivo of archivosSeleccionados(); track archivo.name; let i = $index) {
							<div class="flex items-center justify-between px-3 py-2 rounded-lg"
								   style="background-color: var(--color-juridico-50);
								          border: 1px solid var(--color-juridico-100)">
								<div class="flex items-center gap-2 min-w-0">
								  <span class="text-sm">{{ getIcono(archivo.type) }}</span>
								  <span class="text-xs truncate"
								        style="font-family: var(--font-body); color: var(--color-juridico-700)">
								    {{ archivo.name }}
								  </span>
								</div>
								<div class="flex items-center gap-2 ml-2 flex-shrink-0">
								  <span class="text-xs"
								        style="font-family: var(--font-mono); color: var(--color-juridico-400)">
								    {{ formatTamanio(archivo.size) }}
								  </span>
								  <button
								    (click)="eliminarArchivo(i)"
								    class="w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors duration-150"
								    style="color: var(--color-juridico-400)"
								    onmouseenter="this.style.backgroundColor='#fee2e2'; this.style.color='var(--color-estado-cerrado)'"
								    onmouseleave="this.style.backgroundColor='transparent'; this.style.color='var(--color-juridico-400)'"
								    title="Quitar archivo">
								    ✕
								  </button>
								</div>
							</div>
						}
					</div>
				}

        <!-- Barra de progreso -->
        @if (progreso() > 0 && progreso() < 100) {
          <div class="flex flex-col gap-1">
            <div class="flex justify-between">
              <span class="text-xs"
                    style="font-family: var(--font-body); color: var(--color-juridico-500)">
                Cargando...
              </span>
              <span class="text-xs"
                    style="font-family: var(--font-mono); color: var(--color-juridico-600)">
                {{ progreso() }}%
              </span>
            </div>
            <div class="w-full h-1.5 rounded-full overflow-hidden"
                 style="background-color: var(--color-juridico-100)">
              <div class="h-full rounded-full transition-all duration-300"
                   style="background-color: var(--color-juridico-700)"
                   [style.width.%]="progreso()">
              </div>
            </div>
          </div>
        }

        <!-- Mensaje de éxito -->
        @if (exitoso()) {
          <div class="px-4 py-3 rounded-lg text-sm"
               style="background-color: #f0fdf4;
                      border: 1px solid #bbf7d0;
                      color: var(--color-estado-activo);
                      font-family: var(--font-body)">
            ✅ Documentos cargados exitosamente
          </div>
        }

        <!-- Mensaje de error -->
        @if (errorMsg()) {
          <div class="px-4 py-3 rounded-lg text-sm"
               style="background-color: #fef2f2;
                      border: 1px solid #fecaca;
                      color: var(--color-estado-cerrado);
                      font-family: var(--font-body)">
            ⚠️ {{ errorMsg() }}
          </div>
        }

        <!-- Botón de envío -->
        <button
          (click)="onSubmit()"
          [disabled]="cargando() || !titulo || archivosSeleccionados().length === 0"
          class="w-full py-3 rounded-lg text-sm font-semibold transition-opacity duration-150"
          style="font-family: var(--font-body);
                 background-color: var(--color-juridico-800);
                 color: white;"
          [style.opacity]="cargando() || !titulo || archivosSeleccionados().length === 0 ? '0.5' : '1'">
          {{ cargando() ? 'Cargando...' : 'Cargar documentos' }}
        </button>

      </div>
    </div>
  `,
})
export class UploadDocumentoComponent {
  @Input({ required: true }) expedienteId!: string;
  @Output() documentoCargado = new EventEmitter<DocumentoGrupo>();

  private readonly documentoService = inject(DocumentoService);
  
  titulo = '';
  descripcion = '';

  archivosSeleccionados = signal<File[]>([]);
  isDragging            = signal(false);
  isHovering            = signal(false);
  progreso              = signal(0);
  cargando              = signal(false);
  exitoso               = signal(false);
  errorMsg              = signal<string | null>(null);

  onFileSelected(event: Event) {
	  const input = event.target as HTMLInputElement;
	  if (input.files) {
	    const nuevos = Array.from(input.files);
	    this.archivosSeleccionados.update((prev) => [...prev, ...nuevos]);
	    input.value = ''; // permite volver a seleccionar los mismos archivos
	  }
	}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files) {
      const nuevos = Array.from(event.dataTransfer.files);
    	this.archivosSeleccionados.update((prev) => [...prev, ...nuevos]);
    }
  }
  
  eliminarArchivo(index: number) {
		this.archivosSeleccionados.update((prev) =>
		  prev.filter((_, i) => i !== index),
		);
	}

  onSubmit() {
    if (!this.titulo || this.archivosSeleccionados().length === 0) return;

    this.cargando.set(true);
    this.exitoso.set(false);
    this.errorMsg.set(null);
    this.progreso.set(0);

    this.documentoService
      .cargarDocumentos(
        this.expedienteId,
        this.titulo,
        this.descripcion,
        this.archivosSeleccionados(),
      )
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.progreso.set(Math.round((100 * event.loaded) / event.total));
          }
          if (event.type === HttpEventType.Response) {
            const body = event.body as { data: DocumentoGrupo };
            this.cargando.set(false);
            this.exitoso.set(true);
            this.progreso.set(100);
            this.titulo = '';
            this.descripcion = '';
            this.archivosSeleccionados.set([]);
            this.documentoCargado.emit(body.data);
            setTimeout(() => this.exitoso.set(false), 3000);
          }
        },
        error: (err) => {
          this.cargando.set(false);
          this.errorMsg.set(err.error?.message || 'Error al cargar los documentos');
        },
      });
  }

  getIcono(mimeType: string): string {
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.startsWith('image/')) return '🖼️';
    return '📎';
  }

  formatTamanio(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
