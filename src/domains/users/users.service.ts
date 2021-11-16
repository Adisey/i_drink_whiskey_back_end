import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgsOLD } from 'src/global/dto/listArgs';
import { isRoleAdmin } from '../../configs/auth.config';
import {
  IDbCreateUser,
  UserDBModel,
} from 'src/domains/users/models/users.model.DB';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserDBModel)
    private readonly usersModel: ModelType<UserDBModel>,
  ) {}

  async create(data: IDbCreateUser): Promise<DocumentType<UserDBModel>> {
    return await this.usersModel.create(data);
  }

  async findUserByRole(role: string): Promise<DocumentType<UserDBModel>> {
    return await this.usersModel.findOne({ role }).exec();
  }

  async findUserByEmail(email: string): Promise<DocumentType<UserDBModel>> {
    return await this.usersModel.findOne({ email }).exec();
  }

  async isUserAdmin(email: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    return isRoleAdmin(user.role);
  }

  async deleteByEmail(
    email: string,
  ): Promise<DocumentType<UserDBModel> | null> {
    return await this.usersModel.findOneAndDelete({ email }).exec();
  }

  async findAll({
    limit,
    skip,
  }: ListArgsOLD): Promise<DocumentType<UserDBModel>[]> {
    // ToDo: 14.10.2021 - Add pagination
    // ToDo: 27.10.2021 - Add total for responds
    return this.usersModel
      .aggregate([{ $limit: skip + limit }, { $skip: skip }])
      .exec();
  }

  async updateById(id: string, dto: IDbCreateUser) {
    return this.usersModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}
