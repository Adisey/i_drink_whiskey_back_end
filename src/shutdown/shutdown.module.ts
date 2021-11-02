// Core
import { Module } from '@nestjs/common';
import { ShutdownService } from 'src/shutdown/shutdown.service';

@Module({
  providers: [ShutdownService],
})
export class ShutdownModule {}
