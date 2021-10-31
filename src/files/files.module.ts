import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesResolver } from './files.resolver';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from 'src/configs/app.config.service';

@Module({
  providers: [FilesService, FilesResolver, ConfigService, AppConfigService],
})
export class FilesModule {}
