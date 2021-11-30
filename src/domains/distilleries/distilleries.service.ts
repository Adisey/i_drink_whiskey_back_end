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
} from './models/distilleries.model.GraphQL';

@Injectable()
export class DistilleriesService {
  constructor(
    @InjectModel(DistilleryDBModel)
    private readonly distilleryModel: ModelType<DistilleryDBModel>,
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

    const distillery = await this.create(data);

    console.log(+new Date(), '-()->', distillery.id, distillery.name);
    console.log(
      +new Date(),
      '-()->',
      typeof distillery,
      `-newDistillery->`,
      distillery,
    );

    return {
      id: distillery.id,
      name: distillery.name,
      description: distillery.description,
    };
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
