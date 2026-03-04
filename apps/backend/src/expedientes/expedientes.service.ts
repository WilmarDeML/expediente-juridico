import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expediente } from './expediente.entity';

@Injectable()
export class ExpedientesService {
  constructor(
    @InjectRepository(Expediente)
    private readonly expedienteRepository: Repository<Expediente>,
  ) {}

  async findAll(): Promise<Expediente[]> {
    return this.expedienteRepository.find({
      order: { fecha_apertura: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Expediente> {
    const expediente = await this.expedienteRepository.findOne({
      where: { id },
      relations: {
        grupos: {
          archivos: true,
        },
      },
      order: {
        grupos: {
          fecha_carga: 'DESC',
        },
      },
    });

    if (!expediente) {
      throw new NotFoundException(`Expediente con id ${id} no encontrado`);
    }

    return expediente;
  }
}
