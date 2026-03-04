import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Expediente } from '../expedientes/expediente.entity';
import { DocumentoGrupo } from '../documentos/documento-grupo.entity';
import { Archivo } from '../documentos/archivo.entity';
import { ExpedientesModule } from '../expedientes/expedientes.module';
import { DocumentosModule } from '../documentos/documentos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
				const databaseUrl = config.get<string>('DATABASE_URL');

				if (databaseUrl) {
					return {
						type: 'postgres' as const,
						url: databaseUrl,
						entities: [Expediente, DocumentoGrupo, Archivo],
						synchronize: false, // producción segura
						logging: false,
						ssl: { rejectUnauthorized: false },
					};
				}

				return {
					type: 'postgres' as const,
					host:     config.get<string>('DATABASE_HOST'),
					port:     config.get<number>('DATABASE_PORT'),
					username: config.get<string>('DATABASE_USER'),
					password: config.get<string>('DATABASE_PASSWORD'),
					database: config.get<string>('DATABASE_NAME'),
					entities: [Expediente, DocumentoGrupo, Archivo],
					synchronize: config.get<string>('NODE_ENV') !== 'production',
					logging:     config.get<string>('NODE_ENV') === 'development',
				};
			},
      inject: [ConfigService],
    }),
    ExpedientesModule,
    DocumentosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
