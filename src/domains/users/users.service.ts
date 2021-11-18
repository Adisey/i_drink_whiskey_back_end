import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgsOLD } from 'src/common/dto/listArgs';
import {
  IDbCreateUser,
  UserDBModel,
} from 'src/domains/users/models/users.model.DB';
import { UserGraphQLModel } from 'src/domains/users/models/users.model.GraphQL';
import { showRole } from 'src/configs/auth.config';
import { emitGraphQLError, getMessage, IMessageType } from 'src/apolloError';

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
      const errorType: IMessageType = 'USER_NOT_FOUND';
      Logger.error(getMessage(errorType), email, 'deleteByEmail');
      throw emitGraphQLError(errorType);
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
