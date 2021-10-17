import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function main() {
  const backPort = process.env.BACK_PORT || '4000';
  const app = await NestFactory.create(AppModule);
  await app.listen(backPort);
  console.log(+new Date(), 'listen port:', backPort);
}

main();
