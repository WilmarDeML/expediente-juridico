import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoGrupo } from './documento-grupo.entity';
import { Archivo } from './archivo.entity';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './documentos.service';
import { CloudinaryModule } from '../common/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentoGrupo, Archivo]),
    CloudinaryModule,
  ],
  controllers: [DocumentosController],
  providers: [DocumentosService],
  exports: [DocumentosService],
})
export class DocumentosModule {}
