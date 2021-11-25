import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

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

@Injectable()
export class RegionsService {
  constructor(
    @InjectModel(RegionDBModel)
    @InjectModel(CountryDBModel)
    private readonly regionsModel: ModelType<RegionDBModel>,
    private readonly countriesService: CountriesService,
  ) {}

  async addRegion(data: NewRegionInput): Promise<RegionGraphQLModel> {
    const { country, countryId } = data;

    let fondCountryName = '',
      fondCountryId = '';

    if (countryId) {
      const foundCountry = await this.countriesService.findCountryById(
        countryId,
      );
      if (foundCountry) {
        fondCountryName = foundCountry.name;
        fondCountryId = foundCountry._id.toString();
      }
    }
    if (!fondCountryName && country) {
      const foundCountry = await this.countriesService.findCountryByName(
        country,
      );
      if (foundCountry) {
        fondCountryName = foundCountry.name;
        fondCountryId = foundCountry._id.toString();
      }
    }

    if (!fondCountryName) {
      const newCountry = await this.countriesService.addCountry({
        name: country,
      });
      if (newCountry) {
        fondCountryName = newCountry.name;
        fondCountryId = newCountry._id.toString();
      }
    }

    const region = await this.regionsModel.create({
      ...data,
      countryId: fondCountryId,
    });
    return {
      _id: region._id.toString(),
      name: region.name,
      description: region.description,
      countryId: region.countryId,
      country: fondCountryName,
    };
  }

  async regionList(listArgs: ListArgs): Promise<RegionsGraphQLListModel> {
    const mainList = await makeList<RegionDBModel>(this.regionsModel, listArgs);

    const findName = async (id: string): Promise<string> => {
      return await this.countriesService.findCountryNameById(id);
    };

    const outList: Promise<Array<RegionGraphQLModel>> = Promise.all(
      mainList.list.map(async (c: RegionDBModel) => {
        return {
          _id: c._id.toString(),
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
