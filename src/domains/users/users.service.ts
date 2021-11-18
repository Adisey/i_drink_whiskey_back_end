import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { showRole } from '../../configs/auth.config';
import { ListArgsOLD } from '../../common/dto/listArgs';
import { emitGraphQLError, getMessage, IMessageType } from '../../apolloError';
import { IDbCreateUser, UserDBModel } from './models/users.model.DB';
import { UserGraphQLModel } from './models/users.model.GraphQL';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserDBModel)
    private readonly usersModel: ModelType<UserDBModel>,
  ) {}

  async create(data: IDbCreateUser): Promise<DocumentType<UserDBModel>> {
    return await this.usersModel.create(data);
  }

  async findUserByRole(roleId: string): Promise<DocumentType<UserDBModel>> {
    return await this.usersModel.findOne({ roleId }).exec();
  }

  async findUserByEmail(email: string): Promise<DocumentType<UserDBModel>> {
    return await this.usersModel.findOne({ email }).exec();
  }

  // async isUserAdmin(email: string): Promise<boolean> {
  //   const user = await this.findUserByEmail(email);
  //   return isRoleAdmin(user.roleId);
  // }

  async deleteByEmail(email: string): Promise<UserGraphQLModel | null> {
    try {
      const deletedUser = await this.usersModel
        .findOneAndDelete({ email })
        .exec();
      return {
        email: deletedUser.email,
        role: showRole(deletedUser.roleId),
      };
    } catch (e) {
      throw emitGraphQLError('USER_NOT_FOUND', 'deleteByEmail', email, e);
    }
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

  // async updateById(id: string, dto: IDbCreateUser) {
  //   return this.usersModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  // }
}
