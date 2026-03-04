import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentoGrupo } from './documento-grupo.entity';
import { Archivo } from './archivo.entity';
import { CloudinaryService } from '../common/cloudinary.service';

export interface CrearGrupoDto {
  titulo: string;
  descripcion?: string;
  expediente_id: string;
}

export interface CrearArchivoDto {
  nombre_original: string;
  nombre_almacenado: string;
  mime_type: string;
  tamanio: number;
  url: string;
}

@Injectable()
export class DocumentosService {
  constructor(
    @InjectRepository(DocumentoGrupo)
    private readonly grupoRepository: Repository<DocumentoGrupo>,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
  ) {}

  async findByExpediente(expediente_id: string): Promise<DocumentoGrupo[]> {
    return this.grupoRepository.find({
      where: { expediente_id },
      relations: { archivos: true },
      order: { fecha_carga: 'DESC' },
    });
  }

  async crearGrupoConArchivos(
    dto: CrearGrupoDto,
    archivos: CrearArchivoDto[],
  ): Promise<DocumentoGrupo> {
    const grupo = this.grupoRepository.create({
      titulo:        dto.titulo,
      descripcion:   dto.descripcion,
      expediente_id: dto.expediente_id,
    });

    const grupoGuardado = await this.grupoRepository.save(grupo);

    const archivosEntidades = archivos.map((archivo) =>
      this.archivoRepository.create({
        nombre_original:   archivo.nombre_original,
        nombre_almacenado: archivo.nombre_almacenado,
        mime_type:         archivo.mime_type,
        tamanio:           archivo.tamanio,
        url:               archivo.url,
        grupo_id:          grupoGuardado.id,
      }),
    );

    await this.archivoRepository.save(archivosEntidades);

    return this.grupoRepository.findOne({
      where: { id: grupoGuardado.id },
      relations: { archivos: true },
    }) as Promise<DocumentoGrupo>;
  }

  async eliminarGrupo(
    id: string,
    cloudinaryService: CloudinaryService,
  ): Promise<void> {
    const grupo = await this.grupoRepository.findOne({
      where: { id },
      relations: { archivos: true },
    });

    if (!grupo) {
      throw new NotFoundException(`Grupo con id ${id} no encontrado`);
    }

    // Eliminar archivos de Cloudinary
    for (const archivo of grupo.archivos) {
      await cloudinaryService.eliminarArchivo(archivo.nombre_almacenado);
    }

    await this.grupoRepository.remove(grupo);
  }
}
