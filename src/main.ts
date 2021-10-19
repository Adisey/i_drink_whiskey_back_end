import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function main() {
  const app = await NestFactory.create(AppModule);

  dotenv.config();

  const backPort = process.env.BACK_PORT || '4000';

  await app.listen(backPort);

  console.log(+new Date(), 'Server listen port:', backPort);
}

main();
