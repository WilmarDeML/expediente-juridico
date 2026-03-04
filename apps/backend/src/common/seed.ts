import { DataSource } from 'typeorm';
import { Expediente, EstadoExpediente } from '../expedientes/expediente.entity';
import { DocumentoGrupo } from '../documentos/documento-grupo.entity';
import { Archivo } from '../documentos/archivo.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env['DATABASE_HOST'],
  port: Number(process.env['DATABASE_PORT']),
  username: process.env['DATABASE_USER'],
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'],
  entities: [Expediente, DocumentoGrupo, Archivo],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  console.log('📦 Conectado a la base de datos');

  // Limpiar datos existentes
  await dataSource.query('TRUNCATE TABLE archivos, documento_grupos, expedientes RESTART IDENTITY CASCADE');
  console.log('🧹 Tablas limpiadas');

  // Crear expediente
  const expediente = dataSource.getRepository(Expediente).create({
    numero_expediente: 'EXP-2024-001',
    titulo: 'Demanda por incumplimiento contractual — Constructora Andina S.A.',
    cliente: 'Inversiones del Norte Ltda.',
    abogado_responsable: 'Dr. Carlos Mendoza Ríos',
    estado: EstadoExpediente.ACTIVO,
    juzgado: 'Juzgado 4° Civil del Circuito de Medellín',
    tipo_proceso: 'Proceso Ordinario Civil',
    descripcion:
      'Demanda interpuesta por incumplimiento de contrato de obra civil suscrito el 15 de marzo de 2023. El contratista no entregó la obra en los términos pactados generando perjuicios económicos al cliente.',
  });

  const expedienteGuardado = await dataSource
    .getRepository(Expediente)
    .save(expediente);
  console.log('✅ Expediente creado:', expedienteGuardado.numero_expediente);

  // Grupo 1
  const grupo1 = dataSource.getRepository(DocumentoGrupo).create({
    titulo: 'Documentos de inicio del proceso',
    descripcion:
      'Demanda inicial, poder notarial y documentos de identificación del demandante.',
    expediente_id: expedienteGuardado.id,
  });
  const grupo1Guardado = await dataSource
    .getRepository(DocumentoGrupo)
    .save(grupo1);

  await dataSource.getRepository(Archivo).save([
    {
      nombre_original: 'demanda_inicial.pdf',
      nombre_almacenado: 'demanda_inicial_2024.pdf',
      mime_type: 'application/pdf',
      tamanio: 245760,
      url: '/uploads/demanda_inicial_2024.pdf',
      grupo_id: grupo1Guardado.id,
    },
    {
      nombre_original: 'poder_notarial.pdf',
      nombre_almacenado: 'poder_notarial_2024.pdf',
      mime_type: 'application/pdf',
      tamanio: 102400,
      url: '/uploads/poder_notarial_2024.pdf',
      grupo_id: grupo1Guardado.id,
    },
  ]);
  console.log('✅ Grupo 1 creado con archivos');

  // Grupo 2
  const grupo2 = dataSource.getRepository(DocumentoGrupo).create({
    titulo: 'Pruebas documentales',
    descripcion:
      'Contrato original de obra civil, actas de entrega parcial y comunicaciones entre las partes.',
    expediente_id: expedienteGuardado.id,
  });
  const grupo2Guardado = await dataSource
    .getRepository(DocumentoGrupo)
    .save(grupo2);

  await dataSource.getRepository(Archivo).save([
    {
      nombre_original: 'contrato_obra_civil.pdf',
      nombre_almacenado: 'contrato_obra_civil_2024.pdf',
      mime_type: 'application/pdf',
      tamanio: 512000,
      url: '/uploads/contrato_obra_civil_2024.pdf',
      grupo_id: grupo2Guardado.id,
    },
    {
      nombre_original: 'acta_entrega_parcial.docx',
      nombre_almacenado: 'acta_entrega_parcial_2024.docx',
      mime_type:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      tamanio: 89600,
      url: '/uploads/acta_entrega_parcial_2024.docx',
      grupo_id: grupo2Guardado.id,
    },
    {
      nombre_original: 'comunicaciones_partes.pdf',
      nombre_almacenado: 'comunicaciones_partes_2024.pdf',
      mime_type: 'application/pdf',
      tamanio: 178200,
      url: '/uploads/comunicaciones_partes_2024.pdf',
      grupo_id: grupo2Guardado.id,
    },
  ]);
  console.log('✅ Grupo 2 creado con archivos');

  // Grupo 3
  const grupo3 = dataSource.getRepository(DocumentoGrupo).create({
    titulo: 'Peritajes y dictámenes técnicos',
    descripcion:
      'Informe pericial de interventoría y dictamen técnico sobre el estado de la obra al momento de la demanda.',
    expediente_id: expedienteGuardado.id,
  });
  const grupo3Guardado = await dataSource
    .getRepository(DocumentoGrupo)
    .save(grupo3);

  await dataSource.getRepository(Archivo).save([
    {
      nombre_original: 'informe_pericial.pdf',
      nombre_almacenado: 'informe_pericial_2024.pdf',
      mime_type: 'application/pdf',
      tamanio: 1048576,
      url: '/uploads/informe_pericial_2024.pdf',
      grupo_id: grupo3Guardado.id,
    },
    {
      nombre_original: 'dictamen_tecnico.pdf',
      nombre_almacenado: 'dictamen_tecnico_2024.pdf',
      mime_type: 'application/pdf',
      tamanio: 768000,
      url: '/uploads/dictamen_tecnico_2024.pdf',
      grupo_id: grupo3Guardado.id,
    },
  ]);
  console.log('✅ Grupo 3 creado con archivos');

  console.log('🎉 Seed completado exitosamente');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
