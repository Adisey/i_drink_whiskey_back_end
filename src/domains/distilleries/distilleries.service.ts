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
import { RegionDBModel } from 'src/domains/regions/models/regions.model.DB';
import { RegionsService } from 'src/domains/regions/regions.service';
import { IRegionAsChild } from 'src/domains/regions/models/regions.model.GraphQL';

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
    return await this.distilleryModel.findById(id).exec();
  }

  async findNameById(id: string): Promise<string> {
    return (await this.findById(id)).name;
  }

  async create(data: NewDistilleryInput): Promise<DistilleryDBModel> {
    return await this.distilleryModel.create(data);
  }

  async add(data: NewDistilleryInput): Promise<DistilleryGraphQLModel> {
    const foundDistillery = await this.findByName(data.name);

    if (foundDistillery) {
      throw emitGraphQLError('NAME_DUPLICATE', 'addDistillery', data.name);
    }

    const foundRegion = await this.regionsService.addAsChild(data);

    const distillery = await this.create({
      ...data,
      regionId: foundRegion?.regionId,
    });

    return {
      id: distillery.id,
      name: distillery.name,
      description: distillery.description,
      ...foundRegion,
    };
  }

  asChild(data: DistilleryDBModel): IDistilleryAsChild {
    return { distilleryId: data?.id, distillery: data?.name };
  }

  async addAsChild(data: IDistilleryAsChild): Promise<IDistilleryAsChild> {
    let distillery: IDistilleryAsChild = {};

    const region = await this.regionsService.addAsChild(data);

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
          name: data.distilleryId,
          ...region,
        });
        if (created) {
          distillery = { ...distillery, ...this.asChild(created) };
        }
      }
    }

    return { ...distillery, ...region };
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
