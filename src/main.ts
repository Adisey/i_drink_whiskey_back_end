import { NestFactory, Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ShutdownService } from 'src/shutdown/shutdown.service';
import { JwtAuthGuard } from 'src/domains/auth/guards';
import { MongoErrorFilter } from 'src/common/services/mongo-error.filter';

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  function shutdown() {
    Logger.warn(`--(App)- AFTER 5 sec->`, 'SHUTDOWN');
    setTimeout(() => {
      Logger.warn(`--(App)-CLOSE->`, 'SHUTDOWN');
      app.close();
    }, 5000);
  }

  dotenv.config();

  app.useGlobalFilters(new MongoErrorFilter());
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.enableShutdownHooks();

  const backPort = process.env.BACK_PORT || '4000';
  await app.listen(backPort, () => {
    Logger.log('Server started', 'Server listen port:' + backPort, 'Server');
  });
  app.get(ShutdownService).subscribeToShutdown(() => app.close());
  app.get(ShutdownService).addClose(() => shutdown());
}

main();
