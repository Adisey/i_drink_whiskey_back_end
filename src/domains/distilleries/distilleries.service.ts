import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgs } from '../../common/dto/listArgs';
import { makeList } from '../../common/services/makeList';
import { emitGraphQLError } from '../../apolloError';
import { DistilleryDBModel } from './models/distilleries.model.DB';
import {
  NewDistilleryInput,
  DistilleriesGraphQLListModel,
  DistilleryGraphQLModel,
  IDistilleryAsChild,
} from './models/distilleries.model.GraphQL';
import { RegionDBModel } from '../regions/models/regions.model.DB';
import { RegionsService } from '../regions/regions.service';
import { mongoose } from '@typegoose/typegoose';

@Injectable()
export class DistilleriesService {
  constructor(
    @InjectModel(DistilleryDBModel)
    @InjectModel(RegionDBModel)
    private readonly distilleryModel: ModelType<DistilleryDBModel>,
    private readonly regionsService: RegionsService,
  ) {}

  async findByName(name: string): Promise<DocumentType<DistilleryDBModel>> {
    return await this.distilleryModel.findOne({ name }).exec();
  }

  async findById(id: string): Promise<DistilleryDBModel> {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await this.distilleryModel.findById(id).exec();
    }
  }

  async findNameById(id: string): Promise<string> {
    return (await this.findById(id)).name;
  }

  async getItem(itemId: string): Promise<DistilleryGraphQLModel> {
    const found = await this.findById(itemId);
    const { id, name, description, regionId } = found;
    const parent = regionId
      ? await this.regionsService.getItem(regionId)
      : { name: undefined };
    return { ...parent, regionId, region: parent?.name, id, name, description };
  }

  async create(data: NewDistilleryInput): Promise<DistilleryDBModel> {
    return await this.distilleryModel.create(data);
  }

  async add(data: NewDistilleryInput): Promise<DistilleryGraphQLModel> {
    const foundDistillery = await this.findByName(data.name);

    if (foundDistillery) {
      throw emitGraphQLError('NAME_DUPLICATE', 'addDistillery', data.name);
    }

    const { regionId, region, countryId, country } = data;
    const foundRegion = await this.regionsService.addAsChild({
      regionId,
      region,
      countryId,
      country,
    });

    const newDistillery = await this.create({
      ...data,
      regionId: foundRegion?.regionId,
    });

    return await this.getItem(newDistillery.id);
  }

  asChild(data: DistilleryDBModel): IDistilleryAsChild {
    return { distilleryId: data?.id, distillery: data?.name };
  }

  async addAsChild(data: IDistilleryAsChild): Promise<IDistilleryAsChild> {
    let distillery: IDistilleryAsChild = {};

    const { regionId, region, countryId, country } = data;
    const foundRegion = await this.regionsService.addAsChild({
      regionId,
      region,
      countryId,
      country,
    });

    if (data.distilleryId) {
      const found = await this.findById(data.distilleryId);
      if (found) {
        distillery = { ...distillery, ...this.asChild(found) };
      }
    }
    if (!distillery.distilleryId && data.distillery) {
      const found = await this.findByName(data.distillery);
      if (found) {
        distillery = { ...distillery, ...this.asChild(found) };
      } else {
        const created = await this.create({
          ...foundRegion,
          name: data.distillery,
        });
        if (created) {
          distillery = { ...distillery, ...this.asChild(created) };
        }
      }
    }

    return { ...foundRegion, ...distillery };
  }

  async listAll(): Promise<DistilleryGraphQLModel[]> {
    return await this.distilleryModel.find().exec();
  }

  async list(listArgs: ListArgs): Promise<DistilleriesGraphQLListModel> {
    const mainList = await makeList<DistilleryDBModel>(
      this.distilleryModel,
      listArgs,
    );

    return {
      list: mainList.list.map((c: DistilleryDBModel) => ({
        id: c.id,
        name: c.name,
        description: c.description,
      })),
      totalCount: mainList.totalCount,
    };
  }
}
