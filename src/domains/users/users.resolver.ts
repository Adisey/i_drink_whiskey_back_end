//Core
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { getMessage } from '../../apolloError';
import { AdminGuard } from '../auth/guards';
import { UsersService } from './users.service';
import {
  AddUserInput,
  UserGraphQLModel,
  UsersGraphQLListModel,
  UsersListArgs,
} from './models/users.model.GraphQL';
import { User } from 'src/domains/auth/decorators/user.decorator';
import { showRole } from 'src/configs/auth.config';
import { UserDBModel } from 'src/domains/users/models/users.model.DB';

const pubSub = new PubSub();

@Resolver(() => UserGraphQLModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserGraphQLModel, {
    description: getMessage('USER_ONLY'),
  })
  async whoami(@User() user: UserDBModel): Promise<UserGraphQLModel> {
    return { email: user.email, role: showRole(user.roleId) };
  }

  @Query(() => UsersGraphQLListModel, {
    description: getMessage('USER_ONLY'),
  })
  async usersList(
    @Args() listArgs: UsersListArgs,
  ): Promise<UsersGraphQLListModel> {
    return await this.usersService.usersList(listArgs);
  }

  @Mutation(() => UserGraphQLModel, {
    description: getMessage('USER_ADMIN_ONLY'),
  })
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe())
  async addUser(
    @Args('data') newUserData: AddUserInput,
  ): Promise<UserGraphQLModel> {
    const user = await this.usersService.addUser(newUserData);
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
