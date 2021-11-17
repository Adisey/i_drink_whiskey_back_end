import { NestFactory, Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import { ShutdownService } from 'src/shutdown/shutdown.service';
import { JwtAuthGuard } from 'src/domains/auth/guards';
import { MongoErrorFilter } from 'src/common/services/mongo-error.filter';
import * as mongoose from 'mongoose';
import { isTrue } from 'src/common/services/isTrue';
import { ConfigService } from 'src/configs/app.config.service';

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  function shutdown() {
    Logger.warn(`--(App)- AFTER 5 sec->`, 'SHUTDOWN');
    setTimeout(() => {
      Logger.warn(`--(App)-CLOSE->`, 'SHUTDOWN');
      app.close();
    }, 5000);
  }

  // app.useGlobalPipes(new ValidationPipe()); // ToDo: 17.11.2021 - Fix for uploadPicture
  app.useGlobalFilters(new MongoErrorFilter());
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.enableShutdownHooks();

  if (isTrue(configService.get<string>('IS_DEBUG_MODE'))) {
    const mongooseLogger = (collectionName, methodName, ...methodArgs) => {
      Logger.log(
        `${collectionName}.${methodName}(${methodArgs
          .map((a) => JSON.stringify(a))
          .join(', ')})`,
        'Mongoose',
      );
    };

    mongoose.set('debug', mongooseLogger);
  }

  const backPort = configService.get<number>('BACK_PORT');

  await app.listen(backPort, () => {
    Logger.log('Server started', 'Server listen port:' + backPort, 'Server');
  });
  app.get(ShutdownService).subscribeToShutdown(() => app.close());
  app.get(ShutdownService).addClose(() => shutdown());
}

main();
