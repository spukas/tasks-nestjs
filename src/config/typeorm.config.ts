import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get<string>('DB_HOST', 'localhost'),
            port: this.configService.get<number>('DB_PORT', 5432),
            username: this.configService.get<string>('DB_USERNAME', 'postgres'),
            password: this.configService.get<string>('DB_PASSWORD', 'postgres'),
            database: this.configService.get<string>('DB_DATABASE', 'tasks'),
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            synchronize: true,
        };
    }
}
