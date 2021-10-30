import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesResolver } from './files.resolver';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [FilesService, FilesResolver, ConfigService],
})
export class FilesModule {}
