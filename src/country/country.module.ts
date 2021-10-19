// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CountryResolver } from 'src/country/country.resolver';
import { CountryService } from 'src/country/country.service';
import { CountryDBModel } from 'src/country/models/country.model.DB';

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
