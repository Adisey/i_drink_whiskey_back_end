import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgs } from '../../global/dto/list.args';
import { CreateCountryDto, CountryDBModel } from './models/country.model.DB';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(CountryDBModel)
    private readonly countryModel: ModelType<CountryDBModel>,
  ) {}

  async create(data: CreateCountryDto): Promise<DocumentType<CountryDBModel>> {
    return await this.countryModel.create(data);
  }

  async findAll(listArgs: ListArgs): Promise<DocumentType<CountryDBModel>[]> {
    // ToDo: 14.10.2021 - Add pagination
    return await this.countryModel.find().exec();
  }
}
