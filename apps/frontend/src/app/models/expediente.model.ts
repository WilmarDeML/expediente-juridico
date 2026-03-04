export enum EstadoExpediente {
  ACTIVO    = 'activo',
  EN_ESPERA = 'en_espera',
  CERRADO   = 'cerrado',
  ARCHIVADO = 'archivado',
}

export interface Archivo {
  id: string;
  nombre_original: string;
  nombre_almacenado: string;
  mime_type: string;
  tamanio: number;
  url: string;
  fecha_carga: string;
  grupo_id: string;
}

export interface DocumentoGrupo {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_carga: string;
  expediente_id: string;
  archivos: Archivo[];
}

export interface Expediente {
  id: string;
  numero_expediente: string;
  titulo: string;
  cliente: string;
  abogado_responsable: string;
  estado: EstadoExpediente;
  juzgado: string;
  tipo_proceso: string;
  descripcion: string;
  fecha_apertura: string;
  fecha_ultima_actualizacion: string;
  grupos: DocumentoGrupo[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
}
