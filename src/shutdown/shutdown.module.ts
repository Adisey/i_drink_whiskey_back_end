// Core
import { Module } from '@nestjs/common';
import { ShutdownService } from './shutdown.service';

@Module({
  providers: [ShutdownService],
})
export class ShutdownModule {}
