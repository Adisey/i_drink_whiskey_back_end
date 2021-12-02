import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { mongoose } from '@typegoose/typegoose';

import { ListArgs } from '../../common/dto/listArgs';
import { makeList } from '../../common/services/makeList';
import { emitGraphQLError } from '../../apolloError';
import { CountriesService } from '../countries/countries.service';
import { CountryDBModel } from '../countries/models/countries.model.DB';
import { RegionDBModel } from './models/regions.model.DB';
import {
  IRegionAsChild,
  NewRegionInput,
  RegionGraphQLModel,
  RegionsGraphQLListModel,
} from './models/regions.model.GraphQL';

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

  async getItem(itemId: string): Promise<RegionGraphQLModel> {
    const found = await this.findById(itemId);
    const { id, name, description, countryId } = found;
    const parent = countryId
      ? await this.countriesService.getItem(countryId)
      : { name: undefined };
    return {
      ...parent,
      countryId,
      country: parent?.name,
      id,
      name,
      description,
    };
  }

  async create(data: NewRegionInput): Promise<RegionDBModel> {
    return await this.regionsModel.create(data);
  }

  async add(data: NewRegionInput): Promise<RegionGraphQLModel> {
    const foundRegion = await this.findByName(data.name);

    if (foundRegion) {
      throw emitGraphQLError('NAME_DUPLICATE', 'addRegion', data.name);
    }

    const { countryId, country } = data;

    const foundCountry = await this.countriesService.addAsChild({
      countryId,
      country,
    });

    const newRegion = await this.create({
      ...data,
      countryId: foundCountry.countryId,
    });

    return await this.getItem(newRegion.id);
  }

  asChild(data: RegionDBModel): IRegionAsChild {
    return { regionId: data?.id, region: data?.name };
  }

  async addAsChild(data: IRegionAsChild): Promise<IRegionAsChild> {
    let region: IRegionAsChild = {};
    const { countryId, country } = data;
    const foundCountry = await this.countriesService.addAsChild({
      countryId,
      country,
    });

    if (data.regionId) {
      const found = await this.findById(data.regionId);
      if (found) {
        region = { ...region, ...this.asChild(found) };
      }
    }
    if (!region.region && data.region) {
      const found = await this.findByName(data.region);
      if (found) {
        region = { ...region, ...this.asChild(found) };
      } else {
        const created = await this.create({
          name: data.region,
          ...foundCountry,
        });
        if (created) {
          region = { ...region, ...this.asChild(created) };
        }
      }
    }

    return { ...foundCountry, ...region };
  }

  async listAll(): Promise<RegionDBModel[]> {
    return await this.regionsModel.find().exec();
  }

  async listByCountry(countryId: string): Promise<RegionDBModel[]> {
    return await this.regionsModel.find({ countryId }).exec();
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
