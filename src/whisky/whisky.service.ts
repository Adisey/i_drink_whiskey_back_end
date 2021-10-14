import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ListArgs } from 'src/global/dto/list.args';
import { InjectModel } from '@nestjs/mongoose';
import { Whisky } from './models/whisky.model';
import { IWhiskyDB } from './models/whisky.interface';
// import { NewRecipeInput } from './dto/new-recipe.input';
//
@Injectable()
export class WhiskyService {
  constructor(
    @InjectModel('Whisky') private readonly whiskyModel: Model<IWhiskyDB>,
  ) {}
  // async create(data: NewRecipeInput): Promise<Recipe> {
  //   return {} as any;
  // }
  //
  // async findOneById(id: string): Promise<Recipe> {
  //   return {} as any;
  // }
  //
  async findAll(listArgs: ListArgs): Promise<Whisky[]> {
    // ToDo: 14.10.2021 - Add pagination
    return this.whiskyModel.find().exec();
  }
  //
  // async remove(id: string): Promise<boolean> {
  //   return true;
  // }
}
