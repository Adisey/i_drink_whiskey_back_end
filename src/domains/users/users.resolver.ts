//Core
import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { ADMIN_ROLE, passwordHash, showRole } from '../../configs/auth.config';
import { ListArgsOLD } from 'src/global/dto/listArgs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersService } from 'src/domains/users/users.service';
import {
  AddUserInput,
  UserGraphQLModel,
} from 'src/domains/users/models/users.model.GraphQL';
import { IDbCreateUser } from 'src/domains/users/models/users.model.DB';
import { getMessage } from 'src/apolloError';
import { FilesGraphQLListModel } from 'src/domains/files/models';
import { FilesGraphQLUploadModel } from 'src/domains/files/models/files.model.GraphQL';

const pubSub = new PubSub();

@Resolver((of) => UserGraphQLModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {
    async function checkDefaultAdmin(userService) {
      const admin = await userService.findUserByRole(ADMIN_ROLE);
      const user = 'admin',
        passport = 'admin';
      if (!admin) {
        await userService.create({
          email: user,
          passwordHash: await passwordHash(passport),
          role: ADMIN_ROLE,
        });
        Logger.warn(
          `Add default admin - "${user}:${passport}"`,
          'Initialization DB',
        );
      }
    }
    setTimeout(() => {
      checkDefaultAdmin(usersService);
    });
  }

  @Query(() => [UserGraphQLModel], {
    description: getMessage('USER_ONLY'),
  })
  @UseGuards(JwtAuthGuard)
  async usersList(@Args() listArgs: ListArgsOLD): Promise<UserGraphQLModel[]> {
    return (await this.usersService.findAll(listArgs)).map((u) => ({
      email: u.email,
      role: showRole(u.role),
    }));
  }

  @Mutation(() => UserGraphQLModel, {
    description: getMessage('USER_ADMIN_ONLY'),
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UsePipes(new ValidationPipe())
  async addUser(
    @Args('data') newUserData: AddUserInput,
    isAdmin = false,
  ): Promise<UserGraphQLModel> {
    const newUser: IDbCreateUser = {
      email: newUserData.email,
      passwordHash: await passwordHash(newUserData.password),
      role: isAdmin ? ADMIN_ROLE : '1',
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
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteUserByEmail(
    @Args('email') email: string,
  ): Promise<UserGraphQLModel> {
    const user = (await this.usersService.deleteByEmail(
      email,
    )) as unknown as UserGraphQLModel;
    user.role = showRole(user.role);
    return user;
  }

  @Subscription(() => UserGraphQLModel, {
    description: getMessage('USER_ONLY'),
  })
  @UseGuards(JwtAuthGuard)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }
}
