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
import { DistilleryDBModel } from 'src/domains/distilleries/models/distilleries.model.DB';
import { DistilleriesService } from 'src/domains/distilleries/distilleries.service';
import { mongoose } from '@typegoose/typegoose';

@Injectable()
export class WhiskyService {
  constructor(
    @InjectModel(WhiskyDBModel)
    @InjectModel(DistilleryDBModel)
    private readonly whiskyModel: ModelType<WhiskyDBModel>,
    private readonly distilleriesService: DistilleriesService,
  ) {}

  async findByName(name: string): Promise<DocumentType<WhiskyDBModel>> {
    return await this.whiskyModel.findOne({ name }).exec();
  }

  async findById(id: string): Promise<WhiskyDBModel> {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await this.whiskyModel.findById(id).exec();
    }
  }

  async findNameById(id: string): Promise<string> {
    return (await this.findById(id)).name;
  }

  async getItem(itemId: string): Promise<WhiskyGraphQLModel> {
    const found = await this.findById(itemId);
    const { id, name, description, distilleryId, age } = found;
    const parent = distilleryId
      ? await this.distilleriesService.getItem(distilleryId)
      : { name: undefined };
    return {
      ...parent,
      distilleryId,
      distillery: parent?.name,
      id,
      name,
      description,
      age,
    };
  }

  async create(data: NewWhiskyInput): Promise<WhiskyDBModel> {
    return await this.whiskyModel.create(data);
  }

  async add(data: NewWhiskyInput): Promise<WhiskyGraphQLModel> {
    const foundWhisky = await this.findByName(data.name);

    if (foundWhisky) {
      throw emitGraphQLError('NAME_DUPLICATE', 'addWhisky', data.name);
    }

    const { distilleryId, distillery, regionId, region, countryId, country } =
      data;
    const foundDistillery = await this.distilleriesService.addAsChild({
      distilleryId,
      distillery,
      regionId,
      region,
      countryId,
      country,
    });

    const newWhisky = await this.create({
      ...data,
      distilleryId: foundDistillery.distilleryId,
    });

    return await this.getItem(newWhisky.id);
  }

  async listAll(): Promise<WhiskyGraphQLModel[]> {
    return await this.whiskyModel.find().exec();
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
