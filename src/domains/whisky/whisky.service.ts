import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgs } from '../../global/dto/list.args';
import { CreateWhiskyDto, WhiskyDBModel } from './models/whisky.model.DB';

@Injectable()
export class WhiskyService {
  constructor(
    @InjectModel(WhiskyDBModel)
    private readonly whiskyModel: ModelType<WhiskyDBModel>,
  ) {}

  async create(data: CreateWhiskyDto): Promise<DocumentType<WhiskyDBModel>> {
    return await this.whiskyModel.create(data);
  }

  async findAll(listArgs: ListArgs): Promise<DocumentType<WhiskyDBModel>[]> {
    // ToDo: 14.10.2021 - Add pagination
    return await this.whiskyModel.find().exec();
  }
}
