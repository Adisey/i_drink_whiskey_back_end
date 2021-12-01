import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgsOLD } from 'src/common/dto/listArgs';
import { WhiskyDBModel } from './models/whisky.model.DB';
import {
  NewWhiskyInput,
  WhiskyGraphQLModel,
} from './models/whisky.model.GraphQL';
import { emitGraphQLError } from 'src/apolloError';

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
    };
  }

  async findAll(listArgs: ListArgsOLD): Promise<DocumentType<WhiskyDBModel>[]> {
    // ToDo: 14.10.2021 - Add pagination
    return await this.whiskyModel.find().exec();
  }
}
