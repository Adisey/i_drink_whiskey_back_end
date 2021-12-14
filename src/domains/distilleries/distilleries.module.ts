// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
//Domains
import { RegionsService } from '../regions/regions.service';
import { CountriesService } from '../countries/countries.service';
import { WhiskyService } from '../whisky/whisky.service';
//Local
import { DistilleriesService } from './distilleries.service';
import { DistilleriesResolver } from './distilleries.resolver';
import { getDbModule } from 'src/domains/dbModule';

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
    DistilleriesService,
    DistilleriesResolver,
    RegionsService,
    CountriesService,
    WhiskyService,
  ],
})
export class DistilleriesModule {}
