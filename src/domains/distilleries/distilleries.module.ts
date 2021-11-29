// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { DistilleryDBModel } from './models/distilleries.model.DB';
import { DistilleriesService } from './distilleries.service';
import { DistilleriesResolver } from './distilleries.resolver';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: DistilleryDBModel,
        schemaOptions: {
          collection: 'Countries',
        },
      },
    ]),
  ],
  providers: [DistilleriesService, DistilleriesResolver],
})
export class DistilleriesModule {}
