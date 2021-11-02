//Core
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { ADMIN_ROLE, passwordHash, showRole } from '../../configs/auth.config';
import { ListArgs } from '../../global/dto/list.args';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserService } from './user.service';
import { NewUserInput, UserGraphQLModel } from './models/user.model.GraphQL';
import { IDbCreateUser } from './models/user.model.DB';

const pubSub = new PubSub();

@Resolver((of) => UserGraphQLModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {
    async function checkDefaultAdmin(userService) {
      const admin = await userService.findUserByRole(ADMIN_ROLE);
      if (!admin) {
        const newAdmin = await userService.create({
          email: 'admin',
          passwordHash: await passwordHash('admin'),
          role: ADMIN_ROLE,
        });
        console.warn(+new Date(), 'Add default admin:', newAdmin.email);
      }
    }

    setTimeout(() => {
      checkDefaultAdmin(userService);
    });
  }

  @Query(() => [UserGraphQLModel])
  @UseGuards(JwtAuthGuard)
  async userList(@Args() listArgs: ListArgs): Promise<UserGraphQLModel[]> {
    return (await this.userService.findAll(listArgs)).map((u) => ({
      email: u.email,
      role: showRole(u.role),
    }));
  }

  @UsePipes(new ValidationPipe())
  @Mutation(() => UserGraphQLModel)
  @UseGuards(JwtAuthGuard, AdminGuard)
  async addUser(
    @Args('data') newUserData: NewUserInput,
    isAdmin = false,
  ): Promise<UserGraphQLModel> {
    const newUser: IDbCreateUser = {
      email: newUserData.email,
      passwordHash: await passwordHash(newUserData.password),
      role: isAdmin ? ADMIN_ROLE : '1',
    };
    const user = (await this.userService.create(
      newUser,
    )) as unknown as UserGraphQLModel;
    user.role = showRole(user.role);
    console.log(+new Date(), '-(userAdded)->', isAdmin, newUser);
    pubSub.publish('userAdded', { userAdded: user });
    return user;
  }

  @Mutation(() => UserGraphQLModel)
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteUserByEmail(
    @Args('email') email: string,
  ): Promise<UserGraphQLModel> {
    const user = (await this.userService.deleteByEmail(
      email,
    )) as unknown as UserGraphQLModel;
    user.role = showRole(user.role);
    return user;
  }

  @Subscription(() => UserGraphQLModel)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }
}
