import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { ListArgs } from '../global/dto/list.args';
import { CreateUserDto, UserDBModel } from './models/user.model.DB';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserDBModel)
    private readonly userModel: ModelType<UserDBModel>,
  ) {}

  async create(data: CreateUserDto): Promise<DocumentType<UserDBModel>> {
    return await this.userModel.create(data);
  }

  async findUserByEmail(email: string): Promise<DocumentType<UserDBModel>> {
    return await this.userModel.findOne({ email }).exec();
  }
  async deleteByEmail(
    email: string,
  ): Promise<DocumentType<UserDBModel> | null> {
    return await this.userModel.findOneAndDelete({ email }).exec();
  }

  async findAll(listArgs: ListArgs): Promise<DocumentType<UserDBModel>[]> {
    // ToDo: 14.10.2021 - Add pagination
    return await this.userModel.find().exec();
  }
}
