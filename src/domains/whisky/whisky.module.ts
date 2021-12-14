// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
//Main
import { getDbModule } from '../dbModule';
//Domains
import { CountriesService } from '../countries/countries.service';
import { DistilleriesService } from '../distilleries/distilleries.service';
import { RegionsService } from '../regions/regions.service';
//Local
import { WhiskyResolver } from './whisky.resolver';
import { WhiskyService } from './whisky.service';

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
    RegionsService,
    WhiskyResolver,
    WhiskyService,
  ],
})
export class WhiskyModule {}
