// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CountryResolver } from './country.resolver';
import { CountryService } from './country.service';
import { CountryDBModel } from './models/country.model.DB';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: CountryDBModel,
        schemaOptions: {
          collection: 'Country',
        },
      },
    ]),
  ],
  providers: [CountryService, CountryResolver],
})
export class CountryModule {}
