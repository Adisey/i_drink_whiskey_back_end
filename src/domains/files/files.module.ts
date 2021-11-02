import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { ConfigService } from '../../configs/app.config.service';
import { FilesService } from './files.service';
import { FilesResolver } from './files.resolver';
import { FilesDBModel } from './models/files.model.DB';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: FilesDBModel,
        schemaOptions: {
          collection: 'Files',
        },
      },
    ]),
  ],
  providers: [FilesService, FilesResolver, ConfigService],
})
export class FilesModule {}
