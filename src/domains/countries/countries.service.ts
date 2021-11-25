import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgs } from '../../common/dto/listArgs';
import { makeList } from '../../common/services/makeList';
import { CreateCountryDto, CountryDBModel } from './models/countries.model.DB';
import { CountriesGraphQLListModel } from './models/countries.model.GraphQL';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(CountryDBModel)
    private readonly countryModel: ModelType<CountryDBModel>,
  ) {}

  async create(data: CreateCountryDto): Promise<DocumentType<CountryDBModel>> {
    return await this.countryModel.create(data);
  }

  async countriesList(listArgs: ListArgs): Promise<CountriesGraphQLListModel> {
    const mainList = await makeList<CountryDBModel>(
      this.countryModel,
      listArgs,
    );

    console.log(+new Date(), '-(SERVICE)->', `-mainList->`, mainList);

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
