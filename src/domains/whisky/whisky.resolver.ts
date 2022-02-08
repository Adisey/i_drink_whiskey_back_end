//Core
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import {
  NotFoundException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
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
import { AdminGuard } from 'src/domains/auth/guards';

const pubSub = new PubSub();

@Resolver(() => WhiskyGraphQLModel)
export class WhiskyResolver {
  constructor(private readonly whiskyService: WhiskyService) {}

  @Query(() => WhiskyGraphQLModel)
  @Public()
  async getWhiskyById(@Args('id') id: string): Promise<WhiskyGraphQLModel> {
    const recipe = await this.whiskyService.getItemById(id);
    if (!recipe) {
      throw new NotFoundException(id);
    }
    return recipe;
  }

  @Query(() => WhiskyGraphQLModel)
  @Public()
  async getWhiskyByWB(@Args('WB') WB: string): Promise<WhiskyGraphQLModel> {
    const recipe = await this.whiskyService.getItemByWB(WB);
    if (!recipe) {
      throw new NotFoundException(WB);
    }
    return recipe;
  }

  @Query(() => WhiskyGraphQLModel)
  @Public()
  async getWhiskyByName(
    @Args('name') name: string,
  ): Promise<WhiskyGraphQLModel> {
    const recipe = await this.whiskyService.getItemByName(name);
    if (!recipe) {
      throw new NotFoundException(name);
    }
    return recipe;
  }

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

  @Mutation((returns) => Boolean)
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe())
  async removeWhiskyById(@Args('id') id: string) {
    return this.whiskyService.remove(id);
  }

  @Subscription(() => WhiskyGraphQLModel)
  @Public()
  whiskyAdded() {
    return pubSub.asyncIterator('whiskyAdded');
  }
}
