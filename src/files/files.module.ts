import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesResolver } from './files.resolver';
import { AppConfigService } from 'src/configs/app.config.service';

@Module({
  providers: [FilesService, FilesResolver, AppConfigService],
})
export class FilesModule {}
