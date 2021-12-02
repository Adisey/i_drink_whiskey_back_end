import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { mongoose } from '@typegoose/typegoose';

import { emitGraphQLError } from '../../apolloError';
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

  async findByName(name: string): Promise<DocumentType<CountryDBModel>> {
    return await this.countryModel.findOne({ name }).exec();
  }

  async findById(id: string): Promise<CountryDBModel> {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await this.countryModel.findById(id).exec();
    }
  }

  async findNameById(id: string): Promise<string> {
    return (await this.findById(id)).name;
  }

  async getItem(itemId: string): Promise<CountryGraphQLModel> {
    const found = await this.findById(itemId);
    const { id, name, description } = found;
    return { id, name, description };
  }

  async create(data: NewCountryInput): Promise<CountryDBModel> {
    return await this.countryModel.create(data);
  }

  async add(data: NewCountryInput): Promise<CountryGraphQLModel> {
    const foundCountry = await this.findByName(data.name);

    if (foundCountry) {
      throw emitGraphQLError('NAME_DUPLICATE', 'addRegion', data.name);
    }

    const newCountry = await this.create(data);

    return await this.getItem(newCountry.id);
  }

  asChild(data: CountryDBModel): ICountryAsChild {
    return { countryId: data?.id, country: data?.name };
  }

  async addAsChild(data: ICountryAsChild): Promise<ICountryAsChild> {
    if (!data.countryId && !data.country) {
      return data;
    }

    if (data.countryId) {
      const found = await this.findById(data.countryId);
      if (found) {
        return this.asChild(found);
      }
    }
    if (data.country) {
      const found = await this.findByName(data.country);
      if (found) {
        return this.asChild(found);
      } else {
        const created = await this.create({ name: data.country });
        if (created) {
          return this.asChild(created);
        }
      }
    }
    return {};
  }

  async list(listArgs: ListArgs): Promise<CountriesGraphQLListModel> {
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
