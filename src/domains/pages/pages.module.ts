// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
//Main
import { getDbModule } from '../dbModule';
//Domains
import { CountriesService } from '../countries/countries.service';
import { DistilleriesService } from '../distilleries/distilleries.service';
import { RegionsService } from '../regions/regions.service';
import { WhiskyResolver } from '../whisky/whisky.resolver';
import { WhiskyService } from '../whisky/whisky.service';
//Local
import { PagesResolver } from './pages.resolver';
import { PagesService } from './pages.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      getDbModule('Countries'),
      getDbModule('Distilleries'),
      getDbModule('Regions'),
      getDbModule('Whisky'),
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
