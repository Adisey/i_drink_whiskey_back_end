import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { UserService } from './user.service';
import { ListArgs } from 'src/global/dto/list.args';
import { NewUserInput, UserGraphQLModel } from './models/user.model.GraphQL';
import { CreateUserDto } from './models/user.model.DB';

const pubSub = new PubSub();

@Resolver((of) => UserGraphQLModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => [UserGraphQLModel])
  async userList(@Args() listArgs: ListArgs): Promise<UserGraphQLModel[]> {
    const aa = await this.userService.findAll(listArgs);
    console.log(+new Date(), '-(userList)->', typeof aa, `-aa->`, aa);
    const bb: UserGraphQLModel[] = aa.map((u) => ({
      email: u.email,
      password: u.passwordHash,
    }));
    console.log(+new Date(), '-(userList)->', typeof bb, `-bb->`, bb);
    return bb;
  }

  @UsePipes(new ValidationPipe())
  @Mutation((returns) => UserGraphQLModel)
  async addUser(
    @Args('data') newUserData: NewUserInput,
  ): Promise<UserGraphQLModel> {
    const newUser: CreateUserDto = {
      email: newUserData.email,
      passwordHash: '++++',
    };
    const user = (await this.userService.create(
      newUser,
    )) as unknown as UserGraphQLModel;
    pubSub.publish('userAdded', { userAdded: user });
    return user;
  }

  @Subscription(() => UserGraphQLModel)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }
}
