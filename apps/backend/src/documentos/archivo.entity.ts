import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DocumentoGrupo } from './documento-grupo.entity';

@Entity('archivos')
export class Archivo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre_original: string;

  @Column()
  nombre_almacenado: string;

  @Column()
  mime_type: string;

  @Column({ type: 'bigint' })
  tamanio: number;

  @Column()
  url: string;

  @CreateDateColumn()
  fecha_carga: Date;

  @ManyToOne(() => DocumentoGrupo, (grupo) => grupo.archivos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'grupo_id' })
  grupo: DocumentoGrupo;

  @Column()
  grupo_id: string;
}
