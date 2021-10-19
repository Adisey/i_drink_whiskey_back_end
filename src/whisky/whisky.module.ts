// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { WhiskyResolver } from './whisky.resolver';
import { WhiskyService } from './whisky.service';
import { WhiskyDBModel } from './models/whisky.model.DB';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: WhiskyDBModel,
        schemaOptions: {
          collection: 'Whisky',
        },
      },
    ]),
  ],
  providers: [WhiskyService, WhiskyResolver],
})
export class WhiskyModule {}
