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
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { DocumentosService } from './documentos.service';
import { DocumentoGrupo } from './documento-grupo.entity';

@Controller('expedientes/:expedienteId/documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Get()
  findByExpediente(
    @Param('expedienteId', ParseUUIDPipe) expedienteId: string,
  ): Promise<DocumentoGrupo[]> {
    return this.documentosService.findByExpediente(expedienteId);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('archivos', 10, {
      storage: diskStorage({
        destination: join(process.cwd(), 'apps/backend/uploads'),
        filename: (_req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
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
          cb(new BadRequestException(`Tipo de archivo no permitido: ${file.mimetype}`), false);
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
    @Req() req: Request,
  ): Promise<DocumentoGrupo> {
    if (!archivos || archivos.length === 0) {
      throw new BadRequestException('Debe adjuntar al menos un archivo');
    }

    if (!titulo) {
      throw new BadRequestException('El título es requerido');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return this.documentosService.crearGrupoConArchivos(
      { titulo, descripcion, expediente_id: expedienteId },
      archivos,
      baseUrl,
    );
  }

  @Delete(':grupoId')
  eliminarGrupo(
    @Param('grupoId', ParseUUIDPipe) grupoId: string,
  ): Promise<void> {
    return this.documentosService.eliminarGrupo(grupoId);
  }
}
