//Core
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

//Main
import { ListArgs } from '../../common/dto/listArgs';
//Domains
import { Public } from '../auth/decorators/public.decorator';
//Local
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

  @Query(() => WhiskyGraphQLModel)
  @Public()
  async getWhiskyId(@Args('id') id: string): Promise<WhiskyGraphQLModel> {
    const recipe = await this.whiskyService.getItem(id);
    if (!recipe) {
      throw new NotFoundException(id);
    }
    return recipe;
  }

  // @Query(() => WhiskyGraphQLModel)
  // @Public()
  // async getWhiskyWB(@Args('WB') WB: string): Promise<WhiskyGraphQLModel> {
  //   const recipe = await this.whiskyService.getItem(id);
  //   if (!recipe) {
  //     throw new NotFoundException(id);
  //   }
  //   return recipe;
  // }

  @Query(() => WhiskiesGraphQLListModel)
  @Public()
  async whiskyList(
    @Args() listArgs: ListArgs,
  ): Promise<WhiskiesGraphQLListModel> {
    return await this.whiskyService.list(listArgs);
  }

  @Mutation(() => WhiskyGraphQLModel)
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
