// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
//Main
import { getDbModule } from '../dbModule';
//Domains
import { CountriesService } from '../countries/countries.service';
import { DistilleriesService } from '../distilleries/distilleries.service';
//Local
import { RegionsService } from './regions.service';
import { RegionsResolver } from './regions.resolver';

@Module({
  imports: [
    TypegooseModule.forFeature([
      getDbModule('Countries'),
      getDbModule('Distilleries'),
      getDbModule('Regions'),
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
