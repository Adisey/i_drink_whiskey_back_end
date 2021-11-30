// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { RegionsService } from '../regions/regions.service';
import { DistilleryDBModel } from './models/distilleries.model.DB';
import { DistilleriesService } from './distilleries.service';
import { DistilleriesResolver } from './distilleries.resolver';
import { RegionDBModel } from 'src/domains/regions/models/regions.model.DB';
import { CountryDBModel } from 'src/domains/countries/models/countries.model.DB';
import { CountriesService } from 'src/domains/countries/countries.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: DistilleryDBModel,
        schemaOptions: {
          collection: 'Distilleries',
        },
      },
      {
        typegooseClass: RegionDBModel,
        schemaOptions: {
          collection: 'Regions',
        },
      },
      {
        typegooseClass: CountryDBModel,
        schemaOptions: {
          collection: 'Countries',
        },
      },
    ]),
  ],
  providers: [
    DistilleriesService,
    DistilleriesResolver,
    RegionsService,
    CountriesService,
  ],
})
export class DistilleriesModule {}
