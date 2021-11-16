// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CountriesResolver } from 'src/domains/countries/countries.resolver';
import { CountriesService } from 'src/domains/countries/countries.service';
import { CountryDBModel } from 'src/domains/countries/models/countries.model.DB';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: CountryDBModel,
        schemaOptions: {
          collection: 'Countries',
        },
      },
    ]),
  ],
  providers: [CountriesService, CountriesResolver],
})
export class CountriesModule {}
