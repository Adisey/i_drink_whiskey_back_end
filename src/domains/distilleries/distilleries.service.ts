import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgs } from '../../common/dto/listArgs';
import { makeList } from '../../common/services/makeList';
import { DistilleryDBModel } from './models/distilleries.model.DB';
import {
  NewDistilleryInput,
  DistilleriesGraphQLListModel,
  DistilleryGraphQLModel,
} from './models/distilleries.model.GraphQL';
import { emitGraphQLError } from 'src/apolloError';
import { db2GQL } from 'src/common/services';

@Injectable()
export class DistilleriesService {
  constructor(
    @InjectModel(DistilleryDBModel)
    private readonly distilleryModel: ModelType<DistilleryDBModel>,
  ) {}

  async findDistilleryByName(
    name: string,
  ): Promise<DocumentType<DistilleryDBModel>> {
    return await this.distilleryModel.findOne({ name }).exec();
  }

  async findDistilleryById(id: string): Promise<DistilleryDBModel> {
    return await this.distilleryModel.findById(id).exec();
  }

  async findDistilleryNameById(id: string): Promise<string> {
    return (await this.findDistilleryById(id)).name;
  }

  async addDistillery(
    data: NewDistilleryInput,
  ): Promise<DistilleryGraphQLModel> {
    const foundDistillery = await this.findDistilleryByName(data.name);

    if (foundDistillery) {
      throw emitGraphQLError('NAME_DUPLICATE', 'addDistillery', data.name);
    }

    const newDistillery = await this.distilleryModel.create(data);

    console.log(+new Date(), '-()->', newDistillery.id, newDistillery.name);

    return db2GQL(newDistillery);
  }

  async countriesList(
    listArgs: ListArgs,
  ): Promise<DistilleriesGraphQLListModel> {
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
