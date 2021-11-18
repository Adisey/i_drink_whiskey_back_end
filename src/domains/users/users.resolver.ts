//Core
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import {
  ADMIN_ROLE_ID,
  passwordHash,
  showRole,
} from '../../configs/auth.config';
import { ListArgsOLD } from '../../common/dto/listArgs';
import { getMessage } from '../../apolloError';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersService } from './users.service';
import { AddUserInput, UserGraphQLModel } from './models/users.model.GraphQL';
import { IDbCreateUser } from './models/users.model.DB';

const pubSub = new PubSub();

@Resolver((of) => UserGraphQLModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserGraphQLModel], {
    description: getMessage('USER_ONLY'),
  })
  async usersList(@Args() listArgs: ListArgsOLD): Promise<UserGraphQLModel[]> {
    return (await this.usersService.findAll(listArgs)).map((u) => ({
      email: u.email,
      role: showRole(u.roleId),
    }));
  }

  @Mutation(() => UserGraphQLModel, {
    description: getMessage('USER_ADMIN_ONLY'),
  })
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe())
  async addUser(
    @Args('data') newUserData: AddUserInput,
    isAdmin = false,
  ): Promise<UserGraphQLModel> {
    const newUser: IDbCreateUser = {
      email: newUserData.email,
      passwordHash: await passwordHash(newUserData.password),
      roleId: isAdmin ? ADMIN_ROLE_ID : '1',
    };
    const user = (await this.usersService.create(
      newUser,
    )) as unknown as UserGraphQLModel;
    user.role = showRole(user.role);
    pubSub.publish('userAdded', { userAdded: user });
    return user;
  }

  @Mutation(() => UserGraphQLModel, {
    description: getMessage('USER_ADMIN_ONLY'),
  })
  @UseGuards(AdminGuard)
  async deleteUserByEmail(
    @Args('email') email: string,
  ): Promise<UserGraphQLModel> {
    return await this.usersService.deleteByEmail(email);
  }

  @Subscription(() => UserGraphQLModel, {
    description: getMessage('USER_ONLY'),
  })
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }
}
