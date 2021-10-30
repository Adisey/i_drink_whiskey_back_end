import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function main() {
  const app = await NestFactory.create(AppModule);

  dotenv.config();

  const backPort = process.env.BACK_PORT || '4000';
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  await app.listen(backPort);

  console.log(+new Date(), 'Server listen port:', backPort);
}

main();
