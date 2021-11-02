// Core
import { Module } from '@nestjs/common';
import { ConfigModule as MainConfigModule } from '@nestjs/config';
import { ShutdownService } from '../shutdown/shutdown.service';
import { ConfigService } from './app.config.service';

@Module({
  providers: [ConfigService, ShutdownService],
})
export class AppConfigModule extends MainConfigModule {}
