import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgs } from '../../common/dto/listArgs';
import { makeList } from '../../common/services/makeList';
import { CountryDBModel } from './models/countries.model.DB';
import {
  CountriesGraphQLListModel,
  NewCountryInput,
} from './models/countries.model.GraphQL';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(CountryDBModel)
    private readonly countryModel: ModelType<CountryDBModel>,
  ) {}

  async addCountry(
    data: NewCountryInput,
  ): Promise<DocumentType<CountryDBModel>> {
    return await this.countryModel.create(data);
  }

  async findCountryByName(name: string): Promise<DocumentType<CountryDBModel>> {
    return await this.countryModel.findOne({ name }).exec();
  }

  async findCountryById(id: string): Promise<CountryDBModel> {
    return await this.countryModel.findById(id).exec();
  }

  async findCountryNameById(id: string): Promise<string> {
    return (await this.countryModel.findById(id).exec()).name;
  }

  async countriesList(listArgs: ListArgs): Promise<CountriesGraphQLListModel> {
    const mainList = await makeList<CountryDBModel>(
      this.countryModel,
      listArgs,
    );

    return {
      list: mainList.list.map((c: CountryDBModel) => ({
        _id: c._id.toString(),
        name: c.name,
        description: c.description,
      })),
      totalCount: mainList.totalCount,
    };
  }
}
