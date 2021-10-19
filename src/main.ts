import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// ToDo: 19.10.2021 - Remove this
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const backPort = process.env.BACK_PORT || '4000';
  const app = await NestFactory.create(AppModule);
  await app.listen(backPort);
  const aa = process.env;
  console.log(+new Date(), '-(MAIN)->', typeof aa, `-aa->`, aa);
  console.log(+new Date(), 'Server listen port:', backPort);
}

main();
