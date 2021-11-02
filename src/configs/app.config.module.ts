// Core
import { Module } from '@nestjs/common';
import { ConfigService } from './app.config.service';
import { ShutdownService } from 'src/shutdown/shutdown.service';
import { ConfigModule as MainConfigModule } from '@nestjs/config';

@Module({
  providers: [ConfigService, ShutdownService],
})
export class AppConfigModule extends MainConfigModule {}
