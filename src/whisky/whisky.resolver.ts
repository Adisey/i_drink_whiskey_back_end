// import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Whisky } from './models/whisky.model';
import { WhiskyService } from './whisky.service';
import { ListArgs } from 'src/global/dto/list.args';
import { NewWhiskyInput } from 'src/whisky/models/new-whisky.input';

const pubSub = new PubSub();

@Resolver((of) => Whisky)
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
  @Query((returns) => [Whisky])
  async whiskyList(@Args() listArgs: ListArgs): Promise<Whisky[]> {
    return await this.whiskyService.findAll(listArgs);
  }

  @Mutation((returns) => Whisky)
  async addWhisky(
    @Args('newWhiskyData') newWhiskyData: NewWhiskyInput,
  ): Promise<Whisky> {
    const whisky = await this.whiskyService.create(newWhiskyData);
    pubSub.publish('whiskyAdded', { whiskyAdded: whisky });
    return whisky;
  }
  //
  // @Mutation((returns) => Boolean)
  // async removeRecipe(@Args('id') id: string) {
  //   return this.recipesService.remove(id);
  // }
  //
  @Subscription((returns) => Whisky)
  whiskyAdded() {
    return pubSub.asyncIterator('whiskyAdded');
  }
}
