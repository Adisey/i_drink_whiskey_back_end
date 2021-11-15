import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { ListArgsOLD } from 'src/global/dto/listArgs';
import { WhiskyService } from './whisky.service';
import {
  NewWhiskyInput,
  WhiskyGraphQLModel,
} from './models/whisky.model.GraphQL';
import { CreateWhiskyDto } from './models/whisky.model.DB';

const pubSub = new PubSub();

@Resolver((of) => WhiskyGraphQLModel)
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
  @Query((returns) => [WhiskyGraphQLModel])
  async whiskyList(
    @Args() listArgs: ListArgsOLD,
  ): Promise<WhiskyGraphQLModel[]> {
    const aa = await this.whiskyService.findAll(listArgs);
    console.log(+new Date(), '-()->', typeof aa, `-aa->`, aa);
    return aa as unknown as WhiskyGraphQLModel[];
  }

  @Mutation((returns) => WhiskyGraphQLModel)
  @UsePipes(new ValidationPipe())
  async addWhisky(
    @Args('data') newWhiskyData: NewWhiskyInput,
  ): Promise<WhiskyGraphQLModel> {
    const whisky = (await this.whiskyService.create(
      newWhiskyData as CreateWhiskyDto,
    )) as unknown as WhiskyGraphQLModel;
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
