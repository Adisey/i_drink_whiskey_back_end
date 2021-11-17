import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgsOLD } from 'src/common/dto/listArgs';
import {
  CreateCountryDto,
  CountryDBModel,
} from 'src/domains/countries/models/countries.model.DB';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(CountryDBModel)
    private readonly countryModel: ModelType<CountryDBModel>,
  ) {}

  async create(data: CreateCountryDto): Promise<DocumentType<CountryDBModel>> {
    return await this.countryModel.create(data);
  }

  async findAll(
    listArgs: ListArgsOLD,
  ): Promise<DocumentType<CountryDBModel>[]> {
    // ToDo: 14.10.2021 - Add pagination
    return await this.countryModel.find().exec();
  }
}
