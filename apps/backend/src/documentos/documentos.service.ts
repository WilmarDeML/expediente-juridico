import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentoGrupo } from './documento-grupo.entity';
import { Archivo } from './archivo.entity';
import { unlink } from 'fs/promises';
import { join } from 'path';

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
  grupo_id: string;
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
    archivos: Express.Multer.File[],
    baseUrl: string,
  ): Promise<DocumentoGrupo> {
    const grupo = this.grupoRepository.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      expediente_id: dto.expediente_id,
    });

    const grupoGuardado = await this.grupoRepository.save(grupo);

    const archivosEntidades = archivos.map((file) =>
      this.archivoRepository.create({
        nombre_original: file.originalname,
        nombre_almacenado: file.filename,
        mime_type: file.mimetype,
        tamanio: file.size,
        url: `${baseUrl}/uploads/${file.filename}`,
        grupo_id: grupoGuardado.id,
      }),
    );

    await this.archivoRepository.save(archivosEntidades);

    return this.grupoRepository.findOne({
      where: { id: grupoGuardado.id },
      relations: { archivos: true },
    }) as Promise<DocumentoGrupo>;
  }

  async eliminarGrupo(id: string): Promise<void> {
		const grupo = await this.grupoRepository.findOne({
		  where: { id },
		  relations: { archivos: true },
		});

		if (!grupo) {
		  throw new NotFoundException(`Grupo con id ${id} no encontrado`);
		}

		// Eliminar archivos físicos del disco
		for (const archivo of grupo.archivos) {
		  const rutaArchivo = join(
		    process.cwd(),
		    'apps/backend/uploads',
		    archivo.nombre_almacenado,
		  );
		  try {
		    await unlink(rutaArchivo);
		  } catch {
		    // Si el archivo no existe en disco, continuamos sin lanzar error
		    console.warn(`Archivo no encontrado en disco: ${archivo.nombre_almacenado}`);
		  }
		}

		await this.grupoRepository.remove(grupo);
	}
}
