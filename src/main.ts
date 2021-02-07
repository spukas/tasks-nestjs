import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app.module';

interface IServerConfig {
    port: number;
}

async function bootstrap() {
    const serverConfig: IServerConfig = config.get('server');
    const logger = new Logger('bootstrap');
    const app = await NestFactory.create(AppModule);

    const PORT = process.env.PORT || serverConfig.port;
    await app.listen(PORT);
    logger.log(`Server started on port ${PORT}`);
}
bootstrap();
