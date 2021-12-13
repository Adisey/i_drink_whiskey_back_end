// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
//Domains
import { RegionsService } from '../regions/regions.service';
import { RegionDBModel } from '../regions/models/regions.model.DB';
import { CountryDBModel } from '../countries/models/countries.model.DB';
import { CountriesService } from '../countries/countries.service';
import { WhiskyService } from '../whisky/whisky.service';
import { WhiskyDBModel } from '../whisky/models/whisky.model.DB';
//Local
import { DistilleryDBModel } from './models/distilleries.model.DB';
import { DistilleriesService } from './distilleries.service';
import { DistilleriesResolver } from './distilleries.resolver';

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
        typegooseClass: WhiskyDBModel,
        schemaOptions: {
          collection: 'Whisky',
        },
      },
    ]),
  ],
  providers: [
    DistilleriesService,
    DistilleriesResolver,
    RegionsService,
    CountriesService,
    WhiskyService,
  ],
})
export class DistilleriesModule {}
