//Core
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { genSalt, hash, compare } from 'bcryptjs';

import { ListArgs } from 'src/global/dto/list.args';
import { UserService } from './user.service';
import { NewUserInput, UserGraphQLModel } from './models/user.model.GraphQL';
import { CreateUserDto } from './models/user.model.DB';
import { ADMIN_ROLE } from './user.consts';

const pubSub = new PubSub();

@Resolver((of) => UserGraphQLModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => [UserGraphQLModel])
  async userList(@Args() listArgs: ListArgs): Promise<UserGraphQLModel[]> {
    return (await this.userService.findAll(listArgs)).map((u) => ({
      email: u.email,
      role: u.role === ADMIN_ROLE ? 'Admin' : 'User',
    }));
  }

  @UsePipes(new ValidationPipe())
  @Mutation(() => UserGraphQLModel)
  async addUser(
    @Args('data') newUserData: NewUserInput,
    isAdmin = false,
  ): Promise<UserGraphQLModel> {
    const salt = await genSalt(10);
    const newUser: CreateUserDto = {
      email: newUserData.email,
      passwordHash: await hash(newUserData.password, salt),
      role: isAdmin ? ADMIN_ROLE : '1',
    };
    const user = (await this.userService.create(
      newUser,
    )) as unknown as UserGraphQLModel;
    console.log(+new Date(), '-(userAdded)->', isAdmin, newUser);
    pubSub.publish('userAdded', { userAdded: user });
    return user;
  }

  @Subscription(() => UserGraphQLModel)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }
}
