// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
//Domains
import { RegionsService } from '../regions/regions.service';
import { RegionDBModel } from '../regions/models/regions.model.DB';
//Local
import { CountriesResolver } from './countries.resolver';
import { CountriesService } from './countries.service';
import { CountryDBModel } from './models/countries.model.DB';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: CountryDBModel,
        schemaOptions: {
          collection: 'Countries',
        },
      },
      {
        typegooseClass: RegionDBModel,
        schemaOptions: {
          collection: 'Regions',
        },
      },
    ]),
  ],
  providers: [CountriesService, CountriesResolver, RegionsService],
})
export class CountriesModule {}
