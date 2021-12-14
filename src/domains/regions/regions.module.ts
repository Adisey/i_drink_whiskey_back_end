// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
//Domains
import { CountriesService } from '../countries/countries.service';
import { CountryDBModel } from '../countries/models/countries.model.DB';
import { DistilleriesService } from '../distilleries/distilleries.service';
import { DistilleryDBModel } from '../distilleries/models/distilleries.model.DB';
//Local
import { RegionDBModel } from './models/regions.model.DB';
import { RegionsService } from './regions.service';
import { RegionsResolver } from './regions.resolver';

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
    CountriesService,
    DistilleriesService,
    RegionsResolver,
    RegionsService,
  ],
})
export class RegionsModule {}
