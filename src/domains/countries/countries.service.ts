import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { mongoose } from '@typegoose/typegoose';

import { emitGraphQLError } from '../../apolloError';
import { db2GQL } from '../../common/services';
import { ListArgs } from '../../common/dto/listArgs';
import { makeList } from '../../common/services/makeList';
import { CountryDBModel } from './models/countries.model.DB';
import {
  CountriesGraphQLListModel,
  CountryGraphQLModel,
  ICountryAsChild,
  NewCountryInput,
} from './models/countries.model.GraphQL';

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
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await this.countryModel.findById(id).exec();
    }
  }

  async findCountryNameById(id: string): Promise<string> {
    return (await this.findCountryById(id)).name;
  }

  async createCountry(data: NewCountryInput): Promise<CountryDBModel> {
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

  asChild(data: CountryDBModel): ICountryAsChild {
    return { countryId: data.id, country: data.name };
  }

  async addAsChild(data: ICountryAsChild): Promise<ICountryAsChild> {
    console.log(+new Date(), `--(addAsCild)-  ->`, data);
    if (!data.countryId && !data.country) {
      return data;
    }

    if (data.countryId) {
      const found = await this.findCountryById(data.countryId);
      if (found) {
        return this.asChild(found);
      }
    }
    if (data.country) {
      const found = await this.findCountryByName(data.country);
      if (found) {
        return this.asChild(found);
      } else {
        const created = await this.createCountry({ name: data.country });
        if (created) {
          return this.asChild(created);
        }
      }
    }
    return {};
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
