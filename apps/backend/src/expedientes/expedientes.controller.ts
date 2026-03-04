import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ExpedientesService } from './expedientes.service';
import { Expediente } from './expediente.entity';

@Controller('expedientes')
export class ExpedientesController {
  constructor(private readonly expedientesService: ExpedientesService) {}

  @Get()
  findAll(): Promise<Expediente[]> {
    return this.expedientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Expediente> {
    return this.expedientesService.findOne(id);
  }
}
