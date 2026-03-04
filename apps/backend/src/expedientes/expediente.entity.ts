import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DocumentoGrupo } from '../documentos/documento-grupo.entity';

export enum EstadoExpediente {
  ACTIVO    = 'activo',
  EN_ESPERA = 'en_espera',
  CERRADO   = 'cerrado',
  ARCHIVADO = 'archivado',
}

@Entity('expedientes')
export class Expediente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numero_expediente: string;

  @Column()
  titulo: string;

  @Column()
  cliente: string;

  @Column()
  abogado_responsable: string;

  @Column({
    type: 'enum',
    enum: EstadoExpediente,
    default: EstadoExpediente.ACTIVO,
  })
  estado: EstadoExpediente;

  @Column({ nullable: true })
  juzgado: string;

  @Column({ nullable: true })
  tipo_proceso: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn()
  fecha_apertura: Date;

  @UpdateDateColumn()
  fecha_ultima_actualizacion: Date;

  @OneToMany(() => DocumentoGrupo, (grupo) => grupo.expediente, {
    cascade: true,
  })
  grupos: DocumentoGrupo[];
}
