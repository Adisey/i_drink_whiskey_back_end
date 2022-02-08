//Core
import {
  NotFoundException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
//Main
import { getMessage } from '../../apolloError';
import { ListArgs } from '../../common/dto/listArgs';
//Domains
import { AdminGuard } from '../auth/guards';
import { Public } from '../auth/decorators/public.decorator';
//Local
import { DistilleriesService } from './distilleries.service';

import {
  DistilleryGraphQLModel,
  DistilleriesGraphQLListModel,
  NewDistilleryInput,
  DistilleryChildrenGraphQLModel,
} from './models/distilleries.model.GraphQL';
import { WhiskyService } from 'src/domains/whisky/whisky.service';

const pubSub = new PubSub();

@Resolver(() => DistilleryGraphQLModel)
export class DistilleriesResolver {
  constructor(
    private readonly distilleriesService: DistilleriesService,
    private readonly whiskyService: WhiskyService,
  ) {}

  @Query(() => DistilleryChildrenGraphQLModel)
  @Public()
  async getDistillery(
    @Args('id') id: string,
  ): Promise<DistilleryChildrenGraphQLModel> {
    const recipe = await this.distilleriesService.getItem(id);
    if (!recipe) {
      throw new NotFoundException(id);
    }
    const whiskies = await this.whiskyService.listByDistillery(id);

    return {
      ...recipe,
      children: whiskies,
    };
  }

  @Query(() => DistilleriesGraphQLListModel)
  @Public()
  async distilleriesList(
    @Args() listArgs: ListArgs,
  ): Promise<DistilleriesGraphQLListModel> {
    return await this.distilleriesService.list(listArgs);
  }

  @Mutation(() => DistilleryGraphQLModel, {
    description: getMessage('USER_ADMIN_ONLY'),
  })
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe())
  async addDistillery(
    @Args('data') data: NewDistilleryInput,
  ): Promise<DistilleryGraphQLModel> {
    const distillery = await this.distilleriesService.add(data);
    pubSub.publish('distilleryAdded', { distilleryAdded: distillery });
    return distillery;
  }

  @Subscription(() => DistilleryGraphQLModel)
  @Public()
  distilleryAdded() {
    return pubSub.asyncIterator('distilleryAdded');
  }
}
