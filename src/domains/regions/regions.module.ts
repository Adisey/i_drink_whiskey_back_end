// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CountriesService } from '../countries/countries.service';
import { CountryDBModel } from '../countries/models/countries.model.DB';
import { RegionDBModel } from './models/regions.model.DB';
import { RegionsService } from './regions.service';
import { RegionsResolver } from './regions.resolver';

@Module({
  imports: [
    TypegooseModule.forFeature([
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
  providers: [RegionsService, RegionsResolver, CountriesService],
})
export class RegionsModule {}
