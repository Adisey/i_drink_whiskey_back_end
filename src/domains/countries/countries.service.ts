import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgs } from '../../common/dto/listArgs';
import { makeList } from '../../common/services/makeList';
import { CountryDBModel } from './models/countries.model.DB';
import {
  CountriesGraphQLListModel,
  CountryGraphQLModel,
  NewCountryInput,
} from './models/countries.model.GraphQL';
import { emitGraphQLError } from 'src/apolloError';
import { db2GQL } from 'src/common/services';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(CountryDBModel)
    private readonly countryModel: ModelType<CountryDBModel>,
  ) {}

  async findCountryByName(name: string): Promise<DocumentType<CountryDBModel>> {
    return await this.countryModel.findOne({ name }).exec();
  }

  async findCountryById(id: string): Promise<CountryDBModel> {
    return await this.countryModel.findById(id).exec();
  }

  async findCountryNameById(id: string): Promise<string> {
    return (await this.countryModel.findById(id).exec()).name;
  }

  async createCountry(
    data: NewCountryInput,
  ): Promise<DocumentType<CountryDBModel>> {
    return await this.countryModel.create(data);
  }

  async addCountry(data: NewCountryInput): Promise<CountryGraphQLModel> {
    const foundCountry = await this.findCountryByName(data.name);

    if (foundCountry) {
      throw emitGraphQLError('NAME_DUPLICATE', 'addRegion', data.name);
    }

    const newCompany = await this.createCountry(data);

    return db2GQL(newCompany);
  }

  async addAsChild(data: CountryDBModel): Promise<CountryDBModel> {
    // if (!data.id)

    return data;
  }

  async countriesList(listArgs: ListArgs): Promise<CountriesGraphQLListModel> {
    const mainList = await makeList<CountryDBModel>(
      this.countryModel,
      listArgs,
    );

    return {
      list: mainList.list.map((c: CountryDBModel) => ({
        id: c.id,
        name: c.name,
        description: c.description,
      })),
      totalCount: mainList.totalCount,
    };
  }
}
