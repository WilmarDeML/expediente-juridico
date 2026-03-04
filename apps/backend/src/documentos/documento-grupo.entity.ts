import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Expediente } from '../expedientes/expediente.entity';
import { Archivo } from './archivo.entity';

@Entity('documento_grupos')
export class DocumentoGrupo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn()
  fecha_carga: Date;

  @ManyToOne(() => Expediente, (expediente) => expediente.grupos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expediente_id' })
  expediente: Expediente;

  @Column()
  expediente_id: string;

  @OneToMany(() => Archivo, (archivo) => archivo.grupo, {
    cascade: true,
  })
  archivos: Archivo[];
}
