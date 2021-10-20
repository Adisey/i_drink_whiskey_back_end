import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { WhiskyService } from './whisky.service';
import { ListArgs } from 'src/global/dto/list.args';
import {
  NewWhiskyInput,
  WhiskyGraphQLModel,
} from './models/whisky.model.GraphQL';
import { CreateWhiskyDto } from './models/whisky.model.DB';
import { UsePipes, ValidationPipe } from '@nestjs/common';

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
  async whiskyList(@Args() listArgs: ListArgs): Promise<WhiskyGraphQLModel[]> {
    const aa = await this.whiskyService.findAll(listArgs);
    console.log(+new Date(), '-()->', typeof aa, `-aa->`, aa);
    return aa as unknown as WhiskyGraphQLModel[];
  }

  @UsePipes(new ValidationPipe())
  @Mutation((returns) => WhiskyGraphQLModel)
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
