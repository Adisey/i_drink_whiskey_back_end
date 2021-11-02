import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ShutdownService } from 'src/shutdown/shutdown.service';

async function main() {
  const app = await NestFactory.create(AppModule);

  function shutdown() {
    console.log(+new Date(), `--(SHUTDOWN)- AFTER 5 sec->`);
    setTimeout(() => {
      console.log(+new Date(), `--(SHUTDOWN)-CLOSE->`);
      app.close();
    }, 5000);
  }

  dotenv.config();

  const backPort = process.env.BACK_PORT || '4000';
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  app.enableShutdownHooks();
  await app.listen(backPort);
  app.get(ShutdownService).subscribeToShutdown(() => app.close());
  app.get(ShutdownService).addClose(() => shutdown());

  console.log(+new Date(), 'Server listen port:', backPort);
}

main();
