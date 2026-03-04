import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expediente } from './expediente.entity';
import { ExpedientesController } from './expedientes.controller';
import { ExpedientesService } from './expedientes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Expediente])],
  controllers: [ExpedientesController],
  providers: [ExpedientesService],
  exports: [ExpedientesService],
})
export class ExpedientesModule {}
