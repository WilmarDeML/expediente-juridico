import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFiles,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Request } from 'express';
import { DocumentosService } from './documentos.service';
import { CloudinaryService } from '../common/cloudinary.service';
import { DocumentoGrupo } from './documento-grupo.entity';

@Controller('expedientes/:expedienteId/documentos')
export class DocumentosController {
  constructor(
    private readonly documentosService: DocumentosService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findByExpediente(
    @Param('expedienteId', ParseUUIDPipe) expedienteId: string,
  ): Promise<DocumentoGrupo[]> {
    return this.documentosService.findByExpediente(expedienteId);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('archivos', 10, {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        const allowedMimes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Tipo de archivo no permitido: ${file.mimetype}`,
            ),
            false,
          );
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async crearGrupo(
    @Param('expedienteId', ParseUUIDPipe) expedienteId: string,
    @Body('titulo') titulo: string,
    @Body('descripcion') descripcion: string,
    @UploadedFiles() archivos: Express.Multer.File[],
    @Req() _req: Request,
  ): Promise<DocumentoGrupo> {
    if (!archivos || archivos.length === 0) {
      throw new BadRequestException('Debe adjuntar al menos un archivo');
    }

    if (!titulo) {
      throw new BadRequestException('El título es requerido');
    }

    // Subir archivos a Cloudinary
    const cloudinary = this.cloudinaryService.getCloudinary();
    const archivosSubidos = await Promise.all(
      archivos.map(async (file) => {
        const result = await new Promise<{
          public_id: string;
          secure_url: string;
        }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'expedientes',
              resource_type: 'raw',
              public_id: `${Date.now()}_${file.originalname}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { public_id: string; secure_url: string });
            },
          );
          uploadStream.end(file.buffer);
        });

        return {
          nombre_original:    file.originalname,
          nombre_almacenado:  result.public_id,
          mime_type:          file.mimetype,
          tamanio:            file.size,
          url:                result.secure_url,
        };
      }),
    );

    return this.documentosService.crearGrupoConArchivos(
      { titulo, descripcion, expediente_id: expedienteId },
      archivosSubidos,
    );
  }

  @Delete(':grupoId')
  eliminarGrupo(
    @Param('grupoId', ParseUUIDPipe) grupoId: string,
  ): Promise<void> {
    return this.documentosService.eliminarGrupo(
      grupoId,
      this.cloudinaryService,
    );
  }
}
