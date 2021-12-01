import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgs } from 'src/common/dto/listArgs';
import { makeList } from 'src/common/services';
import { emitGraphQLError } from 'src/apolloError';
import { WhiskyDBModel } from './models/whisky.model.DB';
import {
  NewWhiskyInput,
  WhiskiesGraphQLListModel,
  WhiskyGraphQLModel,
} from './models/whisky.model.GraphQL';

@Injectable()
export class WhiskyService {
  constructor(
    @InjectModel(WhiskyDBModel)
    private readonly whiskyModel: ModelType<WhiskyDBModel>,
  ) {}

  async findByName(name: string): Promise<DocumentType<WhiskyDBModel>> {
    return await this.whiskyModel.findOne({ name }).exec();
  }

  async create(data: NewWhiskyInput): Promise<DocumentType<WhiskyDBModel>> {
    return await this.whiskyModel.create(data);
  }

  async add(data: NewWhiskyInput): Promise<WhiskyGraphQLModel> {
    const foundwhisky = await this.findByName(data.name);

    if (foundwhisky) {
      throw emitGraphQLError('NAME_DUPLICATE', 'addWhisky', data.name);
    }

    // const foundRegion = await this.regionsService.addAsChild(data);

    const whisky = await this.create({
      ...data,
    });

    return {
      id: whisky.id,
      name: whisky.name,
      description: whisky.description,
      // ToDo: 01.12.2021 - add other fields
    };
  }

  async list(listArgs: ListArgs): Promise<WhiskiesGraphQLListModel> {
    const mainList = await makeList<WhiskyDBModel>(this.whiskyModel, listArgs);

    return {
      list: mainList.list.map((whisky: WhiskyDBModel) => ({
        id: whisky.id,
        name: whisky.name,
        description: whisky.description,
      })),
      totalCount: mainList.totalCount,
    };
  }
}
