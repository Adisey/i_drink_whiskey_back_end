import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgs } from '../../common/dto/listArgs';
import { makeList } from '../../common/services/makeList';
import { CountriesService } from '../countries/countries.service';
import { CountryDBModel } from '../countries/models/countries.model.DB';
import { RegionDBModel } from './models/regions.model.DB';
import {
  NewRegionInput,
  RegionGraphQLModel,
  RegionsGraphQLListModel,
} from './models/regions.model.GraphQL';
import { emitGraphQLError } from 'src/apolloError';
import { mongoose } from '@typegoose/typegoose';

@Injectable()
export class RegionsService {
  constructor(
    @InjectModel(RegionDBModel)
    @InjectModel(CountryDBModel)
    private readonly regionsModel: ModelType<RegionDBModel>,
    private readonly countriesService: CountriesService,
  ) {}

  async findByName(name: string): Promise<DocumentType<RegionDBModel>> {
    return await this.regionsModel.findOne({ name }).exec();
  }

  async findById(id: string): Promise<DocumentType<RegionDBModel>> {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await this.regionsModel.findById(id).exec();
    }
  }

  async create(data: NewRegionInput): Promise<RegionDBModel> {
    return await this.regionsModel.create(data);
  }

  async add(data: NewRegionInput): Promise<RegionGraphQLModel> {
    const foundRegion = await this.findByName(data.name);

    if (foundRegion) {
      throw emitGraphQLError('NAME_DUPLICATE', 'addRegion', data.name);
    }

    const foundCountry = await this.countriesService.addAsChild(data);

    const region = await this.create({
      ...data,
      countryId: foundCountry.countryId,
    });

    return {
      id: region.id,
      name: region.name,
      description: region.description,
      ...foundCountry,
    };
  }

  async list(listArgs: ListArgs): Promise<RegionsGraphQLListModel> {
    const mainList = await makeList<RegionDBModel>(this.regionsModel, listArgs);

    const findName = async (id: string): Promise<string> => {
      return await this.countriesService.findNameById(id);
    };

    const outList: Promise<Array<RegionGraphQLModel>> = Promise.all(
      mainList.list.map(async (c: RegionDBModel) => {
        return {
          id: c.id,
          name: c.name,
          description: c.description,
          countryId: c.countryId,
          country: c.countryId ? await findName(c.countryId) : '',
        };
      }),
    );
    return {
      list: await outList,
      totalCount: mainList.totalCount,
    };
  }
}
