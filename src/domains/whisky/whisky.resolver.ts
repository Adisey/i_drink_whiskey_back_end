import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { ListArgs } from 'src/common/dto/listArgs';
import { WhiskyService } from './whisky.service';
import {
  NewWhiskyInput,
  WhiskiesGraphQLListModel,
  WhiskyGraphQLModel,
} from './models/whisky.model.GraphQL';

const pubSub = new PubSub();

@Resolver(() => WhiskyGraphQLModel)
export class WhiskyResolver {
  constructor(private readonly whiskyService: WhiskyService) {}

  // @Query((returns) => Recipe)
  // async recipe(@Args('id') id: string): Promise<Recipe> {
  //   const recipe = await this.recipesService.findOneById(id);
  //   if (!recipe) {
  //     throw new NotFoundException(id);
  //   }
  //   return recipe;
  // }
  //
  @Query((returns) => WhiskiesGraphQLListModel)
  async whiskyList(
    @Args() listArgs: ListArgs,
  ): Promise<WhiskiesGraphQLListModel> {
    return await this.whiskyService.list(listArgs);
  }

  @Mutation((returns) => WhiskyGraphQLModel)
  @UsePipes(new ValidationPipe())
  async addWhisky(
    @Args('data') newWhiskyData: NewWhiskyInput,
  ): Promise<WhiskyGraphQLModel> {
    const whisky = await this.whiskyService.add(newWhiskyData);
    pubSub.publish('whiskyAdded', { whiskyAdded: whisky });
    return whisky;
  }
  //
  // @Mutation((returns) => Boolean)
  // async removeRecipe(@Args('id') id: string) {
  //   return this.recipesService.remove(id);
  // }
  //
  @Subscription(() => WhiskyGraphQLModel)
  whiskyAdded() {
    return pubSub.asyncIterator('whiskyAdded');
  }
}
