import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import {
  ADMIN_ROLE_ID,
  passwordHash,
  showRole,
} from '../../configs/auth.config';
import { emitGraphQLError } from '../../apolloError';
import { UserDBModel } from './models/users.model.DB';
import {
  AddUserInput,
  UserGraphQLModel,
  UsersGraphQLListModel,
  UsersListArgs,
} from './models/users.model.GraphQL';
import { makeList } from 'src/common/services/makeList';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserDBModel)
    private readonly usersModel: ModelType<UserDBModel>,
  ) {}

  async addUser(
    user: AddUserInput,
    isAdmin = false,
  ): Promise<UserGraphQLModel> {
    const newUser = await this.usersModel.create({
      email: user.email,
      passwordHash: await passwordHash(user.password),
      roleId: isAdmin ? ADMIN_ROLE_ID : '1',
    });

    return { email: newUser.email, role: showRole(newUser.roleId) };
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

  async usersList(listArgs: UsersListArgs): Promise<UsersGraphQLListModel> {
    const mainList = await makeList<UserDBModel>(this.usersModel, listArgs);

    return {
      list: mainList.list.map((u: UserDBModel) => ({
        email: u.email,
        role: showRole(u.roleId),
      })),
      totalCount: mainList.totalCount,
    };
  }

  // async updateById(id: string, dto: IDbCreateUser) {
  //   return this.usersModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  // }
}
