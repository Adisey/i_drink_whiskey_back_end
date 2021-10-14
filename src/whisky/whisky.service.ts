import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ListArgs } from 'src/global/dto/list.args';
import { InjectModel } from '@nestjs/mongoose';
import { Whisky } from './models/whisky.model';
import { IWhiskyDB } from './models/whisky.interface';
import { NewWhiskyInput } from 'src/whisky/models/new-whisky.input';
// import { NewRecipeInput } from './dto/new-recipe.input';
//
@Injectable()
export class WhiskyService {
  constructor(
    @InjectModel('Whisky') private readonly whiskyModel: Model<IWhiskyDB>,
  ) {}
  async create(data: NewWhiskyInput): Promise<Whisky> {
    const createdWhisky = await new this.whiskyModel(data);
    return createdWhisky.save();
    // return newWhisky;
  }

  //
  // async findOneById(id: string): Promise<Recipe> {
  //   return {} as any;
  // }
  //
  async findAll(listArgs: ListArgs): Promise<Whisky[]> {
    // ToDo: 14.10.2021 - Add pagination
    const aa = await this.whiskyModel.find().exec();
    console.log(+new Date(), '-(findAll)->', typeof aa, `-aa->`, aa);
    return aa; //.map((i) => ({ id: i._id, ...i }));
  }
  //
  // async remove(id: string): Promise<boolean> {
  //   return true;
  // }
}
