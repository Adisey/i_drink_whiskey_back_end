// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
//Main
import { getDbModule } from '../dbModule';
//Domains
import { RegionsService } from '../regions/regions.service';
//Local
import { CountriesResolver } from './countries.resolver';
import { CountriesService } from './countries.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      getDbModule('Countries'),
      getDbModule('Regions'),
    ]),
  ],
  providers: [CountriesService, CountriesResolver, RegionsService],
})
export class CountriesModule {}
