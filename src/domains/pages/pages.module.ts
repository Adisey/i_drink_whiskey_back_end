// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CountriesService } from '../countries/countries.service';
import { CountryDBModel } from '../countries/models/countries.model.DB';
import { DistilleriesService } from '../distilleries/distilleries.service';
import { DistilleryDBModel } from '../distilleries/models/distilleries.model.DB';
import { RegionDBModel } from '../regions/models/regions.model.DB';
import { RegionsService } from '../regions/regions.service';
import { WhiskyResolver } from '../whisky/whisky.resolver';
import { WhiskyService } from '../whisky/whisky.service';
import { WhiskyDBModel } from '../whisky/models/whisky.model.DB';
import { PagesResolver } from './pages.resolver';
import { PagesService } from './pages.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: WhiskyDBModel,
        schemaOptions: {
          collection: 'Whisky',
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
    PagesResolver,
    PagesService,
    RegionsService,
    WhiskyResolver,
    WhiskyService,
  ],
})
export class PagesModule {}
