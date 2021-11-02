import { Module } from '@nestjs/common';

import { ConfigService } from '../../configs/app.config.service';
import { FilesService } from './files.service';
import { FilesResolver } from './files.resolver';

@Module({
  providers: [FilesService, FilesResolver, ConfigService],
})
export class FilesModule {}
